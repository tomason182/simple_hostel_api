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
          errorMessage: "Room type name maximum length is 100 characters",
        },
    },
    type: {
        in: ["body"],
        trim: true,
        escape: true,
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
        isIn: {
          options: [["mixed", "female"]],
          errorMessage: "room type gender must be mixed or female",
        },
    },
    max_occupancy: {
        in: ["body"],
        trim: true,
        isInt: {
          bail: true,
          errorMessage: "Invalid data type. Must be integer",
        },
        notEmpty: {
          bail: true,
          errorMessage: "Maximum occupancy is required",
        },
    },
    inventory: {
        in: ["body"],
        trim: true,
        isInt: {
          bail: true,
          errorMessage: "Invalid data type. Must be integer",
        },
        notEmpty: {
          bail: true,
          errorMessage: "Inventory is required",
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
          options: {min: 0, max: 10},
          errorMessage: "amenities is not a array",
        },
        custom: {
            options: value => {
            const amenitiesList = ["bathroom", "shower", "breakfast", "towels", "bedding", "heating", "air-conditioning", "free-wifi", "tv", "locker"];
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
          options: {min: 0, max: 10},
          errorMessage: "amenities is not a array",
        },
        custom: {
            options: value => {
            const amenitiesList = ["bathroom", "shower", "breakfast", "towels", "bedding", "heating", "air-conditioning", "free-wifi", "tv", "locker"];
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
