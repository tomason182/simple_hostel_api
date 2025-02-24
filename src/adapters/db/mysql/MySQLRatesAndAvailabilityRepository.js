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

  async insertOrUpdateRange(
    roomTypeId,
    propertyId,
    startDate,
    endDate,
    customRate,
    customAvailability,
    conn = null
  ) {
    try {
      const query = "CALL InsertOrUpdateRate(?,?,?,?,?,?)";
      const params = [
        roomTypeId,
        propertyId,
        startDate,
        endDate,
        customRate,
        customAvailability,
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
