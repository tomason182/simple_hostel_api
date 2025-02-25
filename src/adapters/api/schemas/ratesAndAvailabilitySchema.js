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
  customAvailability: {
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
        const availability = parseInt(value, 10);
        if (isNaN(availability) || availability < 0) {
          throw new Error("Invalid availability provided");
        }

        return availability;
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
