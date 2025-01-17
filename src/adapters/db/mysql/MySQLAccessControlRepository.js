import { AccessControlService } from "../../../core/ports/AccessControlService.js";

export class MySQLAccessControlRepository extends AccessControlService {
  constructor(mysqlPool) {
    super();
    this.pool = mysqlPool;
  }

  async save(userId, propertyId, role, connection) {
    try {
      // Create access control for user with role.
      const query =
        "INSERT INTO access_control (user_id, property_id, role) VALUES (?,?,?)";
      const params = [userId, propertyId, role];

      const [result] = (connection || this.pool).execute(query, params);
      return result.insertId;
    } catch (e) {
      throw e;
    }
  }
}
