export const roomTypeSchema = {
  description: {
    in: ["body"],
    trim: true,
    escape: true,
    notEmpty: {
      bail: true,
      errorMessage: "Description must not be empty",
    },
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Description must be between 1 and 255 characters",
    },
  },
  type: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "Type is required",
    },
    isIn: {
      options: [["private", "dorm"]],
      errorMessage: "room type must be private or dorm",
    },
  },
  gender: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "Gender is required",
    },
    isIn: {
      options: [["mixed", "female"]],
      errorMessage: "room type gender must be mixed or female",
    },
  },
  max_occupancy: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "Maximum occupancy is required",
    },
    isInt: {
      options: { min: 1 },
      bail: true,
      errorMessage: "Must be an integer greater than 0",
    },
  },
  inventory: {
    in: ["body"],
    trim: true,
    isInt: {
      options: { min: 1 },
      bail: true,
      errorMessage: "Must be an integer greater than 0",
    },
    notEmpty: {
      bail: true,
      errorMessage: "Inventory is required",
    },
  },
};

export const updateRoomTypeSchema = {
  description: {
    in: ["body"],
    trim: true,
    escape: true,
    notEmpty: {
      bail: true,
      errorMessage: "Description must not be empty",
    },
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Room type name maximum length is 100 characters",
    },
  },
  gender: {
    in: ["body"],
    trim: true,
    isIn: {
      options: [["mixed", "female"]],
      errorMessage: "room type gender must be mixed or female",
    },
  },
};
