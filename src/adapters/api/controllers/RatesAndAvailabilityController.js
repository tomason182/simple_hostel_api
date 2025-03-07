import { validationResult, matchedData } from "express-validator";

export class RatesAndAvailabilityController {
  constructor(ratesAndAvailabilityInputPort) {
    this.ratesAndAvailabilityInputPort = ratesAndAvailabilityInputPort;
  }

  // @desc Add a new rate and availability range
  // @route POST /api/v2/rates_availability/create/:id
  // @access Private
  createNewRange = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const userId = req.user._id;

      const data = matchedData(req);
      const ratesAndAvailabilityData = {
        room_type_id: data.roomTypeId,
        start_date: data.startDate,
        end_date: data.endDate,
        custom_rate: data.customRate,
        custom_availability: data.customAvailability,
      };

      const result =
        await this.ratesAndAvailabilityInputPort.createRatesAndAvailabilityRange(
          ratesAndAvailabilityData,
          propertyId,
          userId
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Check availability
  // @route POST /api/v2/rates_availability/check-availability
  // @access Private
  checkAvailability = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const propertyId = req.user.property_id;
      const data = matchedData(req);

      const result =
        await this.ratesAndAvailabilityInputPort.checkAvailabilityForProperty(
          propertyId,
          data.from,
          data.to
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  getRatesByDateRange = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const data = matchedData(req);

      const fromDate = data.from;
      const toDate = data.to;

      if (fromDate > toDate) {
        throw new Error("Invalid dates order");
      }

      const result =
        await this.ratesAndAvailabilityInputPort.getRatesByDateRange(
          propertyId,
          fromDate,
          toDate
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
