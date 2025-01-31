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

  async checkCustomAvailability(roomTypeId, startDate, endDate, conn = null) {
    try {
      // Get the reservations for the current range start date - end date.
      const reservationList = this.availabilityOutPutPort.getReservationsList(
        roomTypeId,
        startDate,
        endDate
      );
    } catch (e) {
      throw e;
    }
  }
}
