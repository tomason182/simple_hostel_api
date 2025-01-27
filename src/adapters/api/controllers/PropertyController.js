import { validationResult, matchedData } from "express-validator";

export class PropertyController {
  constructor(propertyInputPort) {
    this.propertyInputPort = propertyInputPort;
  }

  // @desc    get a property details
  // @route   GET /api/v1/property/
  // @access  Private
  getPropertyDetails = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const result = await this.propertyInputPort.getPropertyDetails(
        propertyId
      );
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Update a property details
  // @route   PUT /api/v1/properties/
  // @access  Private
  updatePropertyDetails = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      return res.status(200).json({ msg: "ok" });
    } catch (e) {
      next(e);
    }
  };
}
