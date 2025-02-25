export class MySQLRatesAndAvailabilityRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async getRanges(roomTypeId, startDate, endDate, conn = null) {
    try {
      const query =
        "SELECT * FROM rates_and_availability WHERE room_type_id = ? AND start_date < ? AND end_date >= ?";
      const params = [roomTypeId, endDate, startDate];

      const [result] = await (conn || this.mysqlPool).execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get rates ranges. Error: ${e.message}`
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
