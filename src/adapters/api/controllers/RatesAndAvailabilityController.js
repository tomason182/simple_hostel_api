import { validationResult, matchedData } from "express-validator";

export class ratesAndAvailabilityController {
  constructor(ratesAndAvailabilityInputPort) {
    this.ratesAndAvailabilityInputPort = ratesAndAvailabilityInputPort;
  }

  // @desc Add a new rate and availability range
  // @route POST /api/v1/rates_availability/create/:id
  // @access Private
  createNewRange = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const data = matchedData(req);
      console.log(data);

      return status(200).json({ msg: "ok" });
    } catch (e) {
      next(e);
    }
  };
}
