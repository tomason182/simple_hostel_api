export class RatesAndAvailabilityInputPort {
  constructor(ratesAndAvailabilityService) {
    this.ratesAndAvailabilityService = ratesAndAvailabilityService;
  }

  createRatesAndAvailabilityRange(
    ratesAndAvailabilityData,
    propertyId,
    conn = null
  ) {
    return this.ratesAndAvailabilityService.createRange(
      ratesAndAvailabilityData,
      propertyId,
      conn
    );
  }
}
