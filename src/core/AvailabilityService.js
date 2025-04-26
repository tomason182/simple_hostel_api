export class AvailabilityService {
  constructor(availabilityTransactionManagerPort) {
    this.availabilityTransactionManagerPort =
      availabilityTransactionManagerPort;
    this.reservationsToUpdate = [];
    this.assignedBedsToCurrentReservation = [];
  }

  async checkAvailabilityForProperty(
    propertyId,
    checkIn,
    checkOut,
    conn = null
  ) {
    try {
      // Check dates
      if (checkIn >= checkOut) {
        return {
          status: "error",
          msg: "Invalid dates order",
        };
      }

      if (!checkIn instanceof Date || !checkOut instanceof Date) {
        return {
          status: "error",
          msg: "Invalid date format",
        };
      }

      // Obtenemos lo rangos de rates and avaialbility seteados por el usuario.
      const ratesAndAvailabilityRanges =
        await this.availabilityTransactionManagerPort.getPropertyRatesAndAvailabilityRanges(
          propertyId,
          checkIn,
          checkOut,
          conn
        );

      if (ratesAndAvailabilityRanges.length === 0) {
        return {
          status: "error",
          msg: "No rates and availabilities created",
        };
      }

      const roomTypes =
        await this.availabilityTransactionManagerPort.getPropertyRoomTypes(
          propertyId
        );

      const reservations =
        await this.availabilityTransactionManagerPort.getOverlappingReservationsByPropertyId(
          propertyId,
          checkIn,
          checkOut
        );

      const currencies =
        await this.availabilityTransactionManagerPort.getPropertyCurrencies(
          propertyId
        );

      const paymentPolicies =
        await this.availabilityTransactionManagerPort.getPropertyPaymentPolicies(
          propertyId
        );

      let roomList = [];

      const totalNights = (checkOut - checkIn) / (1000 * 3600 * 24);

      for (const roomType of roomTypes) {
        let availability = roomType.max_occupancy * roomType.inventory;
        let accRate = 0;
        let totalRate = 0;
        let room = {
          ...roomType,
          availability,
          totalRate,
        };

        const filteredRatesByRoom = ratesAndAvailabilityRanges.filter(
          r => r.room_type_id === roomType.id
        );

        const filteredReservations = reservations.filter(
          r => r.room_type_id === roomType.id
        );

        const startDate = new Date(checkIn);
        for (
          let date = startDate;
          date < checkOut;
          date.setDate(date.getDate() + 1)
        ) {
          const currentDate = date;
          const hasRange = filteredRatesByRoom.find(
            r => r.start_date <= currentDate && r.end_date >= currentDate
          );
          // Check if there is a rates and availability range created for the current date.
          if (hasRange === undefined) {
            room.availability = 0;
            room.totalRate = 0;
            break;
          }

          const overlappingReservations = filteredReservations.filter(
            r => r.check_in <= currentDate && r.check_out > currentDate
          );

          let totalRoomsOccupied = overlappingReservations.reduce(
            (acc, reservation) => acc + reservation.number_of_rooms,
            0
          );

          const availableBeds = hasRange.rooms_to_sell - totalRoomsOccupied;

          accRate += Number(hasRange.custom_rate);

          if (availableBeds < availability) {
            availability = availableBeds;
            room.availability = availability;
          }
        }

        if (room.availability > 0) {
          room.totalRate = Math.round(accRate * 100) / 100;
          roomList.push(room);
        }
      }

      return {
        totalNights,
        currencies,
        paymentPolicies,
        roomList,
      };
    } catch (e) {
      throw e;
    }
  }

  async checkAvailabilityAndAssignBeds(reservation, conn = null) {
    this.assignedBedsToCurrentReservation = [];
    this.reservationsToUpdate = [];
    try {
      const selectedRooms = reservation.getSelectedRooms();
      const checkIn = reservation.getCheckIn();
      const checkOut = reservation.getCheckOut();
      const propertyId = reservation.getPropertyId();

      // NECESITAMOS EL ID DE LA RESERVA. SI RESERVA NUEVA ID = NULL ENTONCES ESTABLECEMOS -1 A EFECTOS DE FILTRAR LA RESERVA DE LA BD.
      const reservationId = reservation.getId() || -1;

      const roomsIdList = selectedRooms.flatMap(room => room.room_type_id);

      // GET PROPERTY RANGES.
      // Get ranges for all selected room types and lock rows to prevent race conditions.
      const ranges = await this.availabilityTransactionManagerPort.getAllRanges(
        roomsIdList,
        checkIn,
        checkOut,
        conn
      );

      if (ranges.length === 0) {
        return {
          status: "error",
          msg: "Property close for the selected rates.",
        };
      }

      for (const room of selectedRooms) {
        // Bring the availability ranges
        const rangeList = ranges.filter(
          range => range.room_type_id === room.room_type_id
        );

        if (rangeList.length === 0) {
          return {
            status: "error",
            msg: `No rates and availability ranges created for room type ${room.room_type_id}.`,
          };
        }

        // Get the room type.
        const roomType =
          await this.availabilityTransactionManagerPort.findRoomTypeById(
            room.room_type_id,
            propertyId,
            conn
          );

        if (!roomType) {
          return {
            status: "error",
            msg: "Unable to find the room type",
          };
        }

        // Brings the reservation_room table and the check-in, check-out from the reservation table.
        // CREO QUE ACA SE PODRIA FILTRAR OVERLAPPING RESERVATIONS POR RESERVATION ID. PARA USER ESTO MISMO PARA EL CAMBIO DE FECHAS (1).
        // (1) SE PUEDE FILTARR DIRECTAMENTE EN LA BD.
        const overlappingReservations =
          await this.availabilityTransactionManagerPort.getOverlappingReservations(
            room.room_type_id,
            reservationId,
            checkIn,
            checkOut,
            conn
          );

        const initialDate = new Date(checkIn);

        let total_amount = 0;
        for (
          let date = initialDate;
          date < checkOut;
          date.setDate(date.getDate() + 1)
        ) {
          const currentDate = date;
          const hasRange = rangeList.find(
            r => r.start_date <= currentDate && r.end_date >= currentDate
          );
          // Check if there is a rates and availability range created for the current date.
          if (hasRange === undefined) {
            return {
              status: "error",
              msg: "There are rates and availability ranges missing.",
            };
          }

          const filteredReservations = overlappingReservations.filter(
            r => r.check_in <= date && r.check_out > date
          );

          filteredReservations.push(room);

          let totalRoomsOccupied = filteredReservations.reduce(
            (acc, reservation) => acc + reservation.number_of_rooms,
            0
          );

          const availability = hasRange.rooms_to_sell;
          total_amount += Number(hasRange.custom_rate);

          if (totalRoomsOccupied > availability) {
            return {
              status: "error",
              msg: "No room available",
            };
          }
        }

        total_amount = total_amount * room.number_of_rooms;
        reservation.setTotalAmount(room.room_type_id, total_amount);

        const roomTypeTotalBeds =
          await this.availabilityTransactionManagerPort.getRoomTypeBeds(
            room.room_type_id,
            conn
          );

        const currentReservation = {
          id: reservationId,
          check_in: reservation.getCheckIn(),
          check_out: reservation.getCheckOut(),
          number_of_rooms: reservation.getNumberOfRooms(room.room_type_id),
          room_type_id: room.room_type_id,
          assigned_beds: {},
        };

        const bedAssignment = new BedAssignment(
          this,
          roomType,
          roomTypeTotalBeds
        );

        // (2) CAMBIAR FECHAS: CREO QUE ACÁ SE PUEDE FILTRAR DE RESERVATION LIST EL ID DE LA RESERVA (SI ESTA RESERVA YA FUE CREADA Y SE QUIERE CAMBIAR FECHAS.)
        // SI LA RESERVA ES NUEVA NO TIENE UN ID POR LO QUE HAY QUE CONDICIONAR.
        await bedAssignment.getReservationsListLimit(
          checkIn,
          reservationId,
          500,
          conn
        );
        await bedAssignment.assignBedsToReservation(currentReservation, conn);
      }

      return {
        status: "ok",
        bedsToAssign: this.assignedBedsToCurrentReservation,
        reservationsToUpdate: this.reservationsToUpdate,
      };
    } catch (e) {
      throw e;
    }
  }
}

