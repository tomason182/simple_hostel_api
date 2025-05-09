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

  // Get property payment policies
  getPropertyPaymentPolicies(propertyId) {
    return this.ratesAndAvailabilityRepository.getPropertyPaymentPolicies(
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

  // GET ALL RANGES
  getAllRanges(selectedRooms, checkIn, checkOut, conn = null) {
    return this.ratesAndAvailabilityRepository.getAllRanges(
      selectedRooms,
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
  getOverlappingReservations(
    roomTypeId,
    reservationId,
    checkIn,
    checkOut,
    conn = null
  ) {
    return this.reservationRepository.getOverlappingReservations(
      roomTypeId,
      reservationId,
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

  getReservationsListLimit(
    roomTypeId,
    reservationId,
    from,
    limit,
    conn = null
  ) {
    return this.reservationRepository.getReservationsListLimit(
      roomTypeId,
      reservationId,
      from,
      limit,
      conn
    );
  }

  updateAssignedBed(id, bed, conn) {
    return this.reservationRepository.updateAssignedBed(id, bed, conn);
  }
}
