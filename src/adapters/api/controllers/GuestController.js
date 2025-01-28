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
      const userId = req.user._id;
      const data = matchedData(req);

      const guestData = {
        first_name: guestData.firstName,
        last_name: guestData.lastName,
        id_number: guestData.idNumber || null,
        email: guestData.email,
        phone_number: guestData.phoneNumber || null,
        city: guestData.city || null,
        street: guestData.street || null,
        postal_code: guestData.postalCode || null,
        country_code: guestData.countryCode || null,
      };

      const result = await this.guestInputPort.createGuest(
        propertyId,
        userId,
        data
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
