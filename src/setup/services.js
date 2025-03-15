// Import Import MySQL pool
import { mysqlConnect } from "../adapters/config/mysql_config.js";

// REPOSITORIES
import { MySQLUserRepository } from "../adapters/db/mysql/MySQLUserRepository.js";
import { MySQLPropertyRepository } from "../adapters/db/mysql/MySQLPropertyRepository.js";
import { MySQLRoomTypeRepository } from "../adapters/db/mysql/MySQLRoomTypeRepository.js";
import { MySQLAccessControlRepository } from "../adapters/db/mysql/MySQLAccessControlRepository.js";
import { MySQLGuestRepository } from "../adapters/db/mysql/MySQLGuestRepository.js";
import { MySQLReservationRepository } from "../adapters/db/mysql/MySQLReservationRepository.js";
import { MySQLRatesAndAvailabilityRepository } from "../adapters/db/mysql/MySQLRatesAndAvailabilityRepository.js";

// SERVICES
import { AvailabilityService } from "../core/AvailabilityService.js";
import { GuestService } from "../core/GuestService.js";
import { PropertyService } from "../core/PropertyService.js";
import { ReservationService } from "../core/ReservationService.js";
import { ReservationCompositeService } from "../core/ReservationCompositeService.js";
import { UserService } from "../core/UserService.js";
import { UserCompositeService } from "../core/UserCompositeService.js";
import { RatesAndAvailabilityService } from "../core/RatesAndAvailabilityService.js";
import { RoomTypeService } from "../core/RoomTypeService.js";

// PORTS
import { AvailabilityTransactionManagerPort } from "../core/ports/AvailabilityTransactionManagerPort.js";
import { UserInputPort } from "../core/ports/UserInputPort.js";
import { UserOutputPort } from "../core/ports/UserOutputPort.js";
import { PropertyInputPort } from "../core/ports/PropertyInputPort.js";
import { PropertyOutputPort } from "../core/ports/PropertyOutputPort.js";
import { RoomTypeInputPort } from "../core/ports/RoomTypeInputPort.js";
import { RoomTypeOutputPort } from "../core/ports/RoomTypeOutputPort.js";
import { GuestInputPort } from "../core/ports/GuestInputPort.js";
import { GuestOutputPort } from "../core/ports/GuestOutputPort.js";
import { RatesAndAvailabilityInputPort } from "../core/ports/RatesAndAvailabilityInputPort.js";
import { RatesAndAvailabilityOutputPort } from "../core/ports/RatesAndAvailabilityOutputPort.js";
import { ReservationInputPort } from "../core/ports/ReservationInputPort.js";
import { ReservationOutputPort } from "../core/ports/ReservationOutputPort.js";
import { ReservationTransactionManagerPort } from "../core/ports/ReservationTransactionManagerPort.js";
import { UserTransactionManagerPort } from "../core/ports/UserTransactionManagerPort.js";

// Import nodemailer email notification service
import { createEmailNotification } from "../adapters/config/nodemailerConfig.js";
import { createTokenService } from "../adapters/config/tokenConfig.js";

// import data provider
import { DataProviderService } from "../adapters/dataProvider/DataProviderService.js";

// Import controllers
import { UserController } from "../adapters/api/controllers/UserController.js";
import { PropertyController } from "../adapters/api/controllers/PropertyController.js";
import { RoomTypeController } from "../adapters/api/controllers/RoomTypeController.js";
import { GuestController } from "../adapters/api/controllers/GuestController.js";
import { RatesAndAvailabilityController } from "../adapters/api/controllers/RatesAndAvailabilityController.js";
import { ReservationController } from "../adapters/api/controllers/ReservationController.js";

