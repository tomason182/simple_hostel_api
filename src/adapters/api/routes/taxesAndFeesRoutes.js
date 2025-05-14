import express from "express";
import { checkSchema, param } from "express-validator";
import { taxesAndFeesSchema } from "../schemas/taxesAndFeesSchema.js";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import checkPermission from "../../../middleware/rbacMiddleware.js";

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
    checkSchema(taxesAndFeesSchema),
    authMiddleware(tokenService),
    checkPermission("add_tax"),
    taxesController.addNewTax
  );

  // Delete tax
  router.delete(
    "/:id",
    param("id").isInt().withMessage("Invalid taxID"),
    authMiddleware(tokenService),
    checkPermission("delete_tax"),
    taxesController.deleteTax
  );

  return router;
}
