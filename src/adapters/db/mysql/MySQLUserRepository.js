const { UserRepository } = require("../../../core/ports/UserRepository");

export class MySQLUserRepository extends UserRepository {
  constructor(mysqlPool) {
    super();
    this.pool = mysqlPool;
  }

  async save(userData, connection) {
    try {
      const query =
        "INSERT INTO guests (username, first_name, last_name, hashed_password, role, is_valid_email, created_at, updated_at) VALUES(?,?,?,?,?,?,?,?)";
      const params = [
        userData.username,
        userData.firstName,
        userData.lastName,
        userData.hashedPassword,
        userData.role,
        userData.isValidEmail,
      ];

      const [result] = await (connection || this.pool).execute(query, params);
      return { id: result.insertedId, ...userData };
    } catch (e) {
      throw new Error(`Error occurred when saving a user: ${e.message}`);
    }
  }

  async findUserByUsername(username) {
    try {
      const query = "SELECT * FROM user WHERE  username = ? LIMIT 1";
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
