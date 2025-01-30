import { Reservation } from "./entities/Reservation.js";

export class ReservationService {
  constructor(reservationOutport) {
    this.reservationOutport = reservationOutport;
  }

  async createReservation(reservationData, conn = null) {
    try {
      console.log(reservationData);

      return "testing Reservation service";
    } catch (e) {
      throw e;
    }
  }
}
