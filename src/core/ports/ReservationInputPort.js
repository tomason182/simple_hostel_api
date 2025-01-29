export class ReservationInputPort {
  constructor(reservationService) {
    this.reservationService = reservationService;
  }

  createReservation(reservationData, conn = null) {
    return this.reservationService.createReservation(reservationData, conn);
  }
}
