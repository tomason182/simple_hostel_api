export class AvailabilityTransactionManagerPort {
  constructor(
    ratesAndAvailabilityRepository,
    roomTypeService,
    reservationService
  ) {
    this.ratesAndAvailabilityRepository = ratesAndAvailabilityRepository;
    this.roomTypeService = roomTypeService;
    this.reservationService = reservationService;
  }

  // Get rates and availability ranges for the property
  getPropertyRatesAndAvailabilityRanges(propertyId, from, to, conn = null) {
    return this.ratesAndAvailabilityRepository.getAllPropertyRanges(
      propertyId,
      from,
      to,
      conn
    );
  }

  // Get rates and availability ranges for room type id.
  getRanges(roomTypeId, checkIn, checkOut, conn = null) {
    return this.ratesAndAvailabilityRepository.getRanges(
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
