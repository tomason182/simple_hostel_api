import { validationResult, matchedData } from "express-validator";

export class ReservationController {
  constructor(reservationInputPort) {
    this.reservationInputPort = reservationInputPort;
  }

  // @desc Create a new reservation from the app.
  // @route POST /api/v1/reservations/new
  // @access Private
  createReservation = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const propertyId = req.user.property_id;
      const user = req.user._id;
      const data = matchedData(req);

      // Set source to app. This prevent notification been send in the reservation service.
      const source = "app"; // when coming from website source = "web"

      const guestData = {
        first_name: data.firstName,
        last_name: data.lastName,
        id_number: data.idNumber || null,
        email: data.email,
        phone_number: data.phoneNumber || null,
        street: data.street || null,
        city: data.city || null,
        country_code: data.countryCode || null,
        postal_code: data.postalCode || null,
      };

      const reservationData = {
        property_id: propertyId,
        booking_source: data.bookingSource,
        currency: data.currency,
        reservation_status: data.reservationStatus,
        payment_status: data.paymentStatus,
        check_in: data.checkIn,
        check_out: data.checkOut,
        number_of_guests: data.number_of_guests,
        special_request: data.specialRequest || null,
        selected_rooms: data.selectedRooms,
        created_by: user,
        updated_by: user,
      };

      const result = await this.reservationInputPort.createReservationAndGuest(
        reservationData,
        guestData,
        source
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Find reservations by date range and name.
  // @route POST /api/v2/reservations/find-by-date-and-name
  // @access Private
  findReservationsByDatesRangeAndName = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(req);
      }

      const propertyId = req.user.property_id;
      // return undefined if not provided (optionals)
      const { from, until, name } = matchedData(req);

      if (from === undefined && until === undefined && name === undefined) {
        res.status(400);
        throw new Error("Any field provided");
      }

      if (
        (from === undefined && until !== undefined) ||
        (from !== undefined && until === undefined)
      ) {
        res.status(400);
        throw new Error("Both dates must be provided for the range");
      }

      const result =
        await this.reservationInputPort.findReservationsByDateRangeAndName(
          propertyId,
          from,
          until,
          name
        );

      console.log(name);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  findByDate = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const date = req.params.date;

      const result = await this.reservationInputPort.findReservationsByDate(
        propertyId,
        date
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  findByDateRange = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;

      const { from, to } = matchedData(req);

      const result =
        await this.reservationInputPort.findReservationsByDateRange(
          propertyId,
          from,
          to
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  checkPropertyAvailability = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const { check_in, check_out } = matchedData(req);

      const result = await this.reservationInputPort.checkAvailability(
        propertyId,
        check_in,
        check_out
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
