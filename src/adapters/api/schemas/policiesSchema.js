export const reservationPoliciesSchema = {
  min_length_stay: {
    in: ["body"],
    trim: true,
    isInt: {
      bail: true,
      options: { min: 0 },
      errorMessage: "Minimum length of stay must be greater or equals to zero",
    },
    toInt: true,
  },
  max_length_stay: {
    in: ["body"],
    trim: true,
    isInt: {
      bail: true,
      options: { min: 0 },
      errorMessage: "Maximum length of stay must be greater or equal to zero",
    },
    toInt: true,
  },
  min_advance_booking: {
    in: ["body"],
    trim: true,
    isInt: {
      bail: true,
      options: { min: 0 },
      errorMessage: "Minimum advance booking must be greater or equal to zero",
    },
    toInt: true,
  },
  check_in_from: {
    in: ["body"],
    trim: true,
    isTime: {
      bail: true,
      errorMessage: "Check-in from is not a valid TIME format",
    },
  },
  check_in_to: {
    in: ["body"],
    trim: true,
    isTime: {
      bail: true,
      errorMessage: "Check-in to is not a valid TIME format",
    },
  },
  check_out_until: {
    in: ["body"],
    trim: true,
    isTime: {
      bail: true,
      errorMessage: "Check-out until is not a valid TIME format",
    },
  },
  payment_methods_accepted: {
    paymentMethod: {
      in: ["body"],
      custom: {
        options: values => {
          if (!Array.isArray(values)) {
            throw new Error("Payment method should be an array");
          }
          const validPaymentMethods = ["bank_transfer", "cash", "debit_credit"];

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
  },
};

export const advancePaymentPoliciesSchema = {
  advance_payment_required: {
    in: ["body"],
    trim: true,
    isBoolean: {
      bail: true,
      errorMessage: "Advance payment required must be boolean",
    },
    toBoolean: true,
  },
  deposit_amount: {
    in: ["body"],
    trim: true,
    isFloat: {
      bail: true,
      options: { min: 0, max: 1 },
      errorMessage: "Deposit amount must be a float number between 0 and 1",
    },
    toFloat: true,
  },
};

export const cancellationPoliciesSchema = {
  days_before_arrival: {
    in: ["body"],
    trim: true,
    isInt: {
      bail: true,
      options: { min: 1 },
      errorMessage: "Day before arrival must be an integer greater than 0",
    },
    toInt: true,
  },
  amount_refund: {
    in: ["body"],
    trim: true,
    isFloat: {
      bail: true,
      options: { min: 0, max: 1 },
      errorMessage: "amount refund must be a float number between 0 and 1",
    },
    toFloat: true,
  },
};

export const childrenPoliciesSchema = {
  allow_children: {
    in: ["body"],
    isBoolean: {
      bail: true,
      errorMessage: "Allow children must be boolean",
    },
    toBoolean: true,
  },
  children_min_age: {
    in: ["body"],
    isInt: {
      bail: true,
      options: { min: 0 },
      errorMessage: "Minimum children age must be greater or equal to zero",
    },
    toInt: true,
  },
  minors_room_types: {
    in: ["body"],
    isIn: {
      options: [["all_rooms", "only_private", "only_dorms"]],
      errorMessage:
        "Minors room type must be one of all_rooms, only_private, or only_dorms",
    },
  },
  free_stay_age: {
    in: ["body"],
    isInt: {
      bail: true,
      options: { min: 0 },
      errorMessage: "Free stay age must be greater or equal to zero",
    },
    toInt: true,
  },
};

export const otherPoliciesSchema = {
  quiet_hours_from: {
    in: ["body"],
    trim: true,
    matches: {
      options: [/^([01]\d|2[0-3]):([0-5]\d)$/], // HH:mm format validation
      errorMessage: "Quiet hours from must be in HH:mm format",
    },
  },
  quiet_hours_to: {
    in: ["body"],
    trim: true,
    matches: {
      options: [/^([01]\d|2[0-3]):([0-5]\d)$/], // HH:mm format validation
      errorMessage: "Quiet hours to must be in HH:mm format",
    },
  },
  smoking_areas: {
    in: ["body"],
    isBoolean: {
      bail: true,
      errorMessage: "Smoking areas must be boolean",
    },
    toBoolean: true,
  },
  external_guest_allowed: {
    in: ["body"],
    isBoolean: {
      bail: true,
      errorMessage: "External guest allowed must be boolean",
    },
    toBoolean: true,
  },
  pets_allowed: {
    in: ["body"],
    isBoolean: {
      bail: true,
      errorMessage: "Pets allowed must be boolean",
    },
    toBoolean: true,
  },
};
