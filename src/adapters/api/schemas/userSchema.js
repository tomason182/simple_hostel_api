export const userRegistrationSchema = {
  username: {
    in: ["body"],
    trim: true,
    isEmail: {
      bail: true,
      errorMessage: "username is not a valid email",
    },
    normalizeEmail: true,
  },
  password: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: 14,
        minLowerCase: 4,
        minUpperCase: 2,
        minNumbers: 2,
        minSymbols: 2,
      },
    },
    custom: {
      options: value => {
        if (/\s/.test(value)) {
          throw new Error("Password must not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password must contain at lease 14 characters, 4 lowercase, 2 uppercase, 2 numbers and 2 symbols",
  },
  firstName: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "First name must not be empty",
    },
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage:
        "First name is required and maximum length is 100 characters",
    },
  },
  lastName: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Last name maximum length is 100 characters",
    },
  },
};

export const userLoginSchema = {
  username: {
    in: ["body"],
    isEmail: {
      bail: true,
      errorMessage: "username is not a valid email",
    },
    trim: true,
    normalizeEmail: true,
  },
  password: {
    in: ["body"],
    trim: true,
  },
};

export const userUpdateSchema = {
  first_name: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "First name must not be empty",
    },
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 70,
      },
      errorMessage:
        "First name is required and maximum length is 70 characters",
    },
  },
  last_name: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Last name maximum length is 100 characters",
    },
  },
};

export const userEditSchema = {
  id: {
    in: ["body"],
    trim: true,
    escape: true,
    isInt: {
      bail: true,
      options: { min: -1 },
    },
    toInt: true,
  },
  username: {
    in: ["body"],
    trim: true,
    isEmail: {
      bail: true,
      errorMessage: "Username is not a valid email",
    },
    normalizeEmail: true,
  },
  first_name: {
    in: ["body"],
    notEmpty: {
      bail: true,
      errorMessage: "First name must not be empty",
    },
    trim: true,
    escape: true,
  },
  last_name: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
  },
  role: {
    in: ["body"],
    trim: true,
    escape: true,
    isIn: {
      options: [["admin", "manager", "employee"]],
      errorMessage:
        "Role must be one of the followings: admin, manager, employee",
    },
  },
};

export const userChangePassSchema = {
  currentPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: 14,
        minLowerCase: 4,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 2,
      },
    },
    custom: {
      options: value => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password should contain at least 14 characters, 4 lowercase, 2 uppercase, 2 numbers and 2 symbols ",
  },
  newPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: 14,
        minLowerCase: 4,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 2,
      },
    },
    custom: {
      options: value => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password should contain at least 14 characters, 4 lowercase, 2 uppercase, 2 numbers and 2 symbols ",
  },
  repeatNewPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: 14,
        minLowerCase: 4,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 2,
      },
    },
    custom: {
      options: value => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password should contain at least 14 characters, 4 lowercase, 2 uppercase, 2 numbers and 2 symbols",
  },
};

export const usernameSchema = {
  username: {
    in: ["body"],
    isEmail: {
      bail: true,
      errorMessage: "username is not a valid email",
    },
    trim: true,
    normalizeEmail: true,
  },
};

export const userResetPassSchema = {
  newPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: 14,
        minLowerCase: 4,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 2,
      },
    },
    custom: {
      options: value => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password should contain at least 14 characters, 4 lowercase, 2 uppercase, 2 numbers and 2 symbols ",
  },
  repeatNewPassword: {
    in: ["body"],
    isStrongPassword: {
      options: {
        minLength: 14,
        minLowerCase: 4,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 2,
      },
    },
    custom: {
      options: value => {
        if (/\s/.test(value)) {
          throw new Error("Password should not contain white spaces");
        }
        return true;
      },
    },
    errorMessage:
      "Password should contain at least 14 characters, 4 lowercase, 2 uppercase, 2 numbers and 2 symbols ",
  },
};
