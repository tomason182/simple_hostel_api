export class MySQLAccessControlRepository {
  constructor(mysqlPool) {
    this.pool = mysqlPool;
  }

  async save(userId, propertyId, role, connection) {
    try {
      // Create access control for user with role.
      const query =
        "INSERT INTO access_control (user_id, property_id, role) VALUES (?,?,?)";
      const params = [userId, propertyId, role];

      const [result] = await (connection || this.pool).execute(query, params);
      return result.insertId;
    } catch (e) {
      throw e;
    }
  }

  async find(userId, connection) {
    try {
      const query = "SELECT * FROM access_control WHERE user_id = ?";
      const params = [userId];
      const [result] = await (connection || this.pool).execute(query, params);
      return result[0];
    } catch (e) {
      throw e;
    }
  }
}
