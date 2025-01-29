import { escape } from "mysql2";

export const reservationSchema = {
  guestId: {
    in: ["body"],
    exits: {
      bail: true,
      errorMessage: "Guest ID must be provided",
    },
    isInt: {
      bail: true,
      errorMessage: "Guest ID must be a valid Id",
    },
  },
  roomTypeId: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Room type ID must be provided",
    },
    isInt: {
      bail: true,
      errorMessage: "Room type ID must be a valid Id",
    },
  },
  bookingSource: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Booking source must be provided",
    },
    isIn: {
      options: [["booking.com", "hostelWorld.com", "direct", "website"]],
      errorMessage:
        "Booking source must be one of: booking.com, hostelWord.com, direct or website",
    },
  },
  checkIn: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Check in date must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "Check in date mus be ISO8601 format",
    },
  },
  checkOut: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Check out date must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "Check out date mus be ISO8601 format",
    },
  },
  numberOfGuests: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Number of guests must be provided",
    },
    isInt: {
      bail: true,
      options: { min: 1, max: 100 },
      errorMessage: "Number of guest must be integer",
    },
  },
  totalPrice: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Total price must be provided",
    },
    isFloat: {
      bail: true,
      options: { min: 1 },
      errorMessage: "Total price must be a decimal number",
    },
  },
  currency: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Currency must be provided",
    },
    trim: true,
    isISO4217: {
      bail: true,
      errorMessage: "currency must be ISO 4217 format",
    },
  },
  reservationStatus: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Reservation status must be specified",
    },
    isIn: {
      options: [["confirmed", "provisional", "canceled", "no_show"]],
      errorMessage:
        "Reservation status must be one of confirmed, provisional, canceled, no_show",
    },
  },
  paymentStatus: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "payment status must be provided",
    },
    isIn: {
      options: [["pending", "canceled", "refunded", "paid", "partial"]],
      errorMessage:
        "Payment status must be one of: pending, canceled, refunded, paid, partial",
    },
  },
  specialRequest: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "special request must be provided. Use an empty string",
    },
    trim: true,
    escape: true,
    isLength: {
      options: {
        max: 500,
      },
      errorMessage: "Special request maximum length is 500 characters",
    },
  },
};
