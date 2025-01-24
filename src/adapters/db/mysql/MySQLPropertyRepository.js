export class MySQLPropertyRepository {
  constructor(mysqlPool) {
    this.pool = mysqlPool;
  }

  async save(propertyData, connection) {
    try {
      // Insert property name in property table
      const propertyQuery = "INSERT INTO properties (property_name) VALUES(?)";
      const propertyParams = [propertyData.propertyName];
      const [result] = await connection.execute(propertyQuery, propertyParams);

      console.log("Property id: ", result.insertId);

      // Insert property contact info in contact_info table
      const contactInfoQuery =
        "INSERT INTO contacts_info (property_id, phone_number, email) VALUES(?,?,?)";
      const contactInfoParams = [
        result.insertId,
        propertyData.contactInfo.phoneNumber,
        propertyData.contactInfo.email,
      ];
      await connection.execute(contactInfoQuery, contactInfoParams);

      // Insert property address in addresses table
      const addressQuery =
        "INSERT INTO addresses (property_id, street, city, postal_code, country_code) VALUES(?,?,?,?,?)";
      const addressParams = [
        result.insertId,
        propertyData.address.street,
        propertyData.address.city,
        propertyData.address.postalCode,
        propertyData.address.countryCode,
      ];
      await connection.execute(addressQuery, addressParams);

      // Insert property currencies in currencies table
      const currenciesQuery =
        "INSERT INTO currencies (property_id, base_currency, payment_currency) VALUES(?,?,?)";
      const currenciesParams = [
        result.insertId,
        propertyData.currencies.baseCurrency,
        propertyData.currencies.paymentCurrency,
      ];
      await connection.execute(currenciesQuery, currenciesParams);

      return { id: result.insertId, ...propertyData };
    } catch (e) {
      console.error("Error saving property:", e);
      throw e;
    }
  }

  async findAllPropertyUsers(propertyId, connection = null) {
    try {
      const query = "SELECT * FROM access_control WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await (connection || this.pool).execute(query, params);
      return result || null;
    } catch (e) {
      throw e;
    }
  }
}
