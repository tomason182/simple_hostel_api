import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  reservationSchema,
  findReservationsByDatesAndName,
  changeReservationDates,
} from "../schemas/reservationSchema.js";

export function createReservationRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();
  const reservationController = services.reservationController;

  // @desc Create a new reservation
  // @route POST /api/v2/reservations/new
  // @access Private
  router.post(
    "/new",
    authMiddleware(tokenService),
    checkSchema(reservationSchema),
    reservationController.createReservation
  );

  // @desc Find todays reservations
  // @route GET /api/v2/reservations/find/:today
  // @access Private
  router.get(
    "/find/:date",
    authMiddleware(tokenService),
    param("date")
      .trim()
      .notEmpty()
      .isISO8601({ strict: true })
      .withMessage("Not valid 8601 format"),
    reservationController.findByDate
  );

  // @desc Find latest reservations
  // @route GET /api/v2/reservations/find/latest
  // @access Private
  router.get(
    "/latest",
    authMiddleware(tokenService),
    reservationController.findLatestReservations
  );

  // @desc Find reservation by date range
  // @route GET /api/v2/reservations/find/:from-:to
  // @access Private
  router.get(
    "/find-by-range/:from-:to-:type",
    authMiddleware(tokenService),
    param("from")
      .trim()
      .escape()
      .notEmpty()
      .isISO8601({ strict: true })
      .withMessage("Not valid 8601 format")
      .customSanitizer(value => {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);

        return new Date(`${year}-${month}-${day}`);
      }),
    param("to")
      .trim()
      .escape()
      .notEmpty()
      .isISO8601({ strict: true })
      .withMessage("Not valid 8601 format")
      .customSanitizer(value => {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
      }),
    param("type")
      .trim()
      .isIn(["calendar", "search"])
      .withMessage("Invalid search type"),
    reservationController.findByDateRange
  );

  // @desc find reservations by date range and name (if provided)
  // @route POST /api/v2/reservations/find-by-date-and-name
  // @access Private
  // REVISAR !!! REQUIERE TYPE CALENDAR O SEARCH?
  router.post(
    "/find-by-dates-and-name",
    authMiddleware(tokenService),
    checkSchema(findReservationsByDatesAndName),
    reservationController.findReservationsByDatesRangeAndName
  );

  // @desc find reservations by ID
  // @route POST /api/v2/reservations/find-by-date-and-name
  // @access Private
  router.get(
    "/find-by-id/:id",
    param("id")
      .trim()
      .escape()
      .isInt()
      .withMessage("Invalid ID format")
      .customSanitizer(value => parseInt(value)),
    authMiddleware(tokenService),
    reservationController.findReservationById
  );

  // @desc check property availability
  // @route GET /api/v2/reservations/check-availability/:check_in-:check_out
  // @access Private
  router.get(
    "/check-availability/:check_in-:check_out",
    authMiddleware(tokenService),
    param("check_in")
      .trim()
      .escape()
      .notEmpty()
      .isISO8601({ strict: true })
      .withMessage("Not valid 8601 format")
      .customSanitizer(value => {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);

        return new Date(`${year}-${month}-${day}`);
      }),
    param("check_out")
      .trim()
      .escape()
      .notEmpty()
      .isISO8601({ strict: true })
      .withMessage("Not valid 8601 format")
      .customSanitizer(value => {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
      }),
    reservationController.checkPropertyAvailability
  );

  // @desc Change reservation status
  // @route PUT /api/v2/reservations/change-status/:id
  // @access Private
  router.put(
    "/change-status/:id-:status",
    param("id").trim().isInt().withMessage("Invalid reservation ID").toInt(),
    param("status")
      .trim()
      .isIn([
        "canceled",
        "no_show",
        "provisional",
        "confirmed",
        "checked_in",
        "checked_out",
      ])
      .withMessage("invalid reservation status"),
    authMiddleware(tokenService),
    reservationController.changeReservationStatus
  );

  // @desc Change payment status
  // @route PUT /api/v2/reservations/change-payment-status/:id
  // @access Private
  router.put(
    "/change-payment-status/:id-:status",
    param("id").trim().isInt().withMessage("Invalid reservation ID").toInt(),
    param("status")
      .trim()
      .isIn(["pending", "partial", "paid", "refunded", "fully_refunded"])
      .withMessage(
        "Payment status must be one of pending, partial, paid, deposit_refunded, fully_refunded"
      ),
    authMiddleware(tokenService),
    reservationController.changePaymentStatus
  );

  // @desc Change reservation dates
  // @route PUT /api/v2/reservations/change-dates/:id
  // @access Private
  router.put(
    "/change-dates/:id",
    param("id").trim().isInt().withMessage("Invalid reservation ID").toInt(),
    checkSchema(changeReservationDates),
    authMiddleware(tokenService),
    reservationController.changeReservationDates
  );

  return router;
}
