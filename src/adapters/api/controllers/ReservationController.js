import { validationResult, matchedData } from "express-validator";

export class ReservationController {
  constructor(reservationInputPort) {
    this.reservationInputPort = reservationInputPort;
  }

  // @desc Create a new reservation
  // @route POST /api/v1/reservations/new
  // @access Private
  createReservation = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const propertyId = req.user.property_id;
      const user = req.user._id;
      const data = matchedData(req);

      const guestData = {
        first_name: data.first_name,
        last_name: data.last_name,
        id_number: data.id_number || null,
        email: data.email,
        phone_number: data.phone_number || null,
        street: data.street || null,
        city: data.city || null,
        country_code: data.country_code || null,
        postal_code: data.postal_code || null,
      };

      const reservationData = {
        property_id: propertyId,
        booking_source: data.bookingSource,
        currency: data.currency,
        reservation_status: data.reservationStatus,
        payment_status: data.paymentStatus,
        check_in: data.checkIn,
        check_out: data.checkOut,
        special_request: data.specialRequest || null,
        selected_rooms: data.selectedRooms,
        created_by: user,
        updated_by: user,
      };

      const result = await this.reservationInputPort.createReservationAndGuest(
        reservationData
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
