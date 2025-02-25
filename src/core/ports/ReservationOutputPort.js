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

  saveReservation(reservation, conn = null) {
    return this.reservationRepository.createReservation(reservation, conn);
  }
}
