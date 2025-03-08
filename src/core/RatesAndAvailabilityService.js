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
    try {
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

      // CUSTOM AVAILABILITY ES ROOMS TO SELL. LA CANTIDAD DE CUARTO A LA VENTA - TOTAL RESERVAS = DISPONIBILIDAD.
      // EL USUSARIO NO SETEA LA DISPONIBILIDAD. SINO LOS CUARTOS A LA VENTA.

      const totalInventory =
        roomType.getType() === "dorm"
          ? roomType.getMaxOccupancy() * roomType.getInventory()
          : roomType.getInventory;

      // Check if rooms to sell is > 0 & <= rooms max occupancy;
      if (rateAndAvailability.getRoomsToSell() > totalInventory) {
        `Maximum rooms to sell is ${totalInventory}`;
      }

      const result =
        await this.ratesAndAvailabilityOutputPort.insertOrUpdateRange(
          rateAndAvailability.getRoomTypeId(),
          rateAndAvailability.getPropertyId(),
          rateAndAvailability.getStartDate(),
          rateAndAvailability.getEndDate(),
          rateAndAvailability.getCustomRate(),
          rateAndAvailability.getRoomsToSell()
        );

      return result;
    } catch (e) {
      throw e;
    }
  }

  async findByDateRange(propertyId, from, to) {
    try {
      const rateAndAvailabilityList =
        await this.ratesAndAvailabilityOutputPort.findByDateRange(
          propertyId,
          from,
          to
        );

      return rateAndAvailabilityList;
    } catch (e) {
      throw e;
    }
  }
}
