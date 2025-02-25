export class AvailabilityTransactionManagerPort {
  constructor(
    ratesAndAvailabilityRepository,
    roomTypeRepository,
    reservationRepository
  ) {
    this.ratesAndAvailabilityRepository = ratesAndAvailabilityRepository;
    this.roomTypeRepository = roomTypeRepository;
    this.reservationRepository = reservationRepository;
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

  // ROOM TYPES
  findRoomTypeById(roomTypeId, propertyId, conn = null) {
    return this.roomTypeRepository.findRoomTypeById(
      roomTypeId,
      propertyId,
      conn
    );
  }

  // RESERVATIONS
  getOverlappingReservations(roomTypeId, checkIn, checkOut, conn) {
    return this.reservationRepository.getReservationsListByDateRange(
      roomTypeId,
      checkIn,
      checkOut,
      conn
    );
  }
}
