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
      const data = matchedData(req);

      const reservationData = {
        guest_id: data.guestId,
        property_id: propertyId,
        booking_source: data.bookingSource,
        currency: data.currency,
        reservation_status: data.reservationStatus,
        payment_status: data.paymentStatus,
        check_in: data.checkIn,
        check_out: data.checkOut,
        special_request: data.specialRequest || null,
        selected_rooms: data.selectedRooms,
      };

      const result = await this.reservationInputPort.createReservation(
        reservationData
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
