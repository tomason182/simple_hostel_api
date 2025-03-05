export class MySQLReservationRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async save(reservation, conn = null) {
    try {
      await conn.beginTransaction();
      const query =
        "INSERT INTO reservations (guest_id, property_id, booking_source, currency, reservation_status, payment_status, check_in, check_out, special_request, created_by) VALUES(?,?,?,?,?,?,?,?,?,?)";
      const params = [
        reservation.getGuestId(),
        reservation.getPropertyId(),
        reservation.getBookingSource(),
        reservation.getCurrency(),
        reservation.getReservationStatus(),
        reservation.getPaymentStatus(),
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
        "INSERT INTO reservation_rooms (reservation_id, room_type_id, number_of_guests, total_amount) VALUES (?,?,?,?)";
      for (const room of reservation.getSelectedRooms()) {
        const roomParams = [
          reservation.getId(),
          room.room_type_id,
          room.number_of_guests,
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

  async getOverlappingReservations(
    roomTypeId,
    startDate,
    endDate,
    conn = null
  ) {
    try {
      const query =
        "SELECT reservation_rooms.id as id, reservation_rooms.number_of_guests, reservations.check_in, reservations.check_out FROM reservation_rooms JOIN reservations ON reservation_rooms.reservation_id = reservations.id WHERE reservation_rooms.room_type_id = ? AND reservations.reservation_status NOT IN ('canceled', 'no_show') AND reservations.check_in <= ? AND reservations.check_out > ?";
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
        "SELECT reservations.id as id, reservations.check_in, reservations.check_out, reservation_rooms.number_of_guests, reservation_rooms.room_type_id, JSON_OBJECTAGG (assigned_beds.id, assigned_beds.bed_id) AS assigned_beds FROM reservations JOIN reservation_rooms ON reservation_rooms.reservation_id = reservations.id JOIN assigned_beds ON assigned_beds.reservation_id = reservations.id  WHERE reservation_rooms.room_type_id = ? AND reservations.reservation_status NOT IN ('canceled', 'no_show') AND reservations.check_out > ? GROUP BY reservations.id, reservation_rooms.number_of_guests, reservation_rooms.room_type_id  LIMIT 500";
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

  async getReservationsByDateRange(propertyId, from, to) {
    try {
      const query =
        "SELECT reservations.id AS id, reservations.check_in, reservations.check_out, reservations.reservation_status, guests.first_name, guests.last_name, assigned_beds.bed_id FROM reservations JOIN guests ON guests.id = reservations.guest_id JOIN assigned_beds ON assigned_beds.reservation_id = reservations.id WHERE reservations.property_id = ? AND reservations.check_in >= ? AND reservations.check_in <= ?";
      const params = [propertyId, from, to];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get reservations by date range. Error: ${e.message}`
      );
    }
  }
}
