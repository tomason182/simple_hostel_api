export class ReservationInputPort {
  constructor(reservationService, reservationCompositeService) {
    this.reservationService = reservationService;
    this.reservationCompositeService = reservationCompositeService;
  }

  createReservationAndGuest(reservationData, guestData, source) {
    return this.reservationCompositeService.createReservationAndGuest(
      reservationData,
      guestData,
      source
    );
  }

  findReservationsByDate(propertyId, date) {
    return this.reservationService.findReservationsByDate(propertyId, date);
  }
}
