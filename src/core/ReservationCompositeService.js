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

      const bedsAssigned =
        await this.reservationTransactionManagerPort.checkAvailabilityAndAssignBeds(
          reservation,
          ranges,
          conn
        );

      if (bedsAssigned === false) {
        throw new Error("No beds available for the selected dates.");
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

      // Update reservations assigned beds if needed.  [{id1: bed_id_1}, {id2:bed_id_2}]
      if (bedsAssigned.reservationToUpdate.length > 0) {
      }

      // Set get ID to reservation
      reservation.setGuestId(guest.getId());
      reservation.setBeds(isAvailable.bedsToAssign);

      await this.reservationTransactionManagerPort.saveReservation(
        reservation,
        conn
      );

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

      if (source === "web") {
        // We send an email to the property if the reservation is made form the website.
        await this.reservationTransactionManagerPort.sendEmailToProperty();

        // We can also send a whatsapp message here.
        //await this.reservationTransactionManagerPort.sendWhatsappMessage();

        // We can send a notification to the app via Websocket
        //await this.reservationTransactionManagerPort.sendNotification()
      }

      await conn.commit();
      return true;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release();
    }
  }
}
