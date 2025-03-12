import { countryCodes } from "../../../utils/country_codes.js";

export const propertySchema = {
  propertyName: {
    in: ["body"],
    trim: true,
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 255,
      },
      errorMessage: "Property name maximum length is 255 characters",
    },
  },
  street: {
    in: ["body"],
    optional: true,
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
  city: {
    in: ["body"],
    optional: true,
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
  postalCode: {
    in: ["body"],
    optional: true,
    isPostalCode: {
      options: "any",
      errorMessage: "Invalid postal code",
    },
  },
  countryCode: {
    in: ["body"],
    optional: true,
    isISO31661Alpha2: {
      errorMessage: "Invalid country code",
    },
  },
  phoneNumber: {
    in: ["body"],
    optional: true,
    isMobilePhone: {
      options: "any",
      errorMessage: "Invalid phone number",
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
  baseCurrency: {
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

export const propertyPoliciesSchema = {
  paymentMethod: {
    in: ["body"],
    custom: {
      options: values => {
        if (!Array.isArray(values)) {
          throw new Error("Payment method should be an array");
        }
        const validPaymentMethods = [
          "bank_transfer",
          "cash",
          "debit_card",
          "credit_card",
        ];

        const invalidMethods = values.filter(
          value => !validPaymentMethods.includes(value)
        );

        if (invalidMethods.length > 0) {
          throw new Error("Invalid payment method found");
        }
        return true;
      },
    },
    errorMessage: "Invalid payment methods. Please review your inputs.",
  },
  checkIn: {
    in: ["body"],
    isObject: {
      bail: true,
      options: {
        strict: true,
      },
    },
    custom: {
      options: values => {
        // Ensure values is an object
        if (typeof values !== "object" || values === null) {
          throw new Error("Check in must be a valid object");
        }

        // Validate the keys and values
        const validKeys = ["from", "to"];
        for (const [key, value] of Object.entries(values)) {
          if (!validKeys.includes(key)) {
            throw new Error(
              "Invalid key provided in check in object. Allowed keys are from and to"
            );
          }
          // Check if the value is a valid time format (HH:mm)
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          if (!timeRegex.test(value)) {
            throw new Error("Invalid time format. Use HH:mm format");
          }
        }
        return true;
      },
      errorMessage:
        "Check in must contains a valid form and to keys with time values in HH:mm format",
    },
  },
};

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

export const propertyInfoSchema = {
  alpha_2_code: {
    in: ["body"],
    trim: true,
    isISO31661Alpha2: {
      strict: true,
      errorMessage: "Invalid country ISO 31661 code",
    },
  },
  street: {
    in: ["body"],
    optional: true,
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
  city: {
    in: ["body"],
    optional: true,
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
    optional: true,
    isPostalCode: {
      options: "any",
      errorMessage: "Invalid postal code",
    },
  },
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
