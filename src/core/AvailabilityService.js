export class AvailabilityService {
  constructor(availabilityTransactionManagerPort) {
    this.availabilityTransactionManagerPort =
      availabilityTransactionManagerPort;
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

  async checkAvailability(
    selectedRoom,
    propertyId,
    checkIn,
    checkOut,
    conn = null
  ) {
    try {
      // Bring the availability ranges
      const ranges = await this.availabilityTransactionManagerPort.getRanges(
        selectedRoom.room_type_id,
        checkIn,
        checkOut,
        conn
      );

      if (ranges.length === 0) {
        throw new Error("No rates and availability ranges created.");
      }

      // Get the room type.
      const roomType =
        await this.availabilityTransactionManagerPort.findRoomTypeById(
          selectedRoom.room_type_id,
          propertyId
        );

      // Brings the reservation_room table and the check-in, check-out from the reseravtion table.
      const reservationList =
        await this.availabilityTransactionManagerPort.getOverlappingReservations(
          selectedRoom.room_type_id,
          checkIn,
          checkOut
        );

      const initialDate = checkIn;
      for (
        let date = initialDate;
        date < checkOut;
        date.setDate(date.getDate() + 1)
      ) {
        const currentDate = date;
        const hasRange = ranges.find(
          r => r.start_date <= currentDate && r.end_date >= currentDate
        );
        // Check if there is a rates and availability range created for the current date.
        if (hasRange === undefined) {
          throw new Error("There are rates and availability ranges missing.");
        }

        const filteredReservations = reservationList.filter(
          r => r.check_in <= date && r.check_out > date
        );

        filteredReservations.push(selectedRoom);

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

      return true;
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
          (acc, value) => acc + value.number_of_guest
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
}
