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
}
