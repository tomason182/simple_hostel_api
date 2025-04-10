import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";

export function createBookEngineRoutes(service) {
  const router = express.Router();

  const bookEngineController = service.bookEngineController;

  //@desc Check availability
  //@route GET /api/v2/book-engine/check-availability/:propertyId/:from-:to
  //@access Public
  router.get(
    "/check-availability/:propertyId/:from-:to",
    param("propertyId")
      .trim()
      .isInt()
      .notEmpty()
      .withMessage("Invalid property ID"),
    param("from")
      .trim()
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
      .isISO8601({ strict: true })
      .withMessage("Not valid 8601 format")
      .customSanitizer(value => {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);

        return new Date(`${year}-${month}-${day}`);
      }),
    bookEngineController.checkAvailability
  );
}
