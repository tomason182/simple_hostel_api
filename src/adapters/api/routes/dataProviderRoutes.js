import express from "express";
import { param, query } from "express-validator";

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

  // Get amenities
  router.get("/amenities/:language", dataProviderService.fetchAmenities);

  // Get facilities
  router.get("/facilities/:language", dataProviderService.fetchFacilities);

  // Get property advance_payment_policy
  router.get(
    "/properties/advance-payment-policy/:id",
    dataProviderService.propertyAdvancePaymentPolicy
  );

  // Get locations data
  router.get(
    "/location-search/lat/:lat/lon/:lon/lang/:lang",
    dataProviderService.locationSearch
  );

  return router;
}
