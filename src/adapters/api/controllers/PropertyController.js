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

  // @desc    Update property contact details
  // @route   PUT /api/v2/properties/update/contact-details
  // @access  Private
  updateContactInfo = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const data = matchedData(req);

      const propertyId = req.user.property_id;

      const result = await this.propertyInputPort.updateContactInfo(
        propertyId,
        data
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
        street: data.street || null,
        city: data.city || null,
        postal_code: data.postal_code || null,
        alpha_2_code: data.alpha_2_code || null,
        base_currency: data.base_currency,
        payment_currency: data.payment_currency || null,
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
