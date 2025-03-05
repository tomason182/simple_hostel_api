import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { reservationSchema } from "../schemas/reservationSchema.js";

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

  // @desc Find reservation by date range
  // @route GET /api/v2/reservations/find/:from-:to
  // @access Private
  router.get(
    "/find-by-range/:from-:to",
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
    reservationController.findByDateRange
  );

  return router;
}
