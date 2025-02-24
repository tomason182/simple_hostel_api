export class MySQLRatesAndAvailabilityRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async create(rateAndAvailability, conn = null) {
    try {
      return "Rate and availability created";
    } catch (e) {
      throw new Error(
        `An error occurred trying to create rate and availability range. Error: ${e.message}`
      );
    }
  }

  async getAllPropertyRanges(propertyId, checkIn, checkOut, conn = null) {
    try {
      const query =
        "SELECT * FROM rates_and_availability WHERE property_id = ? AND end_date >= ? AND start_date < ?";
      const params = [propertyId, checkIn, checkOut];

      const [result] = await (conn || this.mysqlPool).execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get all property rates ranges. Error: ${e.message}`
      );
    }
  }

  async insertRange(ratesAndAvailability, conn = null) {
    try {
      const query =
        "INSERT INTO rates_and_availability (room_type_id, start_date, end_date, custom_rate, custom_availability, created_by, property_id) VALUES (?,?,?,?,?,?,?)";
      const params = [
        ratesAndAvailability.getRoomTypeId(),
        ratesAndAvailability.getStartDate(),
        ratesAndAvailability.getEndDate(),
        ratesAndAvailability.getCustomRate(),
        ratesAndAvailability.getCustomAvailability(),
        ratesAndAvailability.getCreatedBy(),
        ratesAndAvailability.getPropertyId(),
      ];

      const [result] = await (conn || this.mysqlPool).execute(query, params);

      return result.insertId;
    } catch (e) {
      throw new Error(
        `An error occurred trying to insert a new rates ranges. Error: ${e.message}`
      );
    }
  }
}
