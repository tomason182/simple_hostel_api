import { countryCodes } from "../../../utils/country_codes.js";

export const contactDetailsSchema = {
  phoneNumber: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Phone number must not be empty",
    },
    isMobilePhone: {
      options: "any",
      errorMessage: "Invalid phone number",
    },
  },
  countryCode: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Country code must be provided",
    },
    custom: {
      options: value => {
        return countryCodes.includes(value);
      },
    },
  },
  email: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Email must not be empty",
    },
    isEmail: {
      bail: true,
      errorMessage: "Invalid email address",
    },
    normalizeEmail: true,
  },
};

export const currenciesSchema = {
  base_currency: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Currency must not be empty",
    },
    isISO4217: {
      bail: true,
      errorMessage: "Currency must be ISO 4217",
    },
  },
  payment_currency: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Currency must not be empty",
    },
    isISO4217: {
      bail: true,
      errorMessage: "Currency must be ISO 4217",
    },
  },
};

export const locationSchema = {
  alpha_2_code: {
    in: ["body"],
    trim: true,
    exists: {
      bail: true,
      errorMessage: "alpha_2_code must be provided",
    },
    isISO31661Alpha2: {
      strict: true,
      errorMessage: "Invalid country ISO 31661 code",
    },
  },
  country: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 56,
      },
      errorMessage: "Country maximum length is 56",
    },
  },
  state: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "State maximum length is 255",
    },
  },
  street: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "Street maximum length is 100 characters",
    },
  },
  house_number: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 10,
      },
      errorMessage: "House number maximum length is 10 characters",
    },
  },
  city: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMonitor: "City name maximum length is 100 characters",
    },
  },
  postal_code: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "Postal code must be provided",
    },
    isPostalCode: {
      options: "any",
      errorMessage: "Invalid postal code",
    },
  },
  lat: {
    in: ["body"],
    isDecimal: {
      options: {
        force_decimal: false,
        decimal_digits: "1,6",
      },
    },
    errorMessage: "latitude must be a decimal number up to 6 digits",
    toFloat: true,
  },
  lon: {
    in: ["body"],
    isDecimal: {
      options: {
        force_decimal: false,
        decimal_digits: "1,6",
      },
    },
    errorMessage: "longitude must be a decimal number up t 6 digits",
  },
  osm_id: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 20,
      },
    },
  },
};
