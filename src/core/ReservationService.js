import { Reservation } from "./entities/Reservation.js";

export class ReservationService {
  constructor(reservationOutport) {
    this.reservationOutport = reservationOutport;
  }

  async createReservation(reservationData, conn = null) {
    try {
      const reservation = new Reservation(reservationData);

      // Check availability.
      const selectedRooms = reservation.getSelectedRooms();
      const checkIn = reservation.getCheckIn();
      const checkOut = reservation.getCheckOut();

      let isAvailable = true;
      for (room in selectedRooms) {
        roomTypeId = room.room_type_id;
        numberOfGuest = room.number_of_guest;
        isAvailable = await this.reservationOutport.checkAvailability(
          roomTypeId,
          checkIn,
          checkOut,
          conn
        );
        if (isAvailable === false) {
          throw new Error(
            "Unable to create reservation. No availability for the selected rooms"
          );
        }
      }

      // Create reservation
      const result = await this.reservationOutport.saveReservation(reservation);

      // send email to guest
      await this.reservationOutport.sendEmail();

      return result;
    } catch (e) {
      throw e;
    }
  }
}
