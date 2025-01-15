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
  },
  lastName: {
    in: ["body"],
    optional: true,
    trim: true,
    escape: true,
  },
};
