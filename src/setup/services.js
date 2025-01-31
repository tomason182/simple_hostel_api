// Import Import MySQL pool
import { mysqlConnect } from "../adapters/config/mysql_config.js";

// REPOSITORIES
import { MySQLUserRepository } from "../adapters/db/mysql/MySQLUserRepository.js";
import { MySQLPropertyRepository } from "../adapters/db/mysql/MySQLPropertyRepository.js";
import { MySQLAccessControlRepository } from "../adapters/db/mysql/MySQLAccessControlRepository.js";
import { MySQLGuestRepository } from "../adapters/db/mysql/MySQLGuestRepository.js";
import { MySQLReservationRepository } from "../adapters/db/mysql/MySQLReservationRepository.js";
import { MySQLRatesAndAvailabilityRepository } from "../adapters/db/mysql/MySQLRatesAndAvailabilityRepository.js";

// SERVICES
import { GuestService } from "../core/GuestService.js";
import { PropertyService } from "../core/PropertyService.js";
import { ReservationService } from "../core/ReservationService.js";
import { UserService } from "../core/UserService.js";
import { UserCompositeService } from "../core/UserCompositeService.js";
import { RateAndAvailabilityService } from "../core/RatesAndAvailabilityService.js";

// PORTS
import { UserInputPort } from "../core/ports/UserInputPort.js";
import { UserOutputPort } from "../core/ports/UserOutputPort.js";
import { PropertyInputPort } from "../core/ports/PropertyInputPort.js";
import { PropertyOutputPort } from "../core/ports/PropertyOutputPort.js";
import { GuestInputPort } from "../core/ports/GuestInputPort.js";
import { GuestOutputPort } from "../core/ports/GuestOutputPort.js";
import { RatesAndAvailabilityInputPort } from "../core/ports/RatesAndAvailabilityInputPort.js";
import { RatesAndAvailabilityOutputPort } from "../core/ports/RatesAndAvailabilityOutputPort.js";
import { ReservationInputPort } from "../core/ports/ReservationInputPort.js";
import { ReservationOutputPort } from "../core/ports/ReservationOutputPort.js";
import { UserTransactionManagerPort } from "../core/ports/UserTransactionManagerPort.js";

// Import nodemailer email notification service
import { createEmailNotification } from "../adapters/config/nodemailerConfig.js";
import { createTokenService } from "../adapters/config/tokenConfig.js";

// Import controllers
import { UserController } from "../adapters/api/controllers/UserController.js";
import { PropertyController } from "../adapters/api/controllers/PropertyController.js";
import { GuestController } from "../adapters/api/controllers/GuestController.js";
import {
  ratesAndAvailabilityController,
  ratesAndAvailabilityController,
} from "../adapters/api/controllers/RatesAndAvailabilityController.js";
import { ReservationController } from "../adapters/api/controllers/ReservationController.js";

export default function initializeServices() {
  const mysqlPool = mysqlConnect.getPool();

  // INITIALIZE REPOSITORIES.
  const userRepository = new MySQLUserRepository(mysqlPool);
  const propertyRepository = new MySQLPropertyRepository(mysqlPool);
  const accessControlService = new MySQLAccessControlRepository(mysqlPool);
  const guestRepository = new MySQLGuestRepository(mysqlPool);
  const reservationRepository = new MySQLReservationRepository(mysqlPool);
  const ratesAndAvailabilityRepository =
    new MySQLRatesAndAvailabilityRepository(mysqlPool);

  // INITIALIZE EXTRA SERVICES.
  const emailService = createEmailNotification();
  const tokenService = createTokenService();

  // INITIALIZE OUTPUT PORT.
  const userOutputPort = new UserOutputPort(
    userRepository,
    accessControlService,
    tokenService,
    emailService
  );
  const propertyOutputPort = new PropertyOutputPort(propertyRepository);
  const guestOutputPort = new GuestOutputPort(
    guestRepository,
    propertyRepository
  );
  const ratesAndAvailabilityOutputPort = new RatesAndAvailabilityOutputPort(
    ratesAndAvailabilityRepository
  );
  const reservationOutputPort = new ReservationOutputPort(
    reservationRepository
  );

  // Initialize the core services
  const propertyService = new PropertyService(propertyOutputPort, mysqlPool);
  const userService = new UserService(userOutputPort);
  const guestService = new GuestService(guestOutputPort);
  const ratesAndAvailabilityService = new ratesAndAvailabilityService(
    ratesAndAvailabilityOutputPort
  );
  const reservationService = new ReservationService(reservationOutputPort);

  // Initialize transaction manager ports
  const userTransactionManagerPort = new UserTransactionManagerPort(
    userService,
    propertyService,
    userRepository,
    propertyRepository,
    accessControlService,
    tokenService,
    emailService
  );

  // Initialize composite services
  const userCompositeService = new UserCompositeService(
    mysqlPool,
    userTransactionManagerPort
  );

  // Initialize input ports
  const userInputPort = new UserInputPort(
    userService,
    userCompositeService,
    emailService,
    tokenService
  );
  const propertyInputPort = new PropertyInputPort(propertyService);
  const guestInputPort = new GuestInputPort(guestService);
  const ratesAndAvailabilityInputPort = new RatesAndAvailabilityInputPort(
    ratesAndAvailabilityService
  );

  const reservationInputPort = new ReservationInputPort(reservationService);

  // Initialize controllers
  const userController = new UserController(userInputPort);
  const propertyController = new PropertyController(propertyInputPort);
  const guestController = new GuestController(guestInputPort);
  const ratesAndAvailabilityController = new ratesAndAvailabilityController(
    ratesAndAvailabilityInputPort
  );
  const reservationController = new ReservationController(reservationInputPort);

  return {
    userController,
    propertyController,
    guestController,
    ratesAndAvailabilityController,
    reservationController,
  };
}
