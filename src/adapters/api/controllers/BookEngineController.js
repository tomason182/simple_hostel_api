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

      // In get property data we check if property ID exist.
      const propertyInfo = await this.bookEngineInputPort.getPropertyData(
        propertyId
      );

      if (propertyInfo.status === "error") {
        return res.status(404).json(propertyInfo);
      }
      // If property ID exist we get the policies.
      const propertyPolicies =
        await this.bookEngineInputPort.getPropertyPolicies(propertyId);

      return res.status(200).json({ propertyInfo, propertyPolicies });
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

      const propertyData = await this.bookEngineInputPort.getPropertyData(
        data.propertyId
      );
      if (propertyData.status === "error") {
        return res.status(404).json(propertyData);
      }

      // Is necessary to check if the policies are satisfied.
      // minimum length of stay
      // maximum length of stay (We might want to remove this policy)
      // minimum advance booking

      const guestData = {
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

      const reservationData = {
        property_id: propertyData.getId(),
        booking_source: "book-engine",
        currency: propertyData.getBaseCurrency(),
        reservation_status: "provisional",
        payment_status: "pending",
        advance_payment_status: "pending",
        check_in: data.checkIn,
        check_out: data.checkOut,
        special_request: data.specialRequest || null,
        selected_rooms: data.selectedRooms,
      };

      const result = await this.bookEngineInputPort.createReservation(
        reservationData,
        guestData
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
