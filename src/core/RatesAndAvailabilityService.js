import { RateAndAvailability } from "./entities/RatesAndAvailability.js";

export class RatesAndAvailabilityService {
  constructor(ratesAndAvailabilityOutputPort) {
    this.ratesAndAvailabilityOutputPort = ratesAndAvailabilityOutputPort;
  }

  async createRatesAndAvailabilityRange(
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
    // We can find the room type only by its ID but we need to ensure that it belong to the property.
    const roomTypeData = this.ratesAndAvailabilityOutputPort.findRoomTypeById(
      rateAndAvailability.getRoomTypeId(),
      propertyId,
      conn
    );

    if (roomTypeData === null) {
      throw new Error("Room type ID provided does not belong to property");
    }

    const startDate = rateAndAvailability.getStartDate();
    const endDate = rateAndAvailability.getEndDate();

    // Check if start date is smaller that end date
    if (startDate > endDate) {
      throw new Error("Start date can not be greater that end date");
    }

    const roomType = new RoomType(roomTypeData);

    // Check if custom availability > availability - total guest;
    const isCustomAvailabilityValid =
      this.ratesAndAvailabilityOutputPort.checkCustomAvailability(
        roomType,
        rateAndAvailability
      );

    if (isCustomAvailabilityValid.status === false) {
      throw new Error(
        `Minimum availability to set is ${isCustomAvailabilityValid.maxAvailability}`
      );
    }

    const result = await this.ratesAndAvailabilityOutputPort.insertOrUpdateRate(
      rateAndAvailability
    );

    return result;
  }

  findByDateRange() {
    try {
    } catch (e) {
      throw e;
    }
  }
}
