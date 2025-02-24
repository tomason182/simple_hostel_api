import { RateAndAvailability } from "./entities/RatesAndAvailability.js";
import { RoomType } from "./entities/RoomType.js";

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
    rateAndAvailability.setPropertyId(propertyId);

    // Check if the roomType belong to the property
    const roomTypeData =
      await this.ratesAndAvailabilityOutputPort.findRoomTypeById(
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
      await this.ratesAndAvailabilityOutputPort.checkCustomAvailability(
        roomType,
        startDate,
        endDate,
        rateAndAvailability.getCustomAvailability()
      );

    if (isCustomAvailabilityValid.status === false) {
      throw new Error(
        `Minimum availability to set is ${isCustomAvailabilityValid.maxAvailability}`
      );
    }

    const result =
      await this.ratesAndAvailabilityOutputPort.insertOrUpdateRange(
        rateAndAvailability.getRoomTypeId(),
        rateAndAvailability.getPropertyId(),
        rateAndAvailability.getStartDate(),
        rateAndAvailability.getEndDate(),
        rateAndAvailability.getCustomRate(),
        rateAndAvailability.getCustomAvailability()
      );

    console.log(result);

    return result;
  }

  findByDateRange() {
    try {
    } catch (e) {
      throw e;
    }
  }
}
