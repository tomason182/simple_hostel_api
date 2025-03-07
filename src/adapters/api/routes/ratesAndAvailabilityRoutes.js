import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  ratesAndAvailabilitySchema,
  checkAvailabilitySchema,
} from "../schemas/ratesAndAvailabilitySchema.js";

export function createRatesAndAvailabilityRoutes(service) {
  const router = express.Router();
  const tokenService = createTokenService();

  const ratesAndAvailabilityController = service.ratesAndAvailabilityController;

  // @desc Add a new rate and availability range
  // @route POST /api/v2/rates-and-availability/create/:id
  // @access Private
  router.post(
    "/create",
    authMiddleware(tokenService),
    checkSchema(ratesAndAvailabilitySchema),
    ratesAndAvailabilityController.createNewRange
  );

  // @desc Get rates and availability ranges
  // @route GET /api/v2/rates-and-availability/find/:from-:to
  // @access Private
  router.get(
    "/find/:from-:to",
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

        const check = new Date(year, month, day);
        if (
          check.getFullYear() !== parseInt(year) ||
          check.getMonth() !== parseInt(month) ||
          check.getDate() !== parseInt(day)
        ) {
          throw new Error("Invalid date format");
        }
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

        const check = new Date(year, month, day);
        if (
          check.getFullYear() !== parseInt(year) ||
          check.getMonth() !== parseInt(month) ||
          check.getDate() !== parseInt(day)
        ) {
          throw new Error("Invalid date format");
        }
        return new Date(`${year}-${month}-${day}`);
      }),
    ratesAndAvailabilityController.getRatesByDateRange
  );

  // @desc Check Availability
  // @route POST /api/v2/rates-and-availability/check
  // @access Private
  router.post(
    "/check-availability",
    authMiddleware(tokenService),
    checkSchema(checkAvailabilitySchema),
    ratesAndAvailabilityController.checkAvailability
  );

  return router;
}
