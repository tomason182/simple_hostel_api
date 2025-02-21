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
      errorMessage: "Description must be between 1 and 100 characters",
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
  basic_amenities: {
    in: ["body"],
    isArray: {
      bail: true,
      errorMessage: "amenities is not a array",
    },
    custom: {
      options: value => {
        if (!Array.isArray(value)) throw new Error("Must be an array");
        if (value.length === 0) return true; // Allow empty arrays
        const allowedValues = [
          "personal_lockers",
          "bedside_shelf",
          "reading_light",
          "power_outlet",
          "good_ventilation",
          "free_wifi",
        ];
        for (const item of value) {
          if (!allowedValues.includes(item)) {
            throw new Error(`The value '${item}' is not allowed.`);
          }
        }
        return true;
      },
    },
  },
  comfort_amenities: {
    in: ["body"],
    isArray: {
      bail: true,
      errorMessage: "amenities is not a array",
    },
    custom: {
      options: value => {
        if (!Array.isArray(value)) throw new Error("Must be an array");
        if (value.length === 0) return true; // Allow empty arrays
        const allowedValues = [
          "air_conditioning",
          "heating",
          "hangers",
          "clothes_storage",
          "laundry_basket",
        ];
        for (const item of value) {
          if (!allowedValues.includes(item)) {
            throw new Error(`The value '${item}' is not allowed.`);
          }
        }
        return true;
      },
    },
  },
  hygiene_and_extras_amenities: {
    in: ["body"],
    isArray: {
      bail: true,
      errorMessage: "Amenities is not an array",
    },
    custom: {
      options: value => {
        if (!Array.isArray(value)) throw new Error("Must be an array");
        if (value.length === 0) return true; // Allow empty arrays
        const allowedValues = [
          "ensuite_bathroom",
          "shared_bathroom",
          "private_bathroom",
          "towels",
          "linens",
          "soap_and_shampoo",
          "hairdryer",
          "trash_bin",
        ];
        for (const item of value) {
          if (!allowedValues.includes(item)) {
            throw new Error(`The value '${item}' is not allowed.`);
          }
        }
        return true;
      },
    },
  },
  additional_amenities: {
    in: ["body"],
    isArray: {
      bail: true,
      errorMessage: "Amenities is not an array",
    },
    custom: {
      options: value => {
        if (!Array.isArray(value)) throw new Error("Must be an array");
        if (value.length === 0) return true; // Allow empty arrays
        const allowedValues = [
          "fridge",
          "mini_fridge",
          "safe_box",
          "tv",
          "sound_proofing",
        ];
        for (const item of value) {
          if (!allowedValues.includes(item)) {
            throw new Error(`The value '${item}' is not allowed.`);
          }
        }
        return true;
      },
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
  base_rate: {
    in: ["body"],
    trim: true,
    isFloat: {
      bail: true,
      errorMessage: "Invalid data type. Must be decimal",
    },
    notEmpty: {
      bail: true,
      errorMessage: "The base rate is required",
    },
  },
  currency: {
    in: ["body"],
    trim: true,
    escape: true,
    notEmpty: {
      bail: true,
      errorMessage: "The currency (field) must not be empty",
    },
  },
  amenities: {
    in: ["body"],
    trim: true,
    escape: true,
    isArray: {
      bail: true,
      options: { min: 0, max: 10 },
      errorMessage: "amenities is not a array",
    },
    custom: {
      options: value => {
        const amenitiesList = [
          "bathroom",
          "shower",
          "breakfast",
          "towels",
          "bedding",
          "heating",
          "air-conditioning",
          "free-wifi",
          "tv",
          "locker",
        ];
        for (let i = 0; i < value.length; i++) {
          if (!amenitiesList.includes(value[i])) {
            throw new Error(`The value '${value[i]}' is not allowed.`);
          }
        }
        return true;
      },
    },
  },
};
