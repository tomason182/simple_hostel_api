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
    custom: {
      options: value => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid start date provided");
        }

        return date.toISOString();
      },
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
    custom: {
      options: value => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid start date provided");
        }

        return date.toISOString();
      },
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
    toFloat: true,
    custom: {
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
    toInt: true,
    custom: {
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
