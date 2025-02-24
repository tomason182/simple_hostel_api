export class MySQLReservationRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async createReservation(reservation, conn = null) {
    try {
      const query =
        "INSERT INTO reservations (guest_id, property_id, booking_source, currencies, reservation_status, payment_status, check_in, check_out, special_request, created_by) VALUES(?,?,?,?,?,?,?,?,?)";
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
        reservation.getCreateBy(),
      ];

      const [result] = await conn.execute(query, params);

      reservation.setId(result.insertId);

      const setRoomsQuery =
        "INSERT INTO reservation_rooms (reservation_id, room_type_id, number_of_guest, total_amount) VALUES (?,?,?,?)";
      for (room of reservation.getSelectedRooms()) {
        const roomParams = [
          reservation.getId(),
          room.room_type_id,
          room.number_of_guest,
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

  async getReservationListByDateRange(
    roomTypeId,
    startDate,
    endDate,
    conn = null
  ) {
    try {
      const query =
        "SELECT id, check_in, check_out, number_of_guest FROM reservations WHERE room_type_id = ? AND reservation_status NOT IN ('canceled', 'no_show') AND check_in <= ? AND check_out > ?";
      const params = [roomTypeId, endDate, startDate];

      const [result] = await (conn || this.mysqlPool).execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred when getting the reservation list. Error: ${e.message}`
      );
    }
  }
}
