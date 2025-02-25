import { Reservation } from "./entities/Reservation.js";

export class ReservationService {
  constructor(reservationOutport) {
    this.reservationOutport = reservationOutport;
  }

  async createReservation(reservationData, conn = null) {
    try {
      const reservation = new Reservation(reservationData);
      reservation.setSelectedRooms(reservationData.selected_rooms);

      // Check availability.
      const selectedRooms = reservation.getSelectedRooms();
      const checkIn = reservation.getCheckIn();
      const checkOut = reservation.getCheckOut();
      const propertyId = reservation.getPropertyId();

      let isAvailable = true;
      for (const room of selectedRooms) {
        isAvailable = await this.reservationOutport.checkAvailability(
          room,
          propertyId,
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
      // await this.reservationOutport.sendEmail();

      return result;
    } catch (e) {
      throw e;
    }
  }
}
