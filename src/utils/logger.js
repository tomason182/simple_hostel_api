import { winston } from "winston";
import { path } from "path";

const backendLogDir = path.join(__dirname, "logs/hostel_api");

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(backendLogDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(backendLogDir, "combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
