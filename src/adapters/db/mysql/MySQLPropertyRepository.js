export class MySQLPropertyRepository {
  constructor(mysqlPool) {
    this.pool = mysqlPool;
  }

  async save(property, connection) {
    try {
      // Insert property name in property table
      const propertyQuery = "INSERT INTO properties (property_name) VALUES(?)";
      const propertyParams = [property.getPropertyName()];
      const [result] = await connection.execute(propertyQuery, propertyParams);

      property.setId(result.insertId);

      // Insert property contact info in contact_info table
      const contactInfoQuery =
        "INSERT INTO contacts_info (property_id, phone_number, email) VALUES(?,?,?)";
      const contactInfoParams = [
        property.getId(),
        property.getPhoneNumber(),
        property.getEmail(),
      ];

      await connection.execute(contactInfoQuery, contactInfoParams);

      // Insert property address in addresses table
      const addressQuery =
        "INSERT INTO addresses (property_id, street, city, postal_code, country_code) VALUES(?,?,?,?,?)";
      const addressParams = [
        property.getId(),
        property.getStreet(),
        property.getCity(),
        property.getPostalCode(),
        property.getCountryCode(),
      ];

      await connection.execute(addressQuery, addressParams);

      // Insert property currencies in currencies table
      const currenciesQuery =
        "INSERT INTO currencies (property_id, base_currency, payment_currency) VALUES(?,?,?)";
      const currenciesParams = [
        property.getId(),
        property.getBaseCurrency(),
        property.getPaymentCurrency(),
      ];

      await connection.execute(currenciesQuery, currenciesParams);

      return property;
    } catch (e) {
      throw new Error(
        `An Error occurred trying to save property: ${e.message}`
      );
    }
  }

  async findPropertyById(id) {
    const query = "SELECT id, property_name FROM properties WHERE id = ?";
    const params = [id];
    const [result] = await this.pool.execute(query, params);

    return result[0] || null;
  }

  async findPropertyDetails(id, conn = null) {
    const query =
      "SELECT properties.id as id, properties.property_name, properties.created_at, properties.updated_at, contacts_info.phone_number, contacts_info.country_code ,contacts_info.email, addresses.street, addresses.city, addresses.postal_code, addresses.alpha_2_code, currencies.base_currency, currencies.payment_currency FROM properties JOIN contacts_info ON contacts_info.property_id = properties.id JOIN addresses ON addresses.property_id = properties.id JOIN currencies ON currencies.property_id = properties.id WHERE properties.id = ? LIMIT 1";
    const params = [id];
    const [result] = await (conn || this.pool).execute(query, params);

    return result[0] || null;
  }

  async findAllPropertyUsers(propertyId, connection = null) {
    try {
      const query = "SELECT * FROM access_control WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await (connection
        ? connection.execute(query, params)
        : this.pool.execute(query, params));
      return result || null;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get all properties users. Error: ${e.message}`
      );
    }
  }

  async updateContactInfo(propertyId, data) {
    try {
      const query =
        "UPDATE contacts_info SET phone_number = ?, country_code = ? ,email = ? WHERE property_id = ?";
      const params = [
        data.phoneNumber,
        data.countryCode,
        data.email,
        propertyId,
      ];

      const [result] = await this.pool.execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred trying to update property contact info`
      );
    }
  }

  async updatePropertyDetails(property) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();

      const addressQuery =
        "UPDATE addresses SET alpha_2_code = ?, street = ?, city = ?, postal_code = ? WHERE property_id = ?";
      const addressParams = [
        property.getAlpha2Code(),
        property.getStreet(),
        property.getCity(),
        property.getPostalCode(),
        property.getId(),
      ];

      await conn.execute(addressQuery, addressParams);

      const currenciesQuery =
        "UPDATE currencies SET base_currency = ?, payment_currency = ? WHERE property_id = ?";
      const currenciesParams = [
        property.getBaseCurrency(),
        property.getPaymentCurrency(),
        property.getId(),
      ];

      await conn.execute(currenciesQuery, currenciesParams);

      conn.commit();

      return { msg: "Property information updated successfully" };
    } catch (e) {
      conn.rollback();
      throw new Error(
        `An error occurred trying to update property details. Error: ${e.message}`
      );
    } finally {
      conn.release();
    }
  }

  async deleteProperty(propertyId, conn = null) {
    try {
      const query = "DELETE FROM properties WHERE id = ?";
      const params = [propertyId];

      const [result] = await (conn || this.pool).execute(query, params);
      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred trying to delete property. Error: ${e.message}`
      );
    }
  }
}
