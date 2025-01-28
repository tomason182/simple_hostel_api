export class MySQLGuestRepository {
  constructor(mysqlPool) {
    this.pool = mysqlPool;
  }

  async findGuestByEmail(email, propertyId, conn = null) {
    try {
      const query =
        "SELECT * FROM guests WHERE email = ? AND property_id = ? LIMIT 1";
      const params = [email, propertyId];

      const [result] = await (conn || this.pool).execute(query, params);

      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find guest by email. Error: ${e.message}`
      );
    }
  }

  async saveGuest(guest, propertyId, conn) {
    try {
      const query =
        "INSERT INTO guests (property_id, first_name, last_name, id_number, email, phone_number, city, street, postal_code, country_code) VALUES(?,?,?,?,?,?,?,?,?,?)";
      const params = [
        propertyId,
        guest.getFirstName(),
        guest.getLastName(),
        guest.getIdNumber(),
        guest.getEmail(),
        guest.getPhoneNumber(),
        guest.getCity(),
        guest.getStreet(),
        guest.getPostalCode(),
        guest.getCountryCode(),
      ];

      const [result] = await (conn || this.pool).execute(query, params);

      guest.setId(result.insertId);
      return guest;
    } catch (e) {
      throw Error(
        `An error occurred trying to insert a new guest: Error: ${e.message}`
      );
    }
  }
}
