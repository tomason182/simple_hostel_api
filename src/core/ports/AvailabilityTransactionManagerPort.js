export class AvailabilityTransactionManagerPort {
  constructor(
    ratesAndAvailabilityService,
    roomTypeService,
    reservationService
  ) {
    this.ratesAndAvailabilityService = ratesAndAvailabilityService;
    this.roomTypeService = roomTypeService;
    this.reservationService = reservationService;
  }

  // Get all property room types.
  getAllPropertyRoomTypes(propertyId, conn = null) {
    return this.roomTypeService.getAllPropertyRoomTypes(propertyId, conn);
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
