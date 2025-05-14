import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import checkPermission from "../../../middleware/rbacMiddleware.js";
import { ratesAndAvailabilitySchema } from "../schemas/ratesAndAvailabilitySchema.js";

export function createRatesAndAvailabilityRoutes(service) {
  const router = express.Router();
  const tokenService = createTokenService();

  const ratesAndAvailabilityController = service.ratesAndAvailabilityController;

  // @desc Add a new rate and availability range
  // @route POST /api/v2/rates-and-availability/create/:id
  // @access Private
  router.post(
    "/create",
    checkSchema(ratesAndAvailabilitySchema),
    authMiddleware(tokenService),
    checkPermission("create_rates_availability"),
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
    ratesAndAvailabilityController.getRatesByDateRange
  );

  // @desc Check Availability
  // @route POST /api/v2/rates-and-availability/check
  // @access Private
  // @ NO ESTA EN USO. SE UTILIZA GET/reservations/check-availability/:check_in-:check-out
  // @Ambas devuelven lo mismo
  /*   router.post(
    "/check-availability",
    authMiddleware(tokenService),
    checkSchema(checkAvailabilitySchema),
    ratesAndAvailabilityController.checkAvailability
  ); */

  return router;
}
