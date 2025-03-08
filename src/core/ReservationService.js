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

  async findReservationsByDateRange(propertyId, from, to) {
    try {
      // Check dates.
      if (from > to) {
        throw new Error("Dates are in invert order. From greater that to");
      }

      const reservationsList =
        await this.reservationOutport.findReservationsByDateRange(
          propertyId,
          from,
          to
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

      console.log(reservations);

      return reservations;
    } catch (e) {
      throw e;
    }
  }
  async findReservationsByDateRangeAndName(propertyId, from, until, name) {
    if (from > until) {
      throw new Error("Dates are in invert order. From greater that to");
    }

    if (from === undefined && until === undefined) {
      const searchResult =
        await this.reservationOutport.findReservationByGuestName(
          propertyId,
          name
        );

      return searchResult;
    }

    const reservationsList =
      await this.reservationOutport.searchForReservations(
        propertyId,
        from,
        until
      );

    if (name) {
      // filter reservation list by name
    }
  }
}
