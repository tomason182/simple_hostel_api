export const breakfastSchema = {
  is_served: {
    in: ["body"],
    exists: {
      bail: true,
      errorMessage: "is_served is required",
    },
    isBoolean: {
      bail: true,
      errorMessage: "is_served must be boolean.",
    },
  },
  is_included: {
    in: ["body"],
    optional: true,
    isBoolean: {
      bail: true,
      errorMessage: "is_included must be boolean.",
    },
  },
  price: {
    in: ["body"],
    optional: true,
    isFloat: {
      bail: true,
      errorMessage: "price must be a float number",
    },
    toFloat: true,
  },
};
