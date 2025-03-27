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
        return {
          status: "error",
          msg: "Property close for the selected rates.",
        };
      }

      const bedsAssigned =
        await this.reservationTransactionManagerPort.checkAvailabilityAndAssignBeds(
          reservation,
          ranges,
          conn
        );

      if (bedsAssigned.status === "error") {
        return {
          status: "error",
          msg: bedsAssigned.msg,
        };
      }

      // El total amount de cada cuarto se actualiza en el objeto reserva dentro de Availability service.
      const totalAmount = reservation
        .getSelectedRooms()
        .reduce((acc, value) => acc + value.total_amount, 0);

      const advancePayment =
        await this.reservationTransactionManagerPort.getAdvancePaymentPolicy(
          propertyId,
          conn
        );
      let depositAmount = 0;
      if (
        advancePayment !== null &&
        advancePayment.advance_payment_required === 1
      ) {
        depositAmount = Number(advancePayment.deposit_amount);
      }

      reservation.setAdvancePaymentAmount(totalAmount, depositAmount);

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

      if (bedsAssigned.reservationsToUpdate.length > 0) {
        const bedsToReassign = bedsAssigned.reservationsToUpdate;
        console.log(bedsToReassign);

        for (const object of bedsToReassign) {
          await this.reservationTransactionManagerPort.updateAssignedBed(
            parseInt(object.id),
            object.bed_id,
            conn
          );
        }
      }

      // Set get ID to reservation
      reservation.setGuestId(guest.getId());
      reservation.setBeds(bedsAssigned.bedsToAssign);

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
