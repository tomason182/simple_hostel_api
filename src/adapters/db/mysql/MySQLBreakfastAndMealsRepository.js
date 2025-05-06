export class MySQLBreakfastAndMealsRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async getBreakfastSettings(propertyId) {
    try {
      const query =
        "SELECT * FROM breakfast_settings WHERE property_id = ? LIMIT 1";
      const params = [propertyId];

      const [result] = this.mysqlPool.execute(query, params);

      return result || [];
    } catch (err) {
      throw new Error(
        `An error occurred trying to get breakfast settings. Error: ${err.message}`
      );
    }
  }

  async updateBreakfastSettings(propertyId, settings) {
    try {
      const query =
        "UPDATE breakfast_settings SET is_served = ?, is_included = ?, price = ? WHERE property_id = ?";
      const params = [
        settings.is_served,
        settings.is_included,
        settings.price,
        propertyId,
      ];

      const [result] = await this.mysqlPool.execute(query, params);

      return { affectedRows: result.affectedRows || 0 };
    } catch (err) {
      throw new Error(
        `An error occurred trying to update breakfast setting. Error: ${err.message}`
      );
    }
  }
}
