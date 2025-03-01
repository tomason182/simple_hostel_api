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
      // En realidad no necesitamos los room types sino lo rangos de rates and avaialbility seteados por el usuario.
      const ratesAndAvailabilityRanges =
        await this.availabilityTransactionManagerPort.getPropertyRatesAndAvailabilityRanges(
          propertyId,
          checkIn,
          checkOut,
          conn
        );

      console.log(ratesAndAvailabilityRanges);

      if (ratesAndAvailabilityRanges.length === 0) {
        throw new Error(
          "There are no rates and availability created for this property"
        );
      }

      const reservations =
        await this.availabilityTransactionManagerPort.getOverlappingReservations(
          propertyId,
          checkIn,
          checkOut
        );
    } catch (e) {
      throw e;
    }
  }

  async checkCustomAvailability(
    roomType,
    startDate,
    endDate,
    customAvailability,
    conn = null
  ) {
    try {
      // Get the reservations for the current range start date - end date.
      const reservationList =
        await this.availabilityTransactionManagerPort.getOverlappingReservations(
          roomType.getId(),
          startDate,
          endDate,
          conn
        );

      const maxCapacity = roomType.getInventory() * roomType.getMaxOccupancy();

      if (customAvailability > maxCapacity) {
        return {
          status: false,
          maxAvailability: maxCapacity,
        };
      }

      if (reservationList.length === 0) {
        return {
          status: true,
          maxAvailability: maxCapacity,
        };
      }

      let maxAvailability = 0;
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const currentDate = date;
        const reservations = reservationList.filter(
          r => r.check_in <= currentDate && r.check_out > currentDate
        );
        const totalGuest = reservations.reduce(
          (acc, value) => acc + value.number_of_guests
        );

        if (customAvailability > maxCapacity - totalGuest) {
          return {
            status: false,
            maxAvailability: maxCapacity - totalGuest,
          };
        }

        maxAvailability =
          maxAvailability > maxCapacity - totalGuest
            ? maxCapacity - totalGuest
            : maxAvailability;
      }

      return {
        status: true,
        maxAvailability,
      };
    } catch (e) {
      throw e;
    }
  }

  async checkAvailabilityAndAssignBeds(reservation, ranges, conn = null) {
    try {
      const selectedRooms = reservation.getSelectedRooms();
      const checkIn = reservation.getCheckIn();
      const checkOut = reservation.getCheckOut();
      const propertyId = reservation.getPropertyId();

      for (const room of selectedRooms) {
        // Bring the availability ranges
        const rangeList = ranges.filter(
          range => range.room_type_id === room.room_type_id
        );

        if (rangeList.length === 0) {
          throw new Error(
            `No rates and availability ranges created for room type ${room.room_type_id}.`
          );
        }

        // Get the room type.
        const roomType =
          await this.availabilityTransactionManagerPort.findRoomTypeById(
            room.room_type_id,
            propertyId,
            conn
          );

        if (!roomType) {
          throw new Error("Unable to find the room type");
        }

        // Brings the reservation_room table and the check-in, check-out from the reservation table.
        const overlappingReservations =
          await this.availabilityTransactionManagerPort.getOverlappingReservations(
            room.room_type_id,
            checkIn,
            checkOut,
            conn
          );

        const initialDate = new Date(checkIn);

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
            throw new Error("There are rates and availability ranges missing.");
          }

          const filteredReservations = overlappingReservations.filter(
            r => r.check_in <= date && r.check_out > date
          );

          filteredReservations.push(room);

          let totalGuest =
            roomType.type === "dorm"
              ? filteredReservations.reduce(
                  (acc, reservation) => acc + reservation.number_of_guests,
                  0
                )
              : filteredReservations.length;

          const availability = hasRange.customAvailability;

          if (totalGuest > availability) {
            return false;
          }
        }

        const roomTypeTotalBeds =
          await this.availabilityTransactionManagerPort.getRoomTypeBeds(
            room.room_type_id,
            conn
          );

        const currentReservation = {
          id: -1,
          check_in: reservation.getCheckIn(),
          check_out: reservation.getCheckOut(),
          number_of_guests: reservation.getNumberOfGuest(room.room_type_id),
          room_type_id: room.room_type_id,
          assigned_beds: {},
        };

        const bedAssignment = new BedAssignment(
          this,
          roomType,
          roomTypeTotalBeds
        );
        await bedAssignment.getReservationsListLimit(checkIn, conn);
        await bedAssignment.assignBedsToReservation(currentReservation, conn);
      }

      return {
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

  async getReservationsListLimit(from, limit, conn = null) {
    // Bring all the reservations with a check-out greater that the current reservation check-in. LIMIT 500 reservations.
    this.reservationsList =
      await this.availabilityService.availabilityTransactionManagerPort.getReservationsListLimit(
        this.roomType.id,
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
    this.availabilityService.reservationsToUpdate.push(reservation);
  }

  pushBedsToCurrentReservation(beds) {
    this.availabilityService.assignedBedsToCurrentReservation.push(...beds);
  }

  async assignBedsToReservation(currentReservation, conn = null) {
    const checkIn = currentReservation.check_in;
    const checkOut = currentReservation.check_out;

    // if (condition to retrieve more reservations if we are reaching the end of the list)

    const overlappingReservations = this.reservationsList.filter(
      r => r.check_in <= checkOut && r.check_out > checkIn
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

    const numberOfGuest = reservation.number_of_guests;

    const bedsNeeded = this.roomType.type === "dorm" ? numberOfGuest : 1;

    if (freeBeds.length < bedsNeeded) {
      return false;
    }

    const bedsToAssign = freeBeds.slice(0, bedsNeeded);

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
