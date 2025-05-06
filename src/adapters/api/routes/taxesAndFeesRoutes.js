import express from "express";
import { checkSchema, param } from "express-validator";
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

  // Add a new tax
  router.post(
    "/",
    authMiddleware(tokenService),
    checkSchema(taxesAndFeesSchema),
    taxesController.addNewTax
  );

  // Delete tax
  router.delete(
    "/:id",
    authMiddleware(tokenService),
    param("id").isInt().withMessage("Invalid taxID"),
    taxesController.deleteTax
  );

  return router;
}
