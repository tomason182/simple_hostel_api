// Import Import MySQL pool
import { mysqlConnect } from "../adapters/config/mysql_config.js";

// Import adapter repositories and core services
import { MySQLUserRepository } from "../adapters/db/mysql/MySQLUserRepository.js";
import { MySQLPropertyRepository } from "../adapters/db/mysql/MySQLPropertyRepository.js";
import { MySQLAccessControlRepository } from "../adapters/db/mysql/MySQLAccessControlRepository.js";

import { PropertyService } from "../core/PropertyService.js";
import { UserService } from "../core/UserService.js";
import { UserCompositeService } from "../core/UserCompositeService.js";

// Import ports
import { UserInputPort } from "../core/ports/UserInputPort.js";
import { UserOutputPort } from "../core/ports/UserOutputPort.js";
import { PropertyOutputPort } from "../core/ports/PropertyOutputPort.js";
import { UserTransactionManagerPort } from "../core/ports/UserTransactionManagerPort.js";

// Import nodemailer email notification service
import { createEmailNotification } from "../adapters/config/nodemailerConfig.js";
import { createTokenService } from "../adapters/config/tokenConfig.js";

// Import controllers
import { UserController } from "../adapters/api/controllers/UserController.js";
import { PropertyController } from "../adapters/api/controllers/PropertyController.js";
import { PropertyInputPort } from "../core/ports/PropertyInputPort.js";

export default function initializeServices() {
  const mysqlPool = mysqlConnect.getPool();

  // Initialize adapters

  const userRepository = new MySQLUserRepository(mysqlPool);
  const propertyRepository = new MySQLPropertyRepository(mysqlPool);
  const accessControlService = new MySQLAccessControlRepository(mysqlPool);

  const emailService = createEmailNotification();
  const tokenService = createTokenService();

  // Initialize output ports
  const userOutputPort = new UserOutputPort(
    userRepository,
    accessControlService,
    tokenService,
    emailService
  );

  const propertyOutputPort = new PropertyOutputPort(propertyRepository);

  // Initialize the core services
  const propertyService = new PropertyService(propertyOutputPort, mysqlPool);
  const userService = new UserService(userOutputPort);

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

  const userController = new UserController(userInputPort);
  const propertyController = new PropertyController(propertyInputPort);

  return {
    userController,
    propertyController,
  };
}
