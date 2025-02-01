export class availabilityService {
  constructor(availabilityOutPutPort) {
    this.availabilityOutPutPort = availabilityOutPutPort;
  }

  async checkAvailability(roomTypeId, checkIn, checkOut, conn = null) {
    // Bring the availability ranges
    const ranges = await this.availabilityOutPutPort.getRanges(
      roomTypeId,
      checkIn,
      checkOut,
      conn
    );
    const roomType = await this.availabilityOutPutPort.getRoomTypeById(
      roomTypeId,
      conn
    );

    if (roomType === null) {
      throw new Error("Room type ID not found");
    }

    const totalBeds = "Get the total bed for the room type object";

    const reservationList =
      await this.availabilityOutPutPort.getReservationsList(
        roomTypeId,
        checkIn,
        checkOut
      );
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
      const reservationList = this.availabilityOutPutPort.getReservationsList(
        roomType.getId(),
        startDate,
        endDate
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
