export class MySQLReservationRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async createReservation(reservation, conn = null) {
    try {
      const query =
        "INSERT INTO reservations (guest_id, property_id, booking_source, currencies, reservation_status, check_in, check_out, special_request, created_by) VALUES(?,?,?,?,?,?,?,?,?)";
      const params = [
        reservation.getGuestId(),
        reservation.getPropertyId(),
        reservation.getBookingSource(),
        reservation.getCurrency(),
        reservation.getReservationStatus(),
        reservation.getCheckIn(),
        reservation.getCheckOut(),
        reservation.getSpecialRequest(),
        reservation.getCreateBy(),
      ];

      const [result] = (conn || this.pool).execute(query, params);

      reservation.setId(result.insertId);
      return reservation;
    } catch (e) {
      throw new Error(
        `An error occurred when creating a new reservation. Error: ${e.message}`
      );
    }
  }
  async getReservationListByDateRange(
    roomTypeId,
    checkIn,
    checkOut,
    conn = null
  ) {
    try {
      const query =
        "SELECT id, check_in, check_out, number_of_guest FROM reservations WHERE room_type_id = ? AND reservation_status NOT IN ('canceled', 'no_show') AND check_in < ? AND check_out > ?";
      const params = [roomTypeId, checkOut, checkIn];

      const [result] = (conn || this.pool).execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred when getting the reservation list. Error: ${e.message}`
      );
    }
  }
}
