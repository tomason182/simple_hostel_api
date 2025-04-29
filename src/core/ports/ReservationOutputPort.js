export class ReservationOutputPort {
  constructor(reservationRepository, availabilityService, emailService) {
    this.reservationRepository = reservationRepository;
    this.availabilityService = availabilityService;
    this.emailService = emailService;
  }

  checkAvailability(roomTypeId, checkIn, checkOut, conn = null) {
    return this.availabilityService.checkAvailability(
      roomTypeId,
      checkIn,
      checkOut,
      conn
    );
  }

  checkAvailabilityAndAssignBeds(
    reservation,
    advancePaymentPolicy,
    conn = null
  ) {
    return this.availabilityService.checkAvailabilityAndAssignBeds(
      reservation,
      advancePaymentPolicy,
      conn
    );
  }

  // Update reservation
  updateReservation(reservation, conn) {
    return this.reservationRepository.updateReservation(reservation, conn);
  }

  findReservationsByDate(propertyId, date) {
    return this.reservationRepository.findReservationsByDate(propertyId, date);
  }

  findLatestReservations(propertyId) {
    return this.reservationRepository.findLatestReservations(propertyId);
  }

  findReservationsByDateRange(propertyId, from, to, type, conn = null) {
    return this.reservationRepository.getReservationsByDateRange(
      propertyId,
      from,
      to,
      type,
      conn
    );
  }
  // Find reservation by guest name
  findReservationByGuestName(propertyId, name) {
    return this.reservationRepository.findReservationsByGuestName(
      propertyId,
      name
    );
  }

  findReservationByGuestNameAndDates(propertyId, from, until, name) {
    return this.reservationRepository.findReservationByGuestNameAndDates(
      propertyId,
      from,
      until,
      name
    );
  }

  searchReservationsByDateRange(propertyId, from, until) {
    return this.reservationRepository.searchReservationsByDateRange(
      propertyId,
      from,
      until
    );
  }

  findReservationById(propertyId, reservationId, conn) {
    return this.reservationRepository.findReservationById(
      propertyId,
      reservationId,
      conn
    );
  }

  updateReservationStatus(propertyId, id, status) {
    return this.reservationRepository.updateReservationStatus(
      propertyId,
      id,
      status
    );
  }

  updatePaymentStatus(propertyId, id, status) {
    return this.reservationRepository.updatePaymentStatus(
      propertyId,
      id,
      status
    );
  }

  getAdvancePaymentPolicy(propertyId, conn = null) {
    return this.reservationRepository.getAdvancePaymentPolicy(propertyId, conn);
  }

  updateReservationPrices(reservationId, prices) {
    return this.reservationRepository.updateReservationPrices(
      reservationId,
      prices
    );
  }
}
