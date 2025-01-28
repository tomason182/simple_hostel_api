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

      console.log("propertyId: ", propertyId);
      console.log("userid: ", userId);
      console.log("data: ", data);

      return res.status(200).json({ msg: "ok" });
    } catch (e) {
      next(e);
    }
  };
}
