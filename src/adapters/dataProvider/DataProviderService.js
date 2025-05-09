import { response } from "express";
import { validationResult, matchedData } from "express-validator";

export class DataProviderService {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  fetchCountryCities = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { country_code } = matchedData(req);

      const query =
        "SELECT id, city FROM worldcities WHERE iso2 = ? ORDER BY city ASC";
      const params = [country_code];

      const [result] = await this.mysqlPool.execute(query, params);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  fetchCurrencies = async (req, res, next) => {
    try {
      const query = "SELECT * FROM worldcurrencies";
      const [result] = await this.mysqlPool.execute(query);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  fetchPaymentMethods = async (req, res, next) => {
    try {
      const query = "SELECT * FROM payment_methods";

      const [result] = await this.mysqlPool.execute(query);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  fetchAmenities = async (req, res, next) => {
    try {
      const language = req.params.language;
      const allowedLanguages = ["en", "es"];
      if (!allowedLanguages.includes(language)) {
        throw new Error("Invalid language");
      }
      const query =
        "SELECT * FROM amenities_translations WHERE language_code = ?";
      const params = [language];

      const [result] = await this.mysqlPool.execute(query, params);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  fetchFacilities = async (req, res, next) => {
    try {
      const language = req.params.language;
      const allowedLanguages = ["en", "es"];
      if (!allowedLanguages.includes(language)) {
        throw new Error("Invalid language");
      }

      const query =
        "SELECT ft.id, ft.facility_id, ft.name, f.category FROM facilities_translations AS ft JOIN facilities AS f ON f.id = ft.facility_id WHERE ft.language_code = ?";
      const params = [language];

      const [result] = await this.mysqlPool.execute(query, params);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  propertyAdvancePaymentPolicy = async (req, res, next) => {
    try {
      const propertyId = parseInt(req.params.id);

      if (isNaN(propertyId)) {
        throw new Error("Invalid ID.");
      }

      const query =
        "SELECT * FROM advance_payment_policies WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await this.mysqlPool.execute(query, params);

      return res.status(200).json(result[0] || null);
    } catch (e) {
      next(e);
    }
  };

  locationSearch = async (req, res, next) => {
    try {
      const { q, lang } = req.params;
      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          status: "error",
          msg: "QUERY_TOO_SHORT",
        });
      }

      const acceptedLanguages = ["es", "en"];

      if (!acceptedLanguages.includes(lang)) {
        return res.status(400).json({
          status: "error",
          msg: "INVALID_LANGUAGE_CODE",
        });
      }

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        q
      )}&format=json&addressdetails=1&limit=5&accept-language=${lang}`;

      const result = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "simplehostel.net (support@simplehostel.net)",
        },
      });

      if (!result.ok) {
        return res.status(400).json({
          status: "error",
          msg: "LOCATION_API_ERROR",
        });
      }

      const data = await result.json();

      return res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  };
}
