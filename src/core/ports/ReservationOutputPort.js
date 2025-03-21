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

  findReservationsByDate(propertyId, date) {
    return this.reservationRepository.findReservationsByDate(propertyId, date);
  }

  findLatestReservations(propertyId) {
    return this.reservationRepository.findLatestReservations(propertyId);
  }

  findReservationsByDateRange(propertyId, from, to, conn = null) {
    return this.reservationRepository.getReservationsByDateRange(
      propertyId,
      from,
      to,
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

  findReservationById(propertyId, reservationId) {
    return this.reservationRepository.findReservationById(
      propertyId,
      reservationId
    );
  }
}
