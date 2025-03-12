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

      const query = "SELECT id, city FROM worldcities WHERE iso2 = ?";
      const params = [country_code];

      const [result] = await this.mysqlPool.execute(query, params);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
