export const ratesAndAvailabilitySchema = {
  roomTypeId: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "Room type ID must be provided",
    },
    isInt: {
      bail: true,
      errorMessage: "Room type ID must be a valid Id",
    },
    toInt: true,
  },
  startDate: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "Start date must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "Start date must be ISO8601 format",
    },
    customSanitizer: {
      options: value => new Date(value),
    },
  },
  endDate: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "End date must be provided",
    },
    isISO8601: {
      strict: true,
      errorMessage: "End date must be ISO8601 format",
    },
    customSanitizer: {
      options: value => new Date(value),
    },
  },
  customRate: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "Custom rate must be provided",
    },
    isFloat: {
      bail: true,
      errorMessage: "Rate must be a decimal number",
    },
    customSanitizer: {
      options: value => {
        const rate = parseFloat(value);
        if (isNaN(rate) || rate < 0) {
          throw new Error("Invalid custom rate provided");
        }

        return Number(rate.toFixed(2));
      },
    },
  },
  roomsToSell: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "Custom availability must be provided",
    },
    isInt: {
      bail: true,
      errorMessage: "Custom availability must be an integer number",
    },
    customSanitizer: {
      options: value => {
        const roomsToSell = parseInt(value, 10);
        if (isNaN(roomsToSell) || roomsToSell < 0) {
          throw new Error("Invalid rooms to sell provided");
        }

        return roomsToSell;
      },
    },
  },
};

export const checkAvailabilitySchema = {
  from: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "From date is required",
    },
    isISO8601: {
      strict: true,
      errorMessage: "From date must be ISO 8601 format",
    },
  },
  to: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "To date is required",
    },
    isISO8601: {
      strict: true,
      errorMessage: "To date mus be ISO8601 format",
    },
  },
};
