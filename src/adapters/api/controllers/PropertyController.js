import { validationResult, matchedData } from "express-validator";

export class PropertyController {
  constructor(propertyInputPort) {
    this.propertyInputPort = propertyInputPort;
  }

  // @desc    get a property details
  // @route   GET /api/v2/property/
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
  // @route   PUT /api/v2/properties/update
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

  // @desc    get property policies
  // @route   GET /api/v2/properties/policies/
  // @access  Private
  getPropertyPolicies = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;

      const result = await this.propertyInputPort.getPropertyPolicies(
        propertyId
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Insert or Update property reservations policies
  // @route   PUT /api/v2/properties/policies/reservations-policies
  // @access  Private
  reservationsPolicies = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;

      const data = matchedData(req);

      const result =
        await this.propertyInputPort.insertOrUpdateReservationsPolicies(
          propertyId,
          data
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Insert or Update advance payment
  // @route   PUT /api/v2/properties/policies/advance-payment-policies
  // @access  Private
  advancePaymentPolicies = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const data = matchedData(req);

      const result =
        await this.propertyInputPort.insertOrUpdateAdvancePaymentPolicies(
          propertyId,
          data
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Insert cancellation Policies
  // @route   POST /api/v2/properties/policies/cancellation-policies
  // @access  Private
  cancellationPolicies = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const data = matchedData(req);

      const result = await this.propertyInputPort.insertCancellationPolicies(
        propertyId,
        data
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Update cancellation Policies
  // @route   PUT /api/v2/properties/policies/cancellation-policies
  // @access  Private
  updateCancellationPolicies = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const data = matchedData(req);
      const result = await this.propertyInputPort.updateCancellationPolicies(
        propertyId,
        data
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Delete cancellation Policies
  // @route   DELETE /api/v2/properties/policies/delete-cancellation-policies
  // @access  Private
  deleteCancellationPolicies = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;

      const data = matchedData(req);

      const result = await this.propertyInputPort.deleteCancellationPolicies(
        propertyId,
        data
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Insert or Update children policies
  // @route   PUT /api/v1/properties/update/children-policies
  // @access  Private
  childrenPolicies = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;

      const data = matchedData(req);

      const result =
        await this.propertyInputPort.insertOrUpdateChildrenPolicies(
          propertyId,
          data
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Insert or Update other policies
  // @route   PUT /api/v1/properties/update/other-policies
  // @access  Private
  otherPolicies = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;

      const data = matchedData(req);

      const result = await this.propertyInputPort.insertOrUpdateOtherPolicies(
        propertyId,
        data
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Add or update property facilities
  // @route   POST /api/v2/properties/facilities
  // @access  Private
  addOrUpdateFacilities = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const data = matchedData(req);

      const result = await this.propertyInputPort.addOrUpdateFacilities(
        propertyId,
        data.facilities
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Get property facilities
  // @route GET /api/v2/properties/facilities
  // @access private
  getPropertyFacilities = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;

      const result = await this.propertyInputPort.getPropertyFacilities(
        propertyId
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
