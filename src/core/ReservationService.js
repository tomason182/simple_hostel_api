import { Reservation } from "./entities/Reservation.js";
import { Guest } from "./entities/Guest.js";

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

  async findLatestReservations(propertyId) {
    try {
      const reservations = await this.reservationOutport.findLatestReservations(
        propertyId
      );

      return reservations;
    } catch (e) {
      throw e;
    }
  }

  async findReservationsByDateRange(propertyId, from, to, type) {
    try {
      // Check dates.
      if (from > to) {
        return {
          status: "error",
          msg: "Invalid date order",
        };
      }

      const reservationsList =
        await this.reservationOutport.findReservationsByDateRange(
          propertyId,
          from,
          to,
          type
        );

      let reservations = [];

      reservationsList.forEach(element => {
        let reservation = reservations.find(r => r.id === element.id);
        let beds = [];
        if (!reservation) {
          beds.push(element.bed_id);

          reservation = {
            id: element.id,
            check_in: element.check_in,
            check_out: element.check_out,
            reservation_status: element.reservation_status,
            guest_info: {
              full_name: `${element.first_name} ${element.last_name}`,
            },
            assigned_beds: beds,
          };

          reservations.push(reservation);
        } else {
          reservation.assigned_beds.push(element.bed_id);
        }
      });

      return {
        status: "ok",
        msg: reservations,
      };
    } catch (e) {
      throw e;
    }
  }
  async findReservationsByDateRangeAndName(propertyId, from, until, name) {
    try {
      if (from > until) {
        return {
          status: "error",
          msg: "Dates are in invert order. From greater that to",
        };
      }

      let searchResult = [];

      if (from === undefined && until === undefined && name !== undefined) {
        searchResult = await this.reservationOutport.findReservationByGuestName(
          propertyId,
          name
        );
      }

      if (from !== undefined && until !== undefined && name !== undefined) {
        searchResult =
          await this.reservationOutport.findReservationByGuestNameAndDates(
            propertyId,
            from,
            until,
            name
          );
      }

      if (from !== undefined && until !== undefined && name === undefined) {
        searchResult =
          await this.reservationOutport.searchReservationsByDateRange(
            propertyId,
            from,
            until
          );
      }

      let reservations = [];

      for (const element of searchResult) {
        let reservation = {
          reservation_id: null,
          currency: null,
          reservation_status: null,
          check_in: null,
          check_out: null,
          first_name: null,
          last_name: null,
          selected_rooms: [],
        };

        const storedReservation = reservations.find(
          r => r.reservation_id === element.reservation_id
        );

        if (storedReservation === undefined) {
          reservation.reservation_id = element.reservation_id;
          reservation.reservation_status = element.reservation_status;
          reservation.currency = element.currency;
          reservation.check_in = element.check_in;
          reservation.check_out = element.check_out;
          reservation.first_name = element.first_name;
          reservation.last_name = element.last_name;
          reservation.selected_rooms = [
            {
              room_type_id: element.room_type_id,
              number_of_rooms: element.number_of_rooms,
              total_amount: element.total_amount,
            },
          ];
          reservations.push(reservation);
          continue;
        }

        const room = {
          room_type_id: element.room_type_id,
          number_of_rooms: element.number_of_rooms,
          total_amount: element.total_amount,
        };

        storedReservation.selected_rooms.push(room);
      }

      return { status: "ok", msg: reservations };
    } catch (e) {
      throw e;
    }
  }

  async findReservationById(propertyId, reservationId) {
    try {
      const reservationList = await this.reservationOutport.findReservationById(
        propertyId,
        reservationId
      );

      if (reservationList.length === 0) {
        return {
          status: "error",
          msg: "Reservation ID not found",
        };
      }

      // Select the first reservation
      const r = reservationList[0];

      const reservation = new Reservation(r);
      const guest = new Guest({
        id: r.guest_id,
        first_name: r.first_name,
        last_name: r.last_name,
        id_number: r.id_number,
        email: r.email,
        phone_number: r.phone_number,
        street: r.street,
        city: r.city,
        country_code: r.country_code,
        postal_code: r.postal_code,
      });

      for (const element of reservationList) {
        reservation.setNumberOfRooms(
          element.room_type_id,
          element.number_of_rooms,
          element.total_amount
        );
      }

      return {
        reservation,
        guest,
      };
    } catch (e) {
      throw e;
    }
  }

  async changeReservationStatus(id, status, propertyId) {
    try {
      const result = await this.reservationOutport.updateReservationStatus(
        propertyId,
        id,
        status
      );

      return result;
    } catch (e) {
      throw e;
    }
  }

  async changePaymentStatus(id, status, propertyId) {
    try {
      const result = await this.reservationOutport.updatePaymentStatus(
        propertyId,
        id,
        status
      );

      return result;
    } catch (e) {
      throw e;
    }
  }
}