class BedAssignment {
  constructor(availabilityService, roomType, roomTypeTotalBeds) {
    this.availabilityService = availabilityService;
    this.roomType = roomType;
    this.roomTypeTotalBeds = roomTypeTotalBeds;
    this.reservationsList = [];
  }

  async getReservationsListLimit(
    from,
    reservationToFilter,
    limit,
    conn = null
  ) {
    // Bring all the reservations with a check-out greater that the current reservation check-in. LIMIT 500 reservations.
    // VER (2)
    this.reservationsList =
      await this.availabilityService.availabilityTransactionManagerPort.getReservationsListLimit(
        this.roomType.id,
        reservationToFilter,
        from,
        limit,
        conn
      );
  }

  pushReservationToList(reservation) {
    // The new reservation that we are trying to create has no ID yet, we set up a provisional ID and add the reservation to the list
    this.reservationsList.push(reservation);
  }

  pushReservationToUpdate(reservation) {
    const index = this.availabilityService.reservationsToUpdate.findIndex(
      element => element.id === reservation.id
    );

    if (index !== -1) {
      this.availabilityService.reservationsToUpdate[index] = {
        id: reservation.id,
        bed_id: reservation.bed_id,
      };
    } else {
      this.availabilityService.reservationsToUpdate.push(reservation);
    }
  }

