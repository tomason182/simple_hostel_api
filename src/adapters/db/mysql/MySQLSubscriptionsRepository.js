export class MySQLsubscriptionsRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async subscribeFeature(propertyId, featureId, expiresAt, graceUntil) {
    try {
      const query =
        "INSERT INTO property_features (property_id, feature_id, expires_at, grace_until) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE expires_at = VALUES(expires_at), grace_until = VALUES(grace_until)";
      const params = [propertyId, featureId, expiresAt, graceUntil];

      const [result] = this.mysqlPool.execute(query, params);

      return result;
    } catch (err) {
      throw new Error(
        `An error occurred trying to subscribe a feature. Error: ${err.message}`
      );
    }
  }

  async getEnableFeatures(propertyId) {
    try {
      const query =
        "SELECT * FROM property_features WHERE property_id = ? AND grace_until > NOW()";
      const params = [propertyId];

      const [result] = this.mysqlPool.execute(query, params);

      return result || [];
    } catch (err) {
      throw new Error(
        `An error occurred trying to get all enable features. Error: ${err.message}`
      );
    }
  }
}
