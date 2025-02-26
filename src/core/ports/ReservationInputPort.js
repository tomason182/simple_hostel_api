export class ReservationInputPort {
  constructor(reservationService, reservationCompositeService) {
    this.reservationService = reservationService;
    this.reservationCompositeService = reservationCompositeService;
  }

  createReservationAndGuest(reservationData, guestData) {
    return this.reservationCompositeService.createReservationAndGuest(
      reservationData,
      guestData
    );
  }
}
