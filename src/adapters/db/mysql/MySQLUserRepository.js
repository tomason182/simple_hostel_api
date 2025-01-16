const { UserRepository } = require("../../../core/ports/UserRepository");

export class MySQLUserRepository extends UserRepository {
  constructor(mysqlPool) {
    super();
    this.pool = mysqlPool;
  }

  async save(userData, connection) {
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
  }
}
