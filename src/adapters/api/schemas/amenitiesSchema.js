export const amenitiesSchema = {
  amenities: {
    in: ["body"],
    isArray: {
      bail: true,
      errorMessage: "amenities is not a array",
    },
    custom: {
      options: values => {
        if (!Array.isArray(values)) throw new Error("Must be an array");
        if (values.length === 0) return false; // Allow empty arrays

        if (values.every(value => Number.isInteger(value))) {
          return true;
        }
        return false;
      },
      errorMessage: "Invalid amenities IDs",
    },
  },
};
