import { validationResult, matchedData } from "express-validator";

export class GuestController {
  constructor(guestInputPort) {
    this.guestInputPort = guestInputPort;
  }

  // @desc    Create a new Guest
  // @route   POST /api/v1/guests/create
  // @access  Private
  createGuest = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const data = matchedData(req);

      const guestData = {
        first_name: data.firstName,
        last_name: data.lastName,
        id_number: data.idNumber || null,
        email: data.email,
        phone_number: data.phoneNumber || null,
        city: data.city || null,
        street: data.street || null,
        postal_code: data.postalCode || null,
        country_code: data.countryCode || null,
      };

      const result = await this.guestInputPort.createGuest(
        propertyId,
        guestData
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Update an specific guest
  // @route   PUT /api/v1/guests/update/:id
  // @access  Private
  updateGuest = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const data = matchedData(req);
      const guestData = {
        id: data.id,
        first_name: data.firstName,
        last_name: data.lastName,
        id_number: data.idNumber || null,
        email: data.email,
        phone_number: data.phoneNumber || null,
        street: data.street || null,
        city: data.city || null,
        country_code: data.countryCode || null,
        postal_code: data.postalCode || null,
      };

      const propertyId = req.user.property_id;

      const result = await this.guestInputPort.updateGuest(
        guestData,
        propertyId
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Get an specific guest by id
  // @route   GET /api/v1/guests/:id
  // @access  Private
  findGuestById = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const { id } = matchedData(req);
      const result = await this.guestInputPort.findGuestById(id, propertyId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
