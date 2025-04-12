import express from "express";
import { param } from "express-validator";

export function fetchDataProvider(services) {
  const router = express.Router();

  const dataProviderService = services.dataProviderService;

  // Get country cities
  router.get(
    "/cities/:country_code",
    param("country_code")
      .trim()
      .escape()
      .isISO31661Alpha2()
      .withMessage("Invalid country code"),
    dataProviderService.fetchCountryCities
  );

  // Get currencies
  router.get("/currencies", dataProviderService.fetchCurrencies);

  // Get payment methods
  router.get("/payment-methods", dataProviderService.fetchPaymentMethods);

  return router;
}
