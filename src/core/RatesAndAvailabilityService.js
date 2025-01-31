import { RateAndAvailability } from "./entities/RatesAndAvailability.js";

export class RateAndAvailabilityService {
  constructor(ratesAndAvailabilityOutputPort) {
    this.ratesAndAvailabilityOutputPort = ratesAndAvailabilityOutputPort;
  }

  async createRateAndAvailability(
    rateAndAvailabilityData,
    propertyId,
    conn = null
  ) {
    const rateAndAvailability = new RateAndAvailability(
      rateAndAvailabilityData
    );

    // Check that the room type ID provided correspond to the property
  }
}
