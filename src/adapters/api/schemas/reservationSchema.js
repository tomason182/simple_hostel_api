export const reservationSchema = {
  guestId: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Guest ID must be provided",
    },
    isInt: {
      bail: true,
      errorMessage: "Guest ID must be a valid Id",
    },
    toInt: true,
  },
  selectedRooms: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Selected rooms must be provided",
    },
    isArray: {
      bail: true,
      errorMessage: "Selected rooms must be an array",
    },
    custom: {
      options: values => {
        // Ensure values is an array
        if (!Array.isArray(values)) {
          throw new Error("Selected rooms must be an array");
        }

        // Ensure array is not empty
        if (values.length === 0) {
          throw new Error("Selected rooms array cannot be empty");
        }

        const validKeys = ["room_type_id", "number_of_guests", "total_amount"];

        // Ensure each value of the array is an object
        for (const obj of values) {
          if (typeof obj !== "object" || obj === null) {
            throw new Error("Each item in selected room must be an object");
          }

          // Ensure object only contains valid keys
          const objKeys = Object.keys(obj);
          if (!objKeys.every(key => validKeys.includes(key))) {
            throw new Error("Invalid key provided in SelectedRooms object");
          }

          // Ensure room_type_id is an integer.
          if (!Number.isInteger(obj.room_type_id)) {
            throw new Error("room_type_id must be an integer");
          }

          // Ensure number_of_guests is an integer.
          if (!Number.isInteger(obj.number_of_guest)) {
            throw new Error("number_of_guests must be an integer");
          }

          // Ensure total_amount is valid number.
          if (typeof obj.total_amount !== "number" || isNaN(obj.total_amount)) {
            throw new Error("total_amount must be a valid number");
          }

          // Ensure total amount is positive
          if (obj.total_amount < 0) {
            throw new Error("total_amount must be a positive number");
          }
        }
        return true;
      },
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
        "Booking source must be one of: booking.com, hostelWorld.com, direct or website",
    },
  },
  checkIn: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Check-in date must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "Check-in date mus be ISO8601 format",
    },
  },
  checkOut: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Check-out date must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "Check-out date mus be ISO8601 format",
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
