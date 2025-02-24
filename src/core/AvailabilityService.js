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
        await this.availabilityTransactionManagerPort.getReservationListForDateRange(
          propertyId,
          checkIn,
          checkOut
        );
    } catch (e) {
      throw e;
    }
  }

  async checkAvailability(roomTypeId, checkIn, checkOut, conn = null) {
    try {
      // Bring the availability ranges
      const ranges = await this.availabilityTransactionManagerPort.getRanges(
        roomTypeId,
        checkIn,
        checkOut,
        conn
      );
      const roomType =
        await this.availabilityTransactionManagerPort.getRoomTypeById(
          roomTypeId,
          conn
        );

      if (roomType === null) {
        throw new Error("Room type ID not found");
      }

      const totalBeds = "Get the total bed for the room type object";

      const reservationList =
        await this.availabilityTransactionManagerPort.getReservationsList(
          roomTypeId,
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
        this.availabilityTransactionManagerPort.getReservationsList(
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