export default function initializeServices() {
  const mysqlPool = mysqlConnect.getPool();

  // INITIALIZE REPOSITORIES.
  const userRepository = new MySQLUserRepository(mysqlPool);
  const propertyRepository = new MySQLPropertyRepository(mysqlPool);
  const roomTypeRepository = new MySQLRoomTypeRepository(mysqlPool);
  const accessControlService = new MySQLAccessControlRepository(mysqlPool);
  const guestRepository = new MySQLGuestRepository(mysqlPool);
  const reservationRepository = new MySQLReservationRepository(mysqlPool);
  const ratesAndAvailabilityRepository =
    new MySQLRatesAndAvailabilityRepository(mysqlPool);

  // INITIALIZE EXTRA SERVICES.
  const emailService = createEmailNotification();
  const tokenService = createTokenService();

  const dataProviderService = new DataProviderService(mysqlPool);

  const availabilityTransactionManagerPort =
    new AvailabilityTransactionManagerPort(
      ratesAndAvailabilityRepository,
      roomTypeRepository,
      reservationRepository
    );

  // Initialize availability service
  const availabilityService = new AvailabilityService(
    availabilityTransactionManagerPort
  );

  // INITIALIZE OUTPUT PORT.
  const userOutputPort = new UserOutputPort(
    userRepository,
    accessControlService,
    tokenService,
    emailService
  );
  const propertyOutputPort = new PropertyOutputPort(propertyRepository);
  const roomTypeOutputPort = new RoomTypeOutputPort(roomTypeRepository);
  const guestOutputPort = new GuestOutputPort(
    guestRepository,
    propertyRepository
  );
  const ratesAndAvailabilityOutputPort = new RatesAndAvailabilityOutputPort(
    ratesAndAvailabilityRepository,
    roomTypeRepository,
    availabilityService
  );
  const reservationOutputPort = new ReservationOutputPort(
    reservationRepository,
    availabilityService,
    emailService
  );

  // Initialize the core services
  const propertyService = new PropertyService(propertyOutputPort);
  const userService = new UserService(userOutputPort);
  const guestService = new GuestService(guestOutputPort);
  const ratesAndAvailabilityService = new RatesAndAvailabilityService(
    ratesAndAvailabilityOutputPort
  );
  const reservationService = new ReservationService(reservationOutputPort);
  const roomTypeService = new RoomTypeService(roomTypeOutputPort);

  // Initialize transaction manager port

  const userTransactionManagerPort = new UserTransactionManagerPort(
    userService,
    propertyService,
    userRepository,
    propertyRepository,
    accessControlService,
    tokenService,
    emailService
  );

  const reservationTransactionManagerPort =
    new ReservationTransactionManagerPort(
      reservationRepository,
      guestRepository,
      ratesAndAvailabilityRepository,
      availabilityService,
      emailService
    );

  // Initialize composite services
  const userCompositeService = new UserCompositeService(
    mysqlPool,
    userTransactionManagerPort
  );

  const reservationCompositeService = new ReservationCompositeService(
    reservationTransactionManagerPort,
    mysqlPool
  );

  // Initialize input ports
  const userInputPort = new UserInputPort(
    userService,
    userCompositeService,
    emailService,
    tokenService
  );
  const propertyInputPort = new PropertyInputPort(propertyService);
  const roomTypeInputPort = new RoomTypeInputPort(roomTypeService);
  const guestInputPort = new GuestInputPort(guestService);
  const ratesAndAvailabilityInputPort = new RatesAndAvailabilityInputPort(
    ratesAndAvailabilityService,
    availabilityService
  );

  const reservationInputPort = new ReservationInputPort(
    reservationService,
    reservationCompositeService,
    availabilityService
  );

  // Initialize controllers
  const userController = new UserController(userInputPort);
  const propertyController = new PropertyController(propertyInputPort);
  const roomTypeController = new RoomTypeController(roomTypeInputPort);
  const guestController = new GuestController(guestInputPort);
  const ratesAndAvailabilityController = new RatesAndAvailabilityController(
    ratesAndAvailabilityInputPort
  );
  const reservationController = new ReservationController(reservationInputPort);

  return {
    userController,
    propertyController,
    guestController,
    ratesAndAvailabilityController,
    reservationController,
    roomTypeController,
    dataProviderService,
  };
}
