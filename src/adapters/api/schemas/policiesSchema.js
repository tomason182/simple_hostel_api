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
    in: ["body"],
    isArray: {
      bail: true,
      errorMessage: "Payment methods must be an array",
    },
    custom: {
      options: values => {
        if (
          !values.every(
            element =>
              typeof element === "object" &&
              element !== null &&
              Number.isInteger(element.id)
          )
        ) {
          throw new Error(
            "Each payment method must be an object with a valid integer ID"
          );
        }

        return true;

        return true;
      },
    },
  },
  online_payment_methods_accepted: {
    in: ["body"],
    isArray: {
      bail: true,
      errorMessage: "Online payment methods must be an array",
    },
    custom: {
      options: values => {
        if (
          !values.every(
            element =>
              typeof element === "object" &&
              element !== null &&
              Number.isInteger(element.id)
          )
        ) {
          throw new Error(
            "Each payment method must be an object with a valid integer ID"
          );
        }

        return true;
      },
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
  cancellation_policies: {
    in: ["body"],
    isArray: {
      bail: true,
      errorMessage: "Cancellation policies must be an array",
    },
    custom: {
      options: policies => {
        for (const policy of policies) {
          if (typeof policy !== "object")
            throw new Error("Policies must contains objects");

          if (
            !("days_before_arrival" in policy) ||
            !("amount_refund" in policy)
          )
            throw new Error("Invalid Object keys");

          if (
            !Number.isInteger(policy.days_before_arrival) ||
            policy.days_before_arrival <= 0
          )
            throw new Error(
              "Days before arrival must be an integer greater than zero"
            );

          if (
            typeof policy.amount_refund !== "number" ||
            policy.amount_refund < 0 ||
            policy.amount_refund > 1
          ) {
            throw new Error("Amount refund must be a number between 0 and 1");
          }

          return true;
        }
      },
    },
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
  quite_hours_from: {
    in: ["body"],
    trim: true,
    matches: {
      options: [/^([01]\d|2[0-3]):([0-5]\d)$/], // HH:mm format validation
      errorMessage: "Quiet hours from must be in HH:mm format",
    },
  },
  quite_hours_to: {
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
