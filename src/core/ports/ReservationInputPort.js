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

  findReservationsByDateRangeAndName(propertyId, from, to, name) {
    return this.reservationService.findReservationsByDateRangeAndName(
      propertyId,
      from,
      to,
      name
    );
  }

  findReservationById(propertyId, id) {
    return this.reservationService.findReservationById(propertyId, id);
  }

  checkAvailability(propertyId, check_in, check_out) {
    return this.availabilityService.checkAvailabilityForProperty(
      propertyId,
      check_in,
      check_out
    );
  }
}
