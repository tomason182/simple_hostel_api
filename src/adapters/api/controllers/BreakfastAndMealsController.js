import { matchedData, validationResult } from "express-validator";

export class BreakfastAndMealsController {
  constructor(breakfastAndMealsInputPort) {
    this.breakfastAndMealsInputPort = breakfastAndMealsInputPort;
  }

  getBreakfastSettings = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;

      const result = await this.breakfastAndMealsInputPort.getBreakfastSettings(
        propertyId
      );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  updateBreakfastSettings = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const breakfastSetting = matchedData(req);

      console.log(breakfastSetting);
      const result =
        await this.breakfastAndMealsInputPort.updateBreakfastSettings(
          propertyId,
          breakfastSetting
        );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
