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

  checkAvailabilityForProperty(propertyId, checkIn, checkOut, conn = null) {
    return this.availabilityService.checkAvailabilityForProperty(
      propertyId,
      checkIn,
      checkOut,
      conn
    );
  }

  getRatesByDateRange(propertyId, from, to) {
    return this.ratesAndAvailabilityService.findByDateRange(
      propertyId,
      from,
      to
    );
  }
}
