import express from "express";
import { checkSchema, body } from "express-validator";
import { taxesAndFeesSchema } from "../schemas/taxesAndFeesSchema.js";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";

export function createTaxesRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  const taxesController = services.taxesAndFeesController;

  // Get property taxes
  router.get(
    "/",
    authMiddleware(tokenService),
    taxesController.getTaxesAndFees
  );

  // Get taxes setting
  router.get(
    "/settings",
    authMiddleware(tokenService),
    taxesController.getTaxesAndFeesSettings
  );

  // Update taxes settings
  router.put(
    "/settings",
    authMiddleware(tokenService),
    body("embedded")
      .isBoolean()
      .withMessage("Embedded setting must be boolean"),
    taxesController.updateTaxesAndFeesSetting
  );

  // Add a new tax
  router.post(
    "/",
    authMiddleware(tokenService),
    checkSchema(taxesAndFeesSchema),
    taxesController.addNewTax
  );

  // Delete tax

  return router;
}
