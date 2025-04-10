import { validationResult, matchedData } from "express-validator";

export class BookEngineController {
  constructor(bookEngineInputPort) {
    this.bookEngineInputPort = bookEngineInputPort;
  }
  // @desc Get property data
  // @route GET /api/v2/book-engine/property/:propertyId
  // @access Public
  getPropertyData = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const data = matchedData(req);

      const propertyId = data.propertyId;

      const result = await this.bookEngineInputPort.getPropertyData(propertyId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Check availability
  // @route GET /api/v2/book-engine/check-availability/:propertyId/:from-:to
  // @access Public
  checkAvailability = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const data = matchedData(req);

      const propertyId = data.propertyId;
      const checkIn = data.from;
      const checkOut = data.to;

      const result =
        await this.bookEngineInputPort.checkAvailabilityForProperty(
          propertyId,
          checkIn,
          checkOut
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Create reservation
  // @routes POST /api/v2/book-engine/reservation
  // @access Public
  createReservation = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const data = matchedData(req);

      const result = await this.bookEngineInputPort.createReservation(data);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
