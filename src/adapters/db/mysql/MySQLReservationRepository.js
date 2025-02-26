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

      return reservation;
    } catch (e) {
      throw new Error(
        `An error occurred when creating a new reservation. Error: ${e.message}`
      );
    }
  }

  async getReservationsListByDateRange(
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
}
