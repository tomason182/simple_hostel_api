export class MySQLGuestRepository {
  constructor(mysqlPool) {
    this.pool = mysqlPool;
  }

  async findGuestByEmail(email, propertyId, conn = null) {
    try {
      const query =
        "SELECT * FROM guest WHERE email = ? AND property_id = ? LIMIT 1";
      const params = [email, propertyId];

      const [result] = await (conn || this.pool).execute(query, params);

      console.log("Result: ", result);
      throw Error("stop...");
      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find guest by email. Error: ${e.message}`
      );
    }
  }
}
