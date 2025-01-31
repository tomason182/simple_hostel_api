export class RatesAndAvailabilityInputPort {
  constructor(ratesAndAvailabilityService) {
    this.ratesAndAvailabilityService = ratesAndAvailabilityService;
  }

  createNewRange(ratesAndAvailabilityData, propertyId, userId, conn = null) {
    return this.ratesAndAvailabilityService.createNewRange(
      ratesAndAvailabilityData,
      propertyId,
      userId,
      conn
    );
  }
}
