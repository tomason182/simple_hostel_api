export class availabilityTransactionManagerPort {
  constructor(
    ratesAndAvailabilityService,
    roomTypeService,
    reservationService
  ) {
    this.ratesAndAvailabilityService = ratesAndAvailabilityService;
    this.roomTypeService = roomTypeService;
    this.reservationService = reservationService;
  }

  getRanges(roomTypeId, checkIn, checkOut, conn = null) {
    return this.ratesAndAvailabilityService.getRanges(
      roomTypeId,
      checkIn,
      checkOut,
      conn
    );
  }

  getAllRoomTypeBeds(roomTypeId, conn = null) {
    return this.roomTypeService.getAllRoomTypeBeds(roomTypeId, conn);
  }

  getReservationListForDateRange(roomTypeId, checkIn, checkOut, conn) {
    return this.reservationService.getReservationListForDateRange(
      roomTypeId,
      checkIn,
      checkOut,
      conn
    );
  }
}
