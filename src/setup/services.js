// Import Import MySQL pool
import { mysqlConnect } from "../adapters/config/mysql_config.js";

// REPOSITORIES
import { MySQLUserRepository } from "../adapters/db/mysql/MySQLUserRepository.js";
import { MySQLPropertyRepository } from "../adapters/db/mysql/MySQLPropertyRepository.js";
import { MySQLRoomTypeRepository } from "../adapters/db/mysql/MySQLRoomTypeRepository.js";
import { MySQLAccessControlRepository } from "../adapters/db/mysql/MySQLAccessControlRepository.js";
import { MySQLGuestRepository } from "../adapters/db/mysql/MySQLGuestRepository.js";

// SERVICES
import { PropertyService } from "../core/PropertyService.js";
import { UserService } from "../core/UserService.js";
import { UserCompositeService } from "../core/UserCompositeService.js";
import { RoomTypeService } from "../core/RoomTypeService.js";

// PORTS
import { UserInputPort } from "../core/ports/UserInputPort.js";
import { UserOutputPort } from "../core/ports/UserOutputPort.js";
import { PropertyInputPort } from "../core/ports/PropertyInputPort.js";
import { PropertyOutputPort } from "../core/ports/PropertyOutputPort.js";
import { RoomTypeInputPort } from "../core/ports/RoomTypeInputPort.js";
import { RoomTypeOutputPort } from "../core/ports/RoomTypeOutputPort.js";
import { GuestInputPort } from "../core/ports/GuestInputPort.js";
import { GuestOutputPort } from "../core/ports/GuestOutputPort.js";
import { UserTransactionManagerPort } from "../core/ports/UserTransactionManagerPort.js";

// Import nodemailer email notification service
import { createEmailNotification } from "../adapters/config/nodemailerConfig.js";
import { createTokenService } from "../adapters/config/tokenConfig.js";

// Import controllers
import { UserController } from "../adapters/api/controllers/UserController.js";
import { PropertyController } from "../adapters/api/controllers/PropertyController.js";
import { RoomTypeController } from "../adapters/api/controllers/RoomTypeController.js";
import { GuestController } from "../adapters/api/controllers/GuestController.js";
import { GuestService } from "../core/GuestService.js";

export default function initializeServices() {
  const mysqlPool = mysqlConnect.getPool();

  // INITIALIZE REPOSITORIES.
  const userRepository = new MySQLUserRepository(mysqlPool);
  const propertyRepository = new MySQLPropertyRepository(mysqlPool);
  const roomTypeRepository = new MySQLRoomTypeRepository(mysqlPool);
  const accessControlService = new MySQLAccessControlRepository(mysqlPool);
  const guestRepository = new MySQLGuestRepository(mysqlPool);

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
  const roomTypeOutputPort = new RoomTypeOutputPort(roomTypeRepository);
  const guestOutputPort = new GuestOutputPort(
    guestRepository,
    propertyRepository
  );

  // Initialize the core services
  const propertyService = new PropertyService(propertyOutputPort, mysqlPool);
  const userService = new UserService(userOutputPort);
  const guestService = new GuestService(guestOutputPort);
  const roomTypeService = new RoomTypeService(roomTypeOutputPort);

  // Initialize transaction manager ports
  const userTransactionManagerPort = new UserTransactionManagerPort(
    userService,
    propertyService,
    userRepository,
    propertyRepository,
    accessControlService,
    tokenService,
    emailService,
    roomTypeRepository
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
  const roomTypeInputPort = new RoomTypeInputPort(roomTypeService);
  const guestInputPort = new GuestInputPort(guestService);

  const userController = new UserController(userInputPort);
  const propertyController = new PropertyController(propertyInputPort);
  const roomTypeController = new RoomTypeController(roomTypeInputPort);
  const guestController = new GuestController(guestInputPort);

  return {
    userController,
    propertyController,
    guestController,
    roomTypeController,
  };
}
