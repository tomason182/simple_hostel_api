require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("../src/utils/logger");
const passport = require("passport");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Disable console.log in production
if (process.env.NODE_ENV === "production") {
  console.log = function () {};
}

// Require errors middleware
const {
  notFound,
  errorLog,
  errorHandler,
} = require("./middleware/errorMiddleware");

// Define a stream object with a write function for morgan to use
const stream = {
  write: message => {
    logger.info(message.trim());
  },
};

const app = express();

const corsOptions = {
  origen:
    process.env.NODE_ENV === "production"
      ? ["https://simplehostel.net", "https://www.simplehostel.net"]
      : ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("combined", { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join(__dirname, "public")));

// Compress all responses
app.use(compression());

// Set up headers
app.use(helmet());

// Set rate limit
// Limit each IP to 100 request per window.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Use error middleware
app.use(notFound);
app.use(errorLog);
app.use(errorHandler);

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled rejection", reason);
});

module.exports = app;
