import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  contactDetailsSchema,
  propertyInfoSchema,
} from "../schemas/propertySchema.js";
import {
  reservationPoliciesSchema,
  advancePaymentPoliciesSchema,
  cancellationPoliciesSchema,
  childrenPoliciesSchema,
  otherPoliciesSchema,
} from "../schemas/policiesSchema.js";

export function createPropertyRoutes(services) {
  const router = express.Router();
  const tokenService = createTokenService();

  const propertyController = services.propertyController;

  // Get property details
  router.get(
    "/",
    authMiddleware(tokenService),
    propertyController.getPropertyDetails
  );

  // Update property details
  router.put(
    "/update/property-info",
    authMiddleware(tokenService),
    checkSchema(propertyInfoSchema),
    propertyController.updatePropertyDetails
  );

  // Update property contact info
  router.put(
    "/update/contact-info",
    checkSchema(contactDetailsSchema),
    authMiddleware(tokenService),
    propertyController.updateContactInfo
  );

  // Insert or update reservations policies
  router.post(
    "/policies/reservations-policies",
    checkSchema(reservationPoliciesSchema),
    authMiddleware(tokenService),
    propertyController.reservationsPolicies
  );

  // Insert or update advance payment and cancellation policies
  router.post(
    "/policies/advance-payment-policies",
    checkSchema(advancePaymentPoliciesSchema),
    authMiddleware(tokenService),
    propertyController.advancePaymentPolicies
  );

  router.post(
    "/policies/cancellation-policies",
    checkSchema(cancellationPoliciesSchema),
    authMiddleware(tokenService),
    propertyController.cancellationPolicies
  );

  router.put(
    "/policies/update-cancellation-policies/:id",
    param("id").trim().isInt().withMessage("Invalid param ID").toInt(),
    checkSchema(cancellationPoliciesSchema),
    authMiddleware(tokenService),
    propertyController.updateCancellationPolicies
  );

  router.delete(
    "/policies/delete-cancellation-policies/:id",
    param("id").trim().isInt().withMessage("Invalid param ID").toInt(),
    authMiddleware(tokenService),
    propertyController.deleteCancellationPolicies
  );

  return router;
}
