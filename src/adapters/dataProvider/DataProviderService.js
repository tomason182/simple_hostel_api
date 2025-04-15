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
        "SELECT * FROM facilities_translations WHERE language_code = ?";
      const params = [language];

      const [result] = await this.mysqlPool.execute(query, params);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
