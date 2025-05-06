export class MySQLBreakfastAndMealsRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async getBreakfastSettings(propertyId) {
    try {
      const query =
        "SELECT * FROM breakfast_settings WHERE property_id = ? LIMIT 1";
      const params = [propertyId];

      const [result] = await this.mysqlPool.execute(query, params);

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
        "INSERT INTO breakfast_settings (property_id, is_served, is_included, price) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE is_served = VALUES(is_served), is_included = VALUES(is_included), price = VALUES(price)";
      const params = [
        propertyId,
        settings.is_served,
        settings.is_included,
        settings.price,
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
