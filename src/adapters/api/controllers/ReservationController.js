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

      const guestData = {
        first_name: data.firstName,
        last_name: data.lastName,
        id_number: data.idNumber || null,
        email: data.email,
        phone_number: (data.phoneCode || null) + (data.phoneNumber || null),
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
        special_request: data.specialRequest || null,
        selected_rooms: data.selectedRooms,
        created_by: user,
        updated_by: user,
      };

      const result = await this.reservationInputPort.createReservationAndGuest(
        reservationData,
        guestData
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
        res.status(200).json({ status: "error", msg: "any file provided" });
      }

      if (
        (from === undefined && until !== undefined) ||
        (from !== undefined && until === undefined)
      ) {
        res.status(200).json({
          status: "error",
          msg: "Both dates must be provided for the range",
        });
      }

      const result =
        await this.reservationInputPort.findReservationsByDateRangeAndName(
          propertyId,
          from,
          until,
          name
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Find reservation by id
  // @route GET /api/v2/reservations/find-by-id/:id
  // @access Private
  findReservationById = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const { id } = matchedData(req);

      const result = await this.reservationInputPort.findReservationById(
        propertyId,
        id
      );

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

  findLatestReservations = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;

      const result = await this.reservationInputPort.findLatestReservations(
        propertyId
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

      const { from, to, type } = matchedData(req);

      const result =
        await this.reservationInputPort.findReservationsByDateRange(
          propertyId,
          from,
          to,
          type
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

  changeReservationStatus = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const { id, status } = matchedData(req);

      const result = await this.reservationInputPort.changeReservationStatus(
        id,
        status,
        propertyId
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  changePaymentStatus = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const { id, status } = matchedData(req);

      const result = await this.reservationInputPort.changePaymentStatus(
        id,
        status,
        propertyId
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  changeReservationDates = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const { id, newCheckIn, newCheckOut } = matchedData(req);

      const result = await this.reservationInputPort.changeReservationDates(
        propertyId,
        id,
        newCheckIn,
        newCheckOut
      );

      if (result.status === "error") {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  changeReservationPrices = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const body = req.body;
      const param = req.params;
      const propertyId = req.user.property_id;

      // Check if body includes deposit.
      if (!Object.keys(body).includes("deposit")) {
        throw new Error("Deposit must be included");
      }

      for (const [key, val] of Object.entries(body)) {
        if (key !== "deposit") {
          if (!/^\d+$/.test(key)) {
            throw new Error("Invalid room ID key");
          }
        }

        if (isNaN(Number(val))) {
          throw new Error("Invalid values provided");
        }
      }

      const reservationId = param.id;
      const prices = body;

      const result = await this.reservationInputPort.changeReservationPrices(
        propertyId,
        reservationId,
        prices
      );

      if (result.status === "error") {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
