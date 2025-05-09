import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { logger } from "../src/utils/logger.js";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import Routes
import { createBookEngineRoutes } from "./adapters/api/routes/bookEngineRoutes.js";
import { createUserRoutes } from "./adapters/api/routes/userRoutes.js";
import { createPropertyRoutes } from "./adapters/api/routes/propertyRoutes.js";
import { createRoomTypeRoutes } from "./adapters/api/routes/roomTypeRoutes.js";
import { createGuestRoutes } from "./adapters/api/routes/guestRoutes.js";
import { createRatesAndAvailabilityRoutes } from "./adapters/api/routes/ratesAndAvailabilityRoutes.js";
import { createReservationRoutes } from "./adapters/api/routes/reservationRoutes.js";
import { createImagesRoutes } from "./adapters/api/routes/imagesRoutes.js";
import { createTaxesRoutes } from "./adapters/api/routes/taxesAndFeesRoutes.js";
import { createBreakfastAndMealsRoutes } from "./adapters/api/routes/breakfastAndMealsRoutes.js";

// Disable console.log in production
if (process.env.NODE_ENV === "production") {
  console.log = function () {};
}

// Require errors middleware
import {
  notFound,
  errorLog,
  errorHandler,
} from "./middleware/errorMiddleware.js";
import { fetchDataProvider } from "./adapters/api/routes/dataProviderRoutes.js";

// Define a stream object with a write function for morgan to use
const stream = {
  write: message => {
    logger.info(message.trim());
  },
};

export async function createApp(services) {
  const app = express();

  const corsOptions = {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://simplehostel.net", "https://www.simplehostel.net"]
        : [
            "http://127.0.0.1:5173",
            "http://localhost:5173",
            "http://127.0.0.1:5174",
            "http://localhost:5174",
          ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(cors(corsOptions));
  app.use(morgan("combined", { stream }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.JWT_SECRET));

  // Compress all responses
  app.use(compression());

  // Set up headers
  app.use(helmet());

  // Set rate limit
  // Limit each IP to 100 request per window.
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "To many requests, please try again later",
    headers: true,
  });

  app.use(limiter);

  // Use routes
  app.use("/api/v2/book-engine", createBookEngineRoutes(services));
  app.use("/api/v2/users", createUserRoutes(services));
  app.use("/api/v2/properties", createPropertyRoutes(services));
  app.use("/api/v2/room-types", createRoomTypeRoutes(services));
  app.use("/api/v2/guests", createGuestRoutes(services));
  app.use(
    "/api/v2/rates-and-availability",
    createRatesAndAvailabilityRoutes(services)
  );
  app.use("/api/v2/reservations", createReservationRoutes(services));
  app.use("/api/v2/data-provider", fetchDataProvider(services));
  app.use("/api/v2/images", createImagesRoutes(services));
  app.use("/api/v2/taxes", createTaxesRoutes(services));
  app.use(
    "/api/v2/breakfast-and-meals",
    createBreakfastAndMealsRoutes(services)
  );

  // Static files
  app.use(
    "/images",
    (req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(path.join("public", "uploads"))
  );

  // Use error middleware
  app.use(notFound);
  app.use(errorLog);
  app.use(errorHandler);

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled rejection", reason);
  });

  return app;
}
