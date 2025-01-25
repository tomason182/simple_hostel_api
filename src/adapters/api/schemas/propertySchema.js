export const propertySchema = {
  property_name: {
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
  postal_code: {
    in: ["body"],
    optional: true,
    isPostalCode: {
      options: "any",
      errorMessage: "Invalid postal code",
    },
  },
  country_code: {
    in: ["body"],
    optional: true,
    isISO31661Alpha2: {
      errorMessage: "Invalid country code",
    },
  },
  phone_number: {
    in: ["body"],
    optional: true,
    isMobilePhone: {
      options: "any",
      errorMessage: "Invalid phone number",
    },
  },
  email: {
    in: ["body"],
    options: true,
    isEmail: {
      errorMessage: "Invalid email address",
    },
    normalizeEmail: true,
  },
};

export const propertyPoliciesSchema = {
  payment_method: {
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
  check_in: {
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
