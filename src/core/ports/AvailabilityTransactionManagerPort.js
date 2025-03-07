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

  // Get property currencies
  getPropertyCurrencies(propertyId) {
    return this.ratesAndAvailabilityRepository.getPropertyCurrencies(
      propertyId
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
  getPropertyRoomTypes(propertyId, conn = null) {
    return this.roomTypeRepository.findPropertyRoomTypes(propertyId, conn);
  }

  findRoomTypeById(roomTypeId, propertyId, conn = null) {
    return this.roomTypeRepository.findRoomTypeById(
      roomTypeId,
      propertyId,
      conn
    );
  }

  getRoomTypeBeds(roomTypeId, conn = null) {
    return this.roomTypeRepository.getRoomTypeBeds(roomTypeId, conn);
  }

  // RESERVATIONS
  getOverlappingReservations(roomTypeId, checkIn, checkOut, conn = null) {
    return this.reservationRepository.getOverlappingReservations(
      roomTypeId,
      checkIn,
      checkOut,
      conn
    );
  }

  getOverlappingReservationsByPropertyId(
    propertyId,
    checkIn,
    checkOut,
    conn = null
  ) {
    return this.reservationRepository.getOverlappingReservationsByPropertyId(
      propertyId,
      checkIn,
      checkOut,
      conn
    );
  }

  getReservationsListLimit(roomTypeId, from, conn = null) {
    return this.reservationRepository.getReservationsListLimit(
      roomTypeId,
      from,
      conn
    );
  }
}
