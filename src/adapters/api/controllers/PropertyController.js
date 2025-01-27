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
  // @route   PUT /api/v1/properties/update
  // @access  Private
  updatePropertyDetails = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const data = matchedData(req);
      const propertyId = req.user.property_id;

      const propertyData = {
        property_name: data.propertyName,
        street: data.street || null,
        city: data.city || null,
        postal_code: data.postalCode || null,
        country_code: data.country_code || null,
        phone_number: data.phoneNumber || null,
        email: data.email,
        base_currency: data.baseCurrency,
      };

      const result = await this.propertyInputPort.updatePropertyDetails(
        propertyId,
        propertyData
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
