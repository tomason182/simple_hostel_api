export class MySQLReservationRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async save(reservation, conn = null) {
    try {
      const query =
        "INSERT INTO reservations (guest_id, property_id, booking_source, currency, reservation_status, payment_status, advance_payment_status, advance_payment_amount, check_in, check_out ,special_request, created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
      const params = [
        reservation.getGuestId(),
        reservation.getPropertyId(),
        reservation.getBookingSource(),
        reservation.getCurrency(),
        reservation.getReservationStatus(),
        reservation.getPaymentStatus(),
        reservation.getAdvancePaymentStatus(),
        reservation.getAdvancePaymentAmount(),
        reservation.getCheckIn(),
        reservation.getCheckOut(),
        reservation.getSpecialRequest(),
        reservation.getCreatedBy(),
      ];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      reservation.setId(result.insertId);

      const setRoomsQuery =
        "INSERT INTO reservation_rooms (reservation_id, room_type_id, number_of_rooms, total_amount) VALUES (?,?,?,?)";
      for (const room of reservation.getSelectedRooms()) {
        const roomParams = [
          reservation.getId(),
          room.room_type_id,
          room.number_of_rooms,
          room.total_amount,
        ];

        await conn.execute(setRoomsQuery, roomParams);
      }

      const setBedsQuery =
        "INSERT INTO assigned_beds (reservation_id, bed_id) VALUES (?,?)";

      for (const bed of reservation.getBeds()) {
        const bedsParams = [reservation.getId(), bed];

        await conn.execute(setBedsQuery, bedsParams);
      }

      return reservation;
    } catch (e) {
      throw new Error(
        `An error occurred when creating a new reservation. Error: ${e.message}`
      );
    }
  }

  async getOverlappingReservationsByPropertyId(
    propertyId,
    startDate,
    endDate,
    conn = null
  ) {
    try {
      const query =
        "SELECT reservations.id AS id, reservations.check_in, reservations.check_out, reservation_rooms.room_type_id, reservation_rooms.number_of_rooms FROM reservations JOIN reservation_rooms ON reservation_rooms.reservation_id = reservations.id WHERE reservations.property_id = ? AND reservations.reservation_status NOT IN ('canceled', 'no_show') AND reservations.check_in <= ? AND reservations.check_out > ?";
      const params = [propertyId, endDate, startDate];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred when getting reservations by property ID. Error: ${e.message}`
      );
    }
  }

  async getOverlappingReservations(
    roomTypeId,
    startDate,
    endDate,
    conn = null
  ) {
    try {
      const query =
        "SELECT reservation_rooms.id as id, reservation_rooms.number_of_rooms, reservations.check_in, reservations.check_out FROM reservation_rooms JOIN reservations ON reservation_rooms.reservation_id = reservations.id WHERE reservation_rooms.room_type_id = ? AND reservations.reservation_status NOT IN ('canceled', 'no_show') AND reservations.check_in < ? AND reservations.check_out > ?";
      const params = [roomTypeId, endDate, startDate];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred when getting the reservation list. Error: ${e.message}`
      );
    }
  }

  async getReservationsListLimit(roomTypeId, from, conn = null) {
    try {
      const query =
        "SELECT reservations.id as id, reservations.check_in, reservations.check_out, reservation_rooms.number_of_rooms, reservation_rooms.room_type_id, JSON_OBJECTAGG (assigned_beds.id, assigned_beds.bed_id) AS assigned_beds FROM reservations JOIN reservation_rooms ON reservation_rooms.reservation_id = reservations.id JOIN assigned_beds ON assigned_beds.reservation_id = reservations.id  WHERE reservation_rooms.room_type_id = ? AND reservations.reservation_status NOT IN ('canceled', 'no_show') AND reservations.check_out > ? GROUP BY reservations.id, reservation_rooms.number_of_rooms, reservation_rooms.room_type_id  LIMIT 500";
      const params = [roomTypeId, from];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get the reservation list. Error: ${e.message}`
      );
    }
  }

  async updateAssignedBed(id, bed, conn) {
    try {
      const query = "UPDATE assigned_beds SET bed_id=? WHERE id=?";
      const params = [bed, id];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      return result.changedRows;
    } catch (e) {
      throw new Error(
        `An error occurred trying to update assigned beds. Error: ${e.message}`
      );
    }
  }

  async findReservationsByDate(propertyId, date) {
    try {
      const query =
        "SELECT reservations.id as id, reservations.check_in, reservations.check_out, reservations.reservation_status ,guests.first_name, guests.last_name FROM reservations JOIN guests ON guests.id = reservations.guest_id WHERE reservations.property_id = ? AND reservations.check_in <= ? AND reservations.check_out >= ?";
      const params = [propertyId, date, date];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get reservations for specific date`
      );
    }
  }

  async findLatestReservations(propertyId) {
    try {
      const query =
        "SELECT reservations.id as id, reservations.check_in, reservations.check_out, reservations.reservation_status ,guests.first_name, guests.last_name FROM reservations JOIN guests ON guests.id = reservations.guest_id WHERE reservations.property_id = ? ORDER BY reservations.created_at DESC LIMIT 10";
      const params = [propertyId];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(`An error occurred trying the get latest reservations`);
    }
  }

  async getReservationsByDateRange(propertyId, from, to, type = "calendar") {
    try {
      let query;
      if (type === "calendar") {
        query =
          "SELECT reservations.id AS id, reservations.check_in, reservations.check_out, reservations.reservation_status, guests.first_name, guests.last_name, assigned_beds.bed_id FROM reservations JOIN guests ON guests.id = reservations.guest_id JOIN assigned_beds ON assigned_beds.reservation_id = reservations.id WHERE reservations.property_id = ? AND reservations.check_in <= ? AND reservations.check_out > ? AND reservations.reservation_status NOT IN ('canceled', 'no_show')";
      } else if (type === "search") {
        query =
          "SELECT reservations.id AS id, reservations.check_in, reservations.check_out, reservations.reservation_status, guests.first_name, guests.last_name, assigned_beds.bed_id FROM reservations JOIN guests ON guests.id = reservations.guest_id JOIN assigned_beds ON assigned_beds.reservation_id = reservations.id WHERE reservations.property_id = ? AND reservations.check_in <= ? AND reservations.check_out > ?";
      }

      const params = [propertyId, to, from];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get reservations by date range. Error: ${e.message}`
      );
    }
  }

  async findReservationById(propertyId, reservationId) {
    const query =
      "SELECT r.id AS id, r.booking_source, r.currency, r.reservation_status, r.payment_status, r.advance_payment_status, r.advance_payment_amount, r.check_in, r.check_out, r.special_request, g.id AS guest_id, g.first_name, g.last_name, g.id_number, g.email, g.phone_number, g.city, g.street, g.postal_code, g.country_code, rr.room_type_id AS room_type_id, rr.number_of_rooms, rr.total_amount, rt.description FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN reservation_rooms rr ON rr.reservation_id = r.id JOIN room_types rt ON rt.id = rr.room_type_id  WHERE r.property_Id = ? AND r.id = ?";
    const params = [propertyId, reservationId];

    const [result] = await this.mysqlPool.execute(query, params);

    return result;
  }

  async findReservationsByGuestName(propertyId, name) {
    try {
      const query =
        "SELECT r.id AS reservation_id, r.currency, r.reservation_status, r.check_in, r.check_out, g.first_name, g.last_name, rr.room_type_id AS room_type_id, rr.number_of_rooms, rr.total_amount FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN reservation_rooms rr ON rr.reservation_id = r.id JOIN room_types rt ON rt.id = rr.room_type_id  WHERE r.property_Id = ? AND MATCH(g.first_name, g.last_name) AGAINST (? IN NATURAL LANGUAGE MODE)";
      const params = [propertyId, name];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find reservations by guest name. Error: ${e.message}`
      );
    }
  }

  async findReservationByGuestNameAndDates(propertyId, from, until, name) {
    try {
      const query =
        "SELECT r.id AS reservation_id, r.currency, r.reservation_status, r.check_in, r.check_out, g.first_name, g.last_name, rr.room_type_id AS room_type_id, rr.number_of_rooms, rr.total_amount FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN reservation_rooms rr ON rr.reservation_id = r.id JOIN room_types rt ON rt.id = rr.room_type_id  WHERE r.property_Id = ? AND MATCH(g.first_name, g.last_name) AGAINST (? IN NATURAL LANGUAGE MODE) AND r.check_in >= ? AND r.check_in <= ?";
      const params = [propertyId, name, from, until];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find reservations by guest name and date range`
      );
    }
  }

  async searchReservationsByDateRange(propertyId, from, until) {
    try {
      const query =
        "SELECT r.id AS reservation_id, r.currency, r.reservation_status, r.check_in, r.check_out, g.first_name, g.last_name, rr.room_type_id AS room_type_id, rr.number_of_rooms, rr.total_amount FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN reservation_rooms rr ON rr.reservation_id = r.id JOIN room_types rt ON rt.id = rr.room_type_id  WHERE r.property_Id = ? AND r.check_in >= ? AND r.check_in <= ?";
      const params = [propertyId, from, until];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find reservations by dates range`
      );
    }
  }

  // Get Advance payment policy
  async getAdvancePaymentPolicy(propertyId, conn = null) {
    try {
      const query =
        "SELECT * FROM advance_payment_policies WHERE property_id = ? LIMIT 1";
      const params = [propertyId];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get advance payment policy. Error: ${e.message}`
      );
    }
  }

  // Update reservation status
  async updateReservationStatus(propertyId, id, status) {
    try {
      const query =
        "UPDATE reservations SET reservation_status = ? WHERE property_id = ? AND id = ?";
      const params = [status, propertyId, id];

      const [result] = await this.mysqlPool.execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred trying to update reservation status. Error: ${e.message}`
      );
    }
  }
}
