import "dotenv/config";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "../src/utils/logger.js";
import passport from "passport";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import all necessary routes
import { userRoutes } from "./adapters/api/user.routes.js";

// Import adapter repositories
import { MySQLUserRepository } from "./adapters/db/mysql/MySQLUserRepository.js";
import { MySQLPropertyRepository } from "./adapters/db/mysql/MySQLPropertyRepository.js";
import { MySQLTransactionManager } from "./adapters/db/mysql/MySQLTransactionManager.js";
import { MySQLAccessControlRepository } from "./adapters/db/mysql/MySQLAccessControlRepository.js";

// Import core services
import { propertyService } from "./core/PropertyService.js";
import { UserService } from "./core/UserService.js";
import { UserCompositeService } from "./core/UserCompositeService";

// Disable console.log in production
if (process.env.NODE_ENV === "production") {
  console.log = function () {};
}

// Get MySQL connection
import { mysqlPool } from "./adapters/config/mysql_config";

// Initialize adapters

// Require errors middleware
import { notFound, errorLog, errorHandler } from "./middleware/errorMiddleware";

// Define a stream object with a write function for morgan to use
const stream = {
  write: message => {
    logger.info(message.trim());
  },
};

export const app = express();

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
