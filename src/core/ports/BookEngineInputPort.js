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
    return this.propertyService.getPropertyDetails(propertyId);
  }
  getPropertyPolicies(propertyId) {
    return this.propertyService.getPropertyPolicies(propertyId);
  }
  checkAvailabilityForProperty(propertyId, checkIn, checkOut) {
    return this.availabilityService.checkAvailabilityForProperty(
      propertyId,
      checkIn,
      checkOut
    );
  }
  createReservation(reservationData, guestData) {
    return this.reservationCompositeService.createReservation(
      reservationData,
      guestData
    );
  }
}
