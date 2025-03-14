export const reservationPoliciesSchema = {
  min_length_of_stay: {
    in: ["body"],
    trim: true,
    isInt: {
      bail: true,
      option: { min: 0 },
      errorMessage: "Minimum length of stay must be greater or equals to zero",
    },
    toInt: true,
  },
  max_length_of_stay: {
    in: ["body"],
    trim: true,
    isInt: {
      bail: true,
      option: { min: 0 },
      errorMessage: "Maximum length of stay must be greater or equal to zero",
    },
    toInt: true,
  },
  min_advance_booking: {
    in: ["body"],
    trim: true,
    isInt: {
      bail: true,
      option: { min: 0 },
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
    trim: true,
    isIn: {
      options: [["credit_debit", "cash", "bank_transfer"]],
      errorMessage:
        "Payment method must be one of credit_debit,cash or bank_transfer",
    },
  },
  online_payment_methods_accepted: {
    in: ["body"],
    trim: true,
    isIn: {
      options: [["paypal", "mercado_pago", "bitcoin"]],
      errorMessage:
        "Online Payment method must be one of paypal, mercado_pago or bitcoin",
    },
  },
};
