export class MySQLUserRepository {
  constructor(mysqlPool) {
    this.pool = mysqlPool;
  }

  async save(user, connection) {
    try {
      const query =
        "INSERT INTO users (username, first_name, last_name, password_hash, is_valid_email, last_resend_email) VALUES(?,?,?,?,?,?)";
      const params = [
        user.getUsername(),
        user.getFirstName(),
        user.getLastName(),
        user.getPasswordHash(),
        user.getIsValidEmail(),
        user.getLastResendEmail(),
      ];

      const [result] = await (connection
        ? connection.execute(query, params)
        : this.pool.execute(query, params));

      user.setId(result.insertId);

      return user;
    } catch (e) {
      throw new Error(`Error occurred when saving a user: ${e.message}`);
    }
  }

  async findUserByUsername(username, connection) {
    try {
      const query = "SELECT * FROM users WHERE  username = ? LIMIT 1";
      const params = [username];

      const [result] = await (connection || this.pool).execute(query, params);
      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred when trying to find a user by username: ${e.message}`
      );
    }
  }

  async findUserById(userId) {
    try {
      const query =
        "SELECT users.id, users.username, users.first_name, users.last_name, users.password_hash, access_control.role FROM users JOIN access_control ON users.id=access_control.user_id WHERE users.id = ? LIMIT 1";
      const params = [userId];

      const [result] = await this.pool.execute(query, params);
      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred when trying to find user by IS: ${e.message}`
      );
    }
  }

  async findUserByIdAndPropertyId(userId, propertyId, conn) {
    try {
      const query =
        "SELECT users.id, users.username ,users.first_name, users.last_name, access_control.role FROM users JOIN access_control ON users.id=access_control.user_id WHERE access_control.user_id = ? AND access_control.property_id = ? LIMIT 1";
      const params = [userId, propertyId];

      const [result] = await (conn || this.pool).execute(query, params);
      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find user by ID and property ID. Error: ${e.message}`
      );
    }
  }

  async validateUserEmail(userId) {
    try {
      const query = "UPDATE users SET is_valid_email = true WHERE id = ?";
      const params = [userId];

      const [result] = await this.pool.execute(query, params);
      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(`An error occurred when trying to validate user email`);
    }
  }

  async updateLastResendEmail(user) {
    try {
      const query = "UPDATE users SET last_resend_email = ? WHERE id = ?";
      const params = [user.getLastResendEmail(), user.getId()];

      const [result] = await this.pool.execute(query, params);
      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred when trying to update last resend email: ${e.message}`
      );
    }
  }

  async updateUser(user, connection) {
    try {
      const query =
        "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?";
      const params = [user.getFirstName(), user.getLastName(), user.getId()];

      const [result] = await (connection || this.pool).execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred when trying to update the user: ${e.message}`
      );
    }
  }

  async addUser(propertyId, user) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const query =
        "INSERT INTO users (username, first_name, last_name, password_hash ,is_valid_email, last_resend_email) VALUES (?,?,?,?,?,?)";
      const userParams = [
        user.getUsername(),
        user.getFirstName(),
        user.getLastName(),
        user.getPasswordHash(),
        user.getIsValidEmail(),
        user.getLastResendEmail(),
      ];

      const [userResult] = await conn.execute(query, userParams);

      user.setId(userResult.insertId);

      const accessControlQuery =
        "INSERT INTO access_control (user_id, property_id, role) VALUES(?,?,?)";
      const params = [user.getId(), propertyId, user.getRole()];

      await conn.execute(accessControlQuery, params);

      await conn.commit();
      return user;
    } catch (e) {
      await conn.rollback();
      throw new Error(
        `An error occurred trying to add user to property. Error: ${e.message}`
      );
    } finally {
      await conn.release();
    }
  }

  async editUser(propertyId, user) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();

      const userQuery =
        "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?";
      const userParams = [
        user.getFirstName(),
        user.getLastName(),
        user.getId(),
      ];

      await conn.execute(userQuery, userParams);

      const accessControlQuery =
        "UPDATE access_control SET role = ? WHERE property_id = ? AND user_id = ?";
      const accessControlParams = [user.getRole(), propertyId, user.getId()];

      await conn.execute(accessControlQuery, accessControlParams);

      await conn.commit();
      return user;
    } catch (e) {
      await conn.rollback();
      throw new Error(
        `An error occurred trying to edit user. Error: ${e.message}`
      );
    } finally {
      await conn.release();
    }
  }

  async updatePassword(user) {
    try {
      const query = "UPDATE users SET password_hash = ? WHERE id = ?";
      const params = [user.getPasswordHash(), user.getId()];

      const [result] = await this.pool.execute(query, params);
      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An Error occurred when trying to update password: Error: ${e.message}`
      );
    }
  }

  async deleteUser(userId, conn = null) {
    try {
      const query = "DELETE from users WHERE id = ?";
      const params = [userId];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.pool.execute(query, params));
      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to delete a user: ${e.message}`
      );
    }
  }

  async getAllPropertyUsers(propertyId) {
    try {
      const query =
        "SELECT access_control.id AS access_control_id, access_control.role, users.id AS id, users.username, users.first_name, users.last_name, access_control.role FROM access_control JOIN users ON users.id = access_control.user_id WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get all property users. Error: ${e.message}`
      );
    }
  }

  async getPropertyName(propertyId) {
    try {
      const query = "SELECT property_name FROM properties WHERE id = ? LIMIT 1";
      const params = [propertyId];

      const [result] = await this.pool.execute(query, params);

      return result[0];
    } catch (e) {
      throw new Error(
        `An error occurred trying to get property name. Error: ${e.message}`
      );
    }
  }

  async saveRequest(userId, propertyId, email, status) {
    try {
      const query =
        "INSERT INTO upgrade_requests (user_id, property_id, email, status) VALUES (?,?,?,?)";
      const params = [userId, propertyId, email, status];

      const [result] = await this.pool.execute(query, params);

      return { insertId: result.insertId };
    } catch (err) {
      throw new Error(
        `An error occurred trying to save upgrade request. Error: ${err.message}`
      );
    }
  }

  async findUpgradeRequest(propertyId) {
    try {
      const query =
        "SELECT * FROM upgrade_requests WHERE property_id = ? LIMIT 1";
      const params = [propertyId];

      const [result] = await this.pool.execute(query, params);

      return result[0] || null;
    } catch (err) {
      throw new Error(
        `An error occurred trying to get find upgrade request. Error: ${err.message}`
      );
    }
  }
}
