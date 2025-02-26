import { Guest } from "../core/entities/Guest.js";
import { confirmationMailBody } from "../utils/emailBodyGenerator.js";
import { Reservation } from "./entities/Reservation.js";

export class ReservationCompositeService {
  constructor(reservationTransactionManagerPort, mysqlPool) {
    this.reservationTransactionManagerPort = reservationTransactionManagerPort;
    this.mysqlPool = mysqlPool;
  }

  // Create a new Reservation
  async createReservationAndGuest(reservationData, guestData, source) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      const guest = new Guest(guestData);
      const reservation = new Reservation(reservationData);
      reservation.setSelectedRooms(reservationData.selected_rooms);

      const selectedRooms = reservation.getSelectedRooms();
      const checkIn = reservation.getCheckIn();
      const checkOut = reservation.getCheckOut();
      const propertyId = reservation.getPropertyId();

      const roomsIdList = selectedRooms.flatMap(room => room.room_type_id);

      // Get ranges for all selected room types and lock rows to prevent race conditions.
      // DE ESTOS RANGOS PUEDO CALCULAR DISPONIBILIDAD Y TAMBIEN PRECIO TOTAL.
      const ranges = await this.reservationTransactionManagerPort.getAllRanges(
        roomsIdList,
        checkIn,
        checkOut,
        conn
      );

      if (ranges.length === 0) {
        throw Error("No ranges found for the selected dates.");
      }

      // Check availability Logic
      for (const room of selectedRooms) {
        const isAvailable =
          await this.reservationTransactionManagerPort.checkAvailability(
            room,
            ranges,
            propertyId,
            checkIn,
            checkOut,
            conn
          );
        if (isAvailable === false) {
          throw new Error("No beds available for the selected dates.");
        }
      }

      // Find if Guest already exist for the property
      const guestExist =
        await this.reservationTransactionManagerPort.findGuestByEmail(
          guest.getEmail(),
          reservation.getPropertyId(),
          conn
        );

      if (guestExist === null) {
        await this.reservationTransactionManagerPort.saveGuest(
          guest,
          propertyId,
          conn
        );
      } else {
        guest.setId(guestExist.id);
        await this.reservationTransactionManagerPort.updateGuest(guest, conn);
      }

      // Set get ID to reservation
      reservation.setGuestId(guest.getId());

      await this.reservationTransactionManagerPort.saveReservation(
        reservation,
        conn
      );

      const to = guest.getEmail();
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Your reservation is confirmed";
      const body = confirmationMailBody();

      await this.reservationTransactionManagerPort.sendEmailToGuest(
        guest.getEmail(),
        subject,
        body,
        from
      );

      if (source === "web") {
        // We send an email to the property if the reservation is made form the website.
        await this.reservationTransactionManagerPort.sendEmailToProperty();

        // We can also send a whatsapp message here.
        //await this.reservationTransactionManagerPort.sendWhatsappMessage();

        // We can send a notification to the app via Websocket
        //await this.reservationTransactionManagerPort.sendNotification()
      }

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
