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

  createReservationAndGuest(reservationData, guestData) {
    return this.reservationCompositeService.createReservationAndGuest(
      reservationData,
      guestData
    );
  }

  findReservationsByDate(propertyId, date) {
    return this.reservationService.findReservationsByDate(propertyId, date);
  }

  findLatestReservations(propertyId) {
    return this.reservationService.findLatestReservations(propertyId);
  }

  findReservationsByDateRange(propertyId, from, to, type) {
    return this.reservationService.findReservationsByDateRange(
      propertyId,
      from,
      to,
      type
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

  changeReservationStatus(id, status, propertyId) {
    return this.reservationService.changeReservationStatus(
      id,
      status,
      propertyId
    );
  }

  changePaymentStatus(id, status, propertyId) {
    return this.reservationService.changePaymentStatus(id, status, propertyId);
  }

  changeReservationDates(propertyId, id, newCheckIn, newCheckOut) {
    return this.reservationService.changeReservationDates(
      propertyId,
      id,
      newCheckIn,
      newCheckOut
    );
  }
}
