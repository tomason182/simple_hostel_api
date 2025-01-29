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
}
