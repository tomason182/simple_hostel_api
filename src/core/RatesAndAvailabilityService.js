import { RateAndAvailability } from "./entities/RatesAndAvailability.js";

export class RatesAndAvailabilityService {
  constructor(ratesAndAvailabilityOutputPort) {
    this.ratesAndAvailabilityOutputPort = ratesAndAvailabilityOutputPort;
  }

  async createNewRange(
    rateAndAvailabilityData,
    propertyId,
    userId,
    conn = null
  ) {
    const rateAndAvailability = new RateAndAvailability(
      rateAndAvailabilityData
    );

    rateAndAvailability.setCreatedBy(userId);

    // Check if the roomType belong to the property
    const isValidRoomTypeId =
      this.ratesAndAvailabilityOutputPort.findRoomTypeById(
        rateAndAvailability.getRoomTypeId(),
        propertyId,
        conn
      );

    if (isValidRoomTypeId === null) {
      throw new Error("Room type ID provided does not belong to property");
    }

    // Check if start date is smaller that end date
    if (rateAndAvailability.getStartDate() > rateAndAvailability.getEndDate()) {
      throw new Error("Start date can not be greater that end date");
    }

    // Check if custom availability > availability - total guest;
    const isCustomAvailabilityValid =
      this.ratesAndAvailabilityOutputPort.checkCustomAvailability(
        rateAndAvailability
      );

    if (isCustomAvailabilityValid.status === false) {
      throw new Error(
        `Minimum availability to set is ${isCustomAvailabilityValid.min}`
      );
    }

    const result = await this.ratesAndAvailabilityOutputPort.insertOrUpdateRate(
      rateAndAvailability
    );

    console.log("ratesObj: ", rateAndAvailability);

    return true;
    // Check that the room type ID provided correspond to the property
  }

  findByDateRange() {
    try {
    } catch (e) {
      throw e;
    }
  }
}
