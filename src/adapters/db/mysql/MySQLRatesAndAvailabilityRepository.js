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

  async getAllRanges(propertyId, conn = null) {
    try {
      const query =
        "SELECT * FROM rates_and_availability WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await (conn || this.mysqlPool).execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get all property rates ranges. Error: ${e.message}`
      );
    }
  }
}
