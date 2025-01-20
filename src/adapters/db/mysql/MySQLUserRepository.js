import { UserRepository } from "../../../core/ports/UserRepository.js";

export class MySQLUserRepository extends UserRepository {
  constructor(mysqlPool) {
    super();
    this.pool = mysqlPool;
  }

  async save(userData, connection) {
    try {
      const query =
        "INSERT INTO users (username, first_name, last_name, password_hash, is_valid_email, last_resend_email) VALUES(?,?,?,?,?,?)";
      const params = [
        userData.username,
        userData.firstName,
        userData.lastName,
        userData.passwordHash,
        userData.isValidEmail,
        userData.lastResendEmail,
      ];

      const [result] = await (connection || this.pool).execute(query, params);
      return { id: result.insertId, ...userData };
    } catch (e) {
      throw new Error(`Error occurred when saving a user: ${e.message}`);
    }
  }

  async findUserByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE  username = ? LIMIT 1";
      const params = [username];

      const [result] = await this.pool.execute(query, params);
      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred when trying to find a user by username: ${e.message}`
      );
    }
  }
}
