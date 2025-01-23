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

  async update(userData, connection) {
    try {
      const query = "UPDATE access_control SET role = ? WHERE user_id = ?";
      const params = [userData.role, userData.id];

      const [result] = await (connection || this.pool).execute(query, params);

      if (result.affectedRows === 0 && result.changedRows === 0) {
        throw new Error(`Can not update user with ID: ${userData.id}`);
      }
      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `Unexpected error occurred trying to update access control: ${e.message}`
      );
    }
  }
}
