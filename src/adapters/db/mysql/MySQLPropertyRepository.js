import { PropertyRepository } from "../../../core/ports/PropertyRepository";

export class MySQLPropertyRepository extends PropertyRepository {
  constructor(mysqlPool) {
    super();
    this.pool = mysqlPool;
  }

  async save(propertyData, connection) {
    try {
      // Insert property name in property table
      const propertyQuery =
        "INSERT INTO properties (property_name,created_at, update_at) VALUES(?,?,?)";
      const propertyParams = [
        propertyData.propertyName,
        propertyData.createdAt,
        propertyData.updateAt,
      ];
      const [result] = await connection.execute(propertyQuery, propertyParams);

      // Insert property contact info in contact_info table
      const contactInfoQuery =
        "INSERT INTO contact_info (property_id, phone_number, email) VALUES(?,?,?)";
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

      // Insert property policies in policies table
      const policies = propertyData.policies;
      const policiesQuery =
        "INSERT INTO policies (property_id, deposit_amount, check_in_from, check_in_to, check_out_from, check_out_to, allow_cancellation, cancellation_days, allow_pets, minors_allow, minors_room_types, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const policiesParams = [
        result.insertId,
        policies.depositAmount,
        policies.checkIn.from,
        policies.checkIn.to,
        policies.checkOut.from,
        policies.checkOut.to,
        policies.cancellationPolicy.allowCancellation,
        policies.cancellationPolicy.days,
        policies.allowPets,
        policies.minorsPolicy.allow,
        policies.minorsPolicy.roomTypes,
        policies.description,
      ];
      await connection.execute(policiesQuery, policiesParams);

      // Insert payment methods
      const paymentMethods = propertyData.policies.paymentMethods;
      const paymentQuery =
        "INSERT INTO payment_methods (property_id, method) VALUES (?,?)";

      for (const method of paymentMethods) {
        const paymentParam = [result.insertId, method];
        await connection.execute(paymentQuery, paymentParam);
      }

      return { id: result.insertId, ...propertyData };
    } catch (e) {
      console.error("Error saving property:", e);
      throw e;
    }
  }
}
