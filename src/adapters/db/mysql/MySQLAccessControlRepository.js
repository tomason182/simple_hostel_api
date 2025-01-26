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

  async find(userId, connection = null) {
    try {
      const query = "SELECT * FROM access_control WHERE user_id = ?";
      const params = [userId];
      const [result] = await (connection || this.pool).execute(query, params);
      return result[0] || null;
    } catch (e) {
      throw e;
    }
  }
  // borrar
  async findWithProperty(propertyId, userId, connection = null) {
    try {
      const query =
        "SELECT * FROM access_control WHERE property_id = ? AND user_id = ? LIMIT 1";
      const params = [propertyId, userId];
      console.log("params: ", params);

      const [result] = await (connection || this.pool).execute(query, params);

      console.log("accessControl Result: ", result);

      return result[0] || null;
    } catch (e) {
      throw new Error(
        `Unable to get user accessControl info. Error: ${e.message}`
      );
    }
  }

  async update(user, connection) {
    try {
      const query = "UPDATE access_control SET role = ? WHERE user_id = ?";
      const params = [user.getRole(), user.getId()];

      const [result] = await (connection || this.pool).execute(query, params);

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
