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
import { PropertyOutputPort } from "../core/ports/PropertyOutputPort.js";
import { TransactionManagerPort } from "../core/ports/TransactionManagerPort.js";
import { UserInputPort } from "../core/ports/UserInputPort.js";
import { UserOutputPort } from "../core/ports/UserOutputPort.js";

// Import nodemailer email notification service
import { createEmailNotification } from "../adapters/config/nodemailerConfig.js";
import { createTokenService } from "../adapters/config/tokenConfig.js";

// Import controllers
import { UserController } from "../adapters/api/controllers/UserController.js";

export default function initializeServices() {
  const mysqlPool = mysqlConnect.getPool();

  // Initialize adapters

  const userRepository = new MySQLUserRepository(mysqlPool);
  const propertyRepository = new MySQLPropertyRepository(mysqlPool);
  const accessControlService = new MySQLAccessControlRepository(mysqlPool);

  const emailService = createEmailNotification();
  const tokenService = createTokenService();

  // Initialize the core services
  const propertyService = new PropertyService();
  const userService = new UserService();
  const userCompositeService = new UserCompositeService(mysqlPool);

  // Initialize the ports
  const propertyOutputPort = new PropertyOutputPort(propertyRepository);
  const userInputPort = new UserInputPort(
    userService,
    userCompositeService,
    emailService,
    tokenService
  );
  const userOutputPort = new UserOutputPort(
    userRepository,
    tokenService,
    emailService
  );
  const transactionManagerPort = new TransactionManagerPort(
    userService,
    propertyService,
    accessControlService,
    tokenService,
    emailService
  );

  const userController = new UserController(userInputPort);

  return {
    userController,
    userInputPort,
    userOutputPort,
    propertyOutputPort,
    transactionManagerPort,
  };
}
