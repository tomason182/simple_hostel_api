import { Reservation } from "./entities/Reservation.js";

export class ReservationService {
  constructor(reservationOutport) {
    this.reservationOutport = reservationOutport;
  }

  async findReservationsByDate(propertyId, date) {
    try {
      const reservations = await this.reservationOutport.findReservationsByDate(
        propertyId,
        date
      );
      return reservations;
    } catch (e) {
      throw e;
    }
  }
}