  pushBedsToCurrentReservation(beds) {
    this.availabilityService.assignedBedsToCurrentReservation.push(...beds);
  }

  async assignBedsToReservation(currentReservation, conn = null) {
    const checkIn = currentReservation.check_in;
    const checkOut = currentReservation.check_out;

    // if (condition to retrieve more reservations if we are reaching the end of the list)

    const overlappingReservations = this.reservationsList.filter(
      r => r.check_in < checkOut && r.check_out > checkIn
    );

    const result = this.greedyBedAssignment(
      currentReservation,
      overlappingReservations
    );

    if (result === false) {
      await this.resolveConflictWithBackTracking(currentReservation);
    }

    return true;
  }

  async resolveConflictWithBackTracking(reservation) {
    const leftSideOverlappingReservations = this.reservationsList.filter(
      r =>
        r.check_in <= reservation.check_in && r.check_out > reservation.check_in
    );

    const result = this.greedyBedAssignment(
      reservation,
      leftSideOverlappingReservations
    );

    if (result === false) {
      return null;
    }

    const assignBeds = Object.values(result.assigned_beds);

    const overlappingReservations = this.reservationsList.filter(
      r =>
        r.check_in <= reservation.check_out &&
        r.check_out > reservation.check_in &&
        r.id !== reservation.id
    );

    const reservationsWithConflict = overlappingReservations.filter(r => {
      const rBeds = Object.values(r.assigned_beds);
      return assignBeds.some(bed => rBeds.includes(bed));
    });

    reservationsWithConflict.sort((a, b) => {
      const dateA = a.check_in;
      const dateB = b.check_in;

      if (dateA < dateB) {
        return -1;
      }

      if (dateA > dateB) {
        return 1;
      }

      return 0;
    });

    this.reservationsList = this.reservationsList.filter(
      reservation =>
        !reservationsWithConflict.some(
          conflict => conflict.id === reservation.id
        )
    );

    for (const reservation of reservationsWithConflict) {
      await this.assignBedsToReservation(reservation);
    }
  }

  greedyBedAssignment(reservation, overlappingReservations) {
    const currentReservationBeds = {};

    for (const [key, value] of Object.entries(reservation.assigned_beds)) {
      if (this.roomTypeTotalBeds.includes(value)) {
        currentReservationBeds[key] = value;
      }
    }

    let assignedBeds = new Set(); // Set works if we handle only primitive values (strings or numbers)

    for (const overlappingReservation of overlappingReservations) {
      const beds = Object.values(overlappingReservation.assigned_beds);
      beds.forEach(bed => assignedBeds.add(bed));
    }

    const freeBeds = this.roomTypeTotalBeds.filter(
      bed => !assignedBeds.has(bed)
    );

    const numberOfRoomsNeeded = reservation.number_of_rooms;

    if (freeBeds.length < numberOfRoomsNeeded) {
      return false;
    }

    const bedsToAssign = freeBeds.slice(0, numberOfRoomsNeeded);

    if (Object.keys(currentReservationBeds).length > 0) {
      Object.keys(currentReservationBeds).forEach((key, index) => {
        currentReservationBeds[key] = freeBeds[index];

        this.pushReservationToUpdate({
          id: key,
          bed_id: freeBeds[index],
        });
      });
    } else {
      bedsToAssign.forEach((bed, index) => {
        currentReservationBeds[index] = bed;
      });

      this.pushBedsToCurrentReservation(bedsToAssign);
    }

    reservation.assigned_beds = currentReservationBeds;

    this.pushReservationToList(reservation);

    return reservation;
  }
}
