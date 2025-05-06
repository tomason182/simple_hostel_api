export const taxesAndFeesSchema = {
  name: {
    in: ["body"],
    trim: true,
    escape: true,
    notEmpty: {
      bail: true,
      errorMessage: "Tax name can not be empty",
    },
    isLength: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: "Tax name is required and maximum length is 50 characters",
    },
  },
  type: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Tax type must not be empty",
    },
    isIn: {
      options: [["fixed", "percentage"]],
      errorMessage: "Tax type must be one of fixed or percentage",
    },
  },
  value: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "Tax value must not be empty",
    },
    isFloat: {
      bail: true,
      options: { min: 0 },
      errorMessage: "Tax value must be a float number",
    },
    toFloat: true,
  },
  per: {
    in: ["body"],
    optional: true,
    isIn: {
      options: [["booking", "night", "guest"]],
    },
    errorMessage: "Tax per must be one of booking, night or guest",
  },
};
