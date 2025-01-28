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

  async findGuestById(id, propertyId, conn = null) {
    try {
      const query = "SELECT * FROM guest WHERE id = ? AND property_id = ?";
      const params = [id, propertyId];

      const [result] = await (conn || this.pool).execute(query, params);
      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find guest by id: Error: ${e.message}`
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

  async updateUser(guest) {
    try {
      const query =
        "UPDATE guest SET (first_name, last_name, id_number, email, phone_number, street, city, country_code, postal_code) VALUES (?,?,?,?,?,?,?,?,?) WHERE id = ?";
      const params = [
        guest.getFirstName(),
        guest.getLastName(),
        guest.getIdNumber(),
        guest.getEmail(),
        guest.getPhoneNumber(),
        guest.getStreet(),
        guest.getCity(),
        guest.getCountryCode(),
        guest.getPostalCode(),
        guest.getId(),
      ];

      const [result] = this.pool.execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred trying to update a guest: Error: ${e.message}`
      );
    }
  }
}
