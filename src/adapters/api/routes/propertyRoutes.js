import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import checkPermission from "../../../middleware/rbacMiddleware.js";
import {
  contactDetailsSchema,
  locationSchema,
  currenciesSchema,
} from "../schemas/propertySchema.js";
import {
  reservationPoliciesSchema,
  advancePaymentPoliciesSchema,
  cancellationPoliciesSchema,
  childrenPoliciesSchema,
  otherPoliciesSchema,
} from "../schemas/policiesSchema.js";
import { facilitiesSchema } from "../schemas/amenitiesSchema.js";

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
    "/update/location",
    authMiddleware(tokenService),
    checkSchema(locationSchema),
    checkPermission("update_location"),
    propertyController.updatePropertyDetails
  );

  // Update property currencies
  router.put(
    "/update/currencies",
    authMiddleware(tokenService),
    checkPermission("update_currencies"),
    checkSchema(currenciesSchema),
    propertyController.updateCurrencies
  );

  // Update property contact info
  router.put(
    "/update/contact-info",
    checkSchema(contactDetailsSchema),
    authMiddleware(tokenService),
    checkPermission("update_contact_info"),
    propertyController.updateContactInfo
  );

  // Get Property policies
  router.get(
    "/policies",
    authMiddleware(tokenService),
    propertyController.getPropertyPolicies
  );

  // Insert or update reservations policies
  router.post(
    "/policies/reservations-policies",
    checkSchema(reservationPoliciesSchema),
    authMiddleware(tokenService),
    checkPermission("update_policies"),
    propertyController.reservationsPolicies
  );

  // Insert or update advance payment and cancellation policies
  router.post(
    "/policies/advance-payment-policies",
    checkSchema(advancePaymentPoliciesSchema),
    authMiddleware(tokenService),
    checkPermission("update_policies"),
    propertyController.advancePaymentPolicies
  );

  router.post(
    "/policies/cancellation-policies",
    checkSchema(cancellationPoliciesSchema),
    authMiddleware(tokenService),
    checkPermission("update_policies"),
    propertyController.cancellationPolicies
  );

  router.put(
    "/policies/update-cancellation-policies/:id",
    param("id").trim().isInt().withMessage("Invalid param ID").toInt(),
    checkSchema(cancellationPoliciesSchema),
    authMiddleware(tokenService),
    checkPermission("update_policies"),
    propertyController.updateCancellationPolicies
  );

  router.delete(
    "/policies/delete-cancellation-policies/:id",
    param("id").trim().isInt().withMessage("Invalid param ID").toInt(),
    authMiddleware(tokenService),
    checkPermission("update_policies"),
    propertyController.deleteCancellationPolicies
  );

  router.post(
    "/policies/children-policies",
    checkSchema(childrenPoliciesSchema),
    authMiddleware(tokenService),
    checkPermission("update_policies"),
    propertyController.childrenPolicies
  );

  router.post(
    "/policies/other-policies",
    checkSchema(otherPoliciesSchema),
    authMiddleware(tokenService),
    checkPermission("update_policies"),
    propertyController.otherPolicies
  );

  // Add or edit property facilities
  router.post(
    "/facilities",
    checkSchema(facilitiesSchema),
    authMiddleware(tokenService),
    checkPermission("update_facilities"),
    propertyController.addOrUpdateFacilities
  );

  router.get(
    "/facilities",
    authMiddleware(tokenService),
    propertyController.getPropertyFacilities
  );

  return router;
}
