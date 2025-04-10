export class BookEngineInputPort {
  constructor(
    propertyService,
    reservationCompositeService,
    availabilityService
  ) {
    this.availabilityService = availabilityService;
    this.reservationCompositeService = reservationCompositeService;
    this.propertyService = propertyService;
  }
  getPropertyData(propertyId) {
    return this.propertyService.getPropertyData(propertyId);
  }
  checkAvailabilityForProperty(propertyId, checkIn, checkOut) {
    return this.availabilityService.checkAvailabilityForProperty(
      propertyId,
      checkIn,
      checkOut
    );
  }
  createReservation(reservationData) {
    return this.reservationCompositeService.createReservation(reservationData);
  }
}
