import { Guest } from "../core/entities/Guest.js";
import { Reservation } from "./entities/Reservation.js";

export class ReservationCompositeService {
  constructor(ReservationTransactionManagerPort, mysqlPool) {
    (this.ReservationTransactionManagerPort =
      ReservationTransactionManagerPort),
      (this.mysqlPool = mysqlPool);
  }

  // Create a new Reservation
  async createReservation(reservationData, guestData) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();
      const guest = new Guest(guestData);

      // Find if Guest already exist for the property
      const guestExist =
        await this.ReservationTransactionManagerPort.findGuestByEmail(
          guest.getEmail(),
          reservation.getPropertyId(),
          conn
        );

      if (guestExist === null) {
        await this.ReservationTransactionManagerPort.createGuest(guest, conn);
      } else {
        await this.ReservationTransactionManagerPort.updateGuest(guest, conn);
      }

      const reservation = new Reservation(reservationData);
      // Set get ID to reservation
      reservation.setGuestId(guest.getId());
      // Set selected rooms
      reservation.setSelectedRooms(reservationData.selectedRooms);

      // Check availability
      const SelectedRoomsList = reservation.getSelectedRooms();
      const checkIn = reservation.getCheckIn();
      const checkOut = reservation.getCheckOut();
      for (const room in SelectedRoomsList) {
        const isAvailable =
          await this.ReservationTransactionManagerPort.checkAvailability(
            room.room_type_id,
            room.number_of_guest,
            checkIn,
            checkOut,
            conn
          );
        if (isAvailable === false) {
          throw new Error("No beds available for the selected dates.");
        }
      }

      await this.ReservationTransactionManagerPort.createReservation(
        reservation,
        conn
      );

      await this.ReservationTransactionManagerPort.sendEmailToGuest();
      await this.ReservationTransactionManagerPort.sendEmailToProperty();

      await conn.commit();
      return "something";
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release();
    }
  }
}
