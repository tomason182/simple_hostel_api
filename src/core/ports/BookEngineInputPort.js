export class BookEngineInputPort {
  constructor(propertyService, reservationService) {
    this.propertyService = propertyService;
    this.reservationService = reservationService;
  }
  getPropertyData(propertyId) {
    return this.propertyService.getPropertyData(propertyId);
  }
  checkAvailabilityForProperty(propertyId, checkIn, checkOut) {
    return this.reservationService.checkAvailabilityForProperty(
      propertyId,
      checkIn,
      checkOut
    );
  }
  createReservation(reservationData) {
    return this.reservationService.createReservation(reservationData);
  }
}
