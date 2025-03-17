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

  // Property Policies
  async getPaymentMethods(propertyId) {
    try {
      const query =
        "SELECT pm.id FROM payment_methods pm JOIN property_payment_methods ppm ON ppm.payment_method_id = pm.id AND ppm.property_id = ?";
      const params = [propertyId];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An Error occurred trying to get property payment methods. Error: ${e.message}`
      );
    }
  }

  async getOnlinePaymentMethods(propertyId) {
    try {
      const query =
        "SELECT opm.id FROM online_payment_methods opm JOIN property_online_payment_methods popm ON popm.online_payment_method_id = opm.id AND popm.property_id = ?";
      const params = [propertyId];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get property online payment methods. Error: ${e.message}`
      );
    }
  }

  async updatePaymentMethods(propertyId, methodsToRemove, methodsToAdd) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();

      if (methodsToRemove.length > 0) {
        const deletePlaceholders = methodsToRemove.map(() => "?").join(", ");

        const deleteQuery = `DELETE FROM property_payment_methods WHERE property_id = ? AND payment_method_id IN (${deletePlaceholders})`;
        const params = [propertyId, ...methodsToRemove];

        await conn.execute(deleteQuery, params);
      }

      if (methodsToAdd.length > 0) {
        const insertPlaceholders = methodsToAdd.map(() => "(?, ?)").join(", ");
        const insertParams = methodsToAdd.flatMap(method => [
          propertyId,
          method,
        ]);

        const insertQuery = `INSERT INTO property_payment_methods (property_id, payment_method_id) VALUES ${insertPlaceholders}`;

        await conn.execute(insertQuery, insertParams);
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw new Error(
        `An error occurred trying to update property payment methods. Error: ${e.message}`
      );
    } finally {
      await conn.release();
    }
  }

  async updateOnlinePaymentMethods(propertyId, methodsToRemove, methodsToAdd) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();

      if (methodsToRemove.length > 0) {
        const deletePlaceholders = methodsToRemove.map(() => "?").join(", ");

        const deleteQuery = `DELETE FROM property_online_payment_methods WHERE property_id = ? AND payment_method_id IN (${deletePlaceholders})`;
        const params = [propertyId, ...methodsToRemove];

        await conn.execute(deleteQuery, params);
      }

      if (methodsToAdd.length > 0) {
        const insertPlaceholders = methodsToAdd.map(() => "(?, ?)").join(", ");
        const insertParams = methodsToAdd.flatMap(method => [
          propertyId,
          method,
        ]);

        const insertQuery = `INSERT INTO property_online_payment_methods (property_id, online_payment_method_id) VALUES ${insertPlaceholders}`;

        await conn.execute(insertQuery, insertParams);
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw new Error(
        `An error occurred trying to update the property online payment methods. Error: ${e.message}`
      );
    } finally {
      await conn.release();
    }
  }

  // Policies

  async getPropertyPolicies(propertyId) {
    try {
      const query =
        "SELECT rp.*, app.*, chp.*, op.*, COALESCE(JSON_ARRAYAGG(JSON_OBJECT('id', cp.id, 'days_before_arrival', cp.days_before_arrival, 'amount_refund', cp.amount_refund)), JSON_ARRAY()) AS cancellation_policies FROM reservation_policies rp JOIN advance_payment_policies app ON rp.property_id = app.property_id JOIN children_policies chp ON rp.property_id = chp.property_id JOIN other_policies op ON rp.property_id = op.property_id LEFT JOIN cancellation_policies cp ON rp.property_id = cp.property_id WHERE rp.property_id = ? GROUP BY rp.property_id";
      const params = [propertyId];

      const [result] = await this.pool.execute(query, params);

      const paymentQuery =
        "SELECT pm.* FROM payment_methods pm JOIN property_payment_methods ppm ON ppm.payment_method_id = pm.id AND ppm.property_id = ?";

      const [paymentResult] = await this.pool.execute(paymentQuery, params);

      return { policies: result[0] || [], payment_methods: paymentResult };
    } catch (e) {
      `An error occurred trying to get property policies. Error: ${e.message}`;
    }
  }

  async updateReservationPolicies(propertyId, policies) {
    try {
      const query =
        "INSERT INTO reservation_policies (property_id, min_length_stay, max_length_stay, min_advance_booking, check_in_from, check_in_to, check_out_until) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE min_length_stay = VALUES(min_length_stay), max_length_stay = VALUES(max_length_stay), min_advance_booking = VALUES(min_advance_booking), check_in_from = VALUES(check_in_from), check_in_to = VALUES(check_in_to), check_out_until = VALUES(check_out_until)";
      const params = [
        propertyId,
        policies.getMinLengthStay(),
        policies.getMaxLengthStay(),
        policies.getMinAdvanceBooking(),
        policies.getCheckInFrom(),
        policies.getCheckInTo(),
        policies.getCheckOutUntil(),
      ];

      const [result] = await this.pool.execute(query, params);

      return {
        insertedRows: result.insertedRows,
        affectedRows: result.affectedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred trying to update reservations policies. Error: ${e.message}`
      );
    }
  }

  async insertOrUpdateAdvancePaymentPolicies(propertyId, policies) {
    try {
      const query =
        "INSERT INTO advance_payment_policies (property_id, advance_payment_required, deposit_amount) VALUES (?,?,?) ON DUPLICATE KEY UPDATE advance_payment_required = VALUES(advance_payment_required), deposit_amount = VALUES(deposit_amount)";
      const params = [
        propertyId,
        policies.getAdvancePaymentRequired(),
        policies.getDepositAmount(),
      ];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to insert or update advance payment policies. Error: ${e.message}`
      );
    }
  }

  async getPropertyCancellationPolicies(propertyId) {
    try {
      const query = "SELECT * FROM cancellation_policies WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get property cancellation policies. Error: ${e.message}`
      );
    }
  }

  async insertCancellationPolicy(propertyId, daysBeforeArrival, amountRefund) {
    try {
      const query =
        "INSERT INTO cancellation_policies (property_id, days_before_arrival, amount_refund) VALUES (?, ?, ?)";
      const params = [propertyId, daysBeforeArrival, amountRefund];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to insert cancellation policy. Error: ${e.message}`
      );
    }
  }

  async updateCancellationPolicy(
    id,
    property_id,
    daysBeforeArrival,
    amountRefund
  ) {
    try {
      const query =
        "UPDATE cancellation_policies SET days_before_arrival = ?, amount_refund = ? WHERE id = ? AND property_id = ?";
      const params = [daysBeforeArrival, amountRefund, id, property_id];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to update cancellation policy. Error: ${e.message}`
      );
    }
  }

  async deleteCancellationPolicy(id, propertyId) {
    try {
      const query =
        "DELETE FROM cancellation_policies WHERE id = ? AND property_id = ?";
      const params = [id, propertyId];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to delete cancellation policy. Error: ${e.message}`
      );
    }
  }

  async insertOrUpdateChildrenPolicies(propertyId, policies) {
    try {
      const query =
        "INSERT INTO children_policies (property_id, allow_children, children_min_age, minors_room_types, free_stay_age) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE allow_children = VALUES (allow_children), children_min_age = VALUES (children_min_age), minors_room_types = VALUES (minors_room_types), free_stay_age = VALUES(free_stay_age)";
      const params = [
        propertyId,
        policies.getAllowChildren(),
        policies.getChildrenMinAge(),
        policies.getMinorsRoomTypes(),
        policies.getMinorsFreeStayAge(),
      ];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to insert or update children policies. Error: ${e.message}`
      );
    }
  }

  async insertOrUpdateOtherPolicies(propertyId, policies) {
    try {
      const query =
        "INSERT INTO other_policies (property_id, quiet_hours_from, quiet_hours_to, smoking_areas, external_guest_allowed, pets_allowed) VALUES (? ,? ,? ,? ,? ,?) ON DUPLICATE KEY UPDATE quiet_hours_from = VALUES (quiet_hours_from), quiet_hours_to = VALUES (quiet_hours_to), smoking_areas = VALUES (smoking_areas), external_guest_allowed = VALUES (external_guest_allowed), pets_allowed = VALUES (pets_allowed)";
      const params = [
        propertyId,
        policies.getQuietHoursFrom(),
        policies.getQuietHoursTo(),
        policies.getSmokingAreas(),
        policies.getExternalGuestAllowed(),
        policies.getPetsAllowed(),
      ];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to insert or update other policies. Error: ${e.message}`
      );
    }
  }
}
