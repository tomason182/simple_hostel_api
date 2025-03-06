export class ReservationInputPort {
  constructor(
    reservationService,
    reservationCompositeService,
    availabilityService
  ) {
    this.reservationService = reservationService;
    this.reservationCompositeService = reservationCompositeService;
    this.availabilityService = availabilityService;
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

  findReservationsByDateRange(propertyId, from, to) {
    return this.reservationService.findReservationsByDateRange(
      propertyId,
      from,
      to
    );
  }

  checkAvailability(propertyId, check_in, check_out) {
    return this.availabilityService.checkAvailabilityForProperty(
      propertyId,
      check_in,
      check_out
    );
  }
}
