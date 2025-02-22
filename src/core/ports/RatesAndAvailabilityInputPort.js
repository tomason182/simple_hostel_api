export class RatesAndAvailabilityInputPort {
  constructor(ratesAndAvailabilityService, availabilityService) {
    this.ratesAndAvailabilityService = ratesAndAvailabilityService;
    this.availabilityService = availabilityService;
  }

  createRatesAndAvailabilityRange(
    ratesAndAvailabilityData,
    propertyId,
    userId,
    conn = null
  ) {
    return this.ratesAndAvailabilityService.createNewRange(
      ratesAndAvailabilityData,
      propertyId,
      userId,
      conn
    );
  }

  checkAvailability(propertyId, checkIn, checkOut, conn = null) {
    return this.availabilityService(propertyId, checkIn, checkOut, conn);
  }
}
