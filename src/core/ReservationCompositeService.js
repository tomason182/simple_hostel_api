import { Guest } from "../core/entities/Guest.js";
import { confirmationMailBody } from "../utils/emailBodyGenerator.js";
import { Reservation } from "./entities/Reservation.js";

export class ReservationCompositeService {
  constructor(reservationTransactionManagerPort, mysqlPool) {
    this.reservationTransactionManagerPort = reservationTransactionManagerPort;
    this.mysqlPool = mysqlPool;
  }

  // Create a new Reservation
  async createReservationAndGuest(reservationData, guestData) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      const guest = new Guest(guestData);
      const reservation = new Reservation(reservationData);
      reservation.setSelectedRooms(reservationData.selected_rooms);

      const propertyId = reservation.getPropertyId();

      const advancePayment =
        await this.reservationTransactionManagerPort.getAdvancePaymentPolicy(
          propertyId,
          conn
        );

      const bedsAssigned =
        await this.reservationTransactionManagerPort.checkAvailabilityAndAssignBeds(
          reservation,
          advancePayment,
          conn
        );

      if (bedsAssigned.status === "error") {
        return {
          status: "error",
          msg: bedsAssigned.msg,
        };
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

      if (
        reservation.getBookingSource() === "book-engine" ||
        reservation.getBookingSource() === "direct"
      ) {
        const to = guest.getEmail();
        const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
        const subject = "Your reservation is confirmed";
        const body = "<p>You made your first reservation</p>";

        await this.reservationTransactionManagerPort.sendEmailToGuest(
          to,
          subject,
          body,
          from
        );
      }

      if (reservation.getBookingSource() === "book-engine") {
        // We send an email to the property if the reservation is made form the website.
        await this.reservationTransactionManagerPort.sendEmailToProperty();

        // We can also send a whatsapp message here.
        //await this.reservationTransactionManagerPort.sendWhatsappMessage();

        // We can send a notification to the app via Websocket
        //await this.reservationTransactionManagerPort.sendNotification()
      }

      await conn.commit();
      return {
        status: "ok",
        msg: {
          id: reservation.getId(),
          email: guest.getEmail(),
        },
      };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release();
    }
  }
}
