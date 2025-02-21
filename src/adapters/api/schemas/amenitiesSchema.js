export const amenitiesSchema = {
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
