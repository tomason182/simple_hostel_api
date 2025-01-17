// Import adapter repositories and core services
import { MySQLUserRepository } from "./adapters/db/mysql/MySQLUserRepository.js";
import { MySQLPropertyRepository } from "./adapters/db/mysql/MySQLPropertyRepository.js";
import { MySQLTransactionManager } from "./adapters/db/mysql/MySQLTransactionManager.js";
import { MySQLAccessControlRepository } from "./adapters/db/mysql/MySQLAccessControlRepository.js";

import { PropertyService } from "./core/PropertyService.js";
import { UserService, UserService } from "./core/UserService.js";
import { UserCompositeService } from "./core/UserCompositeService.js";
import { AccessControlService } from "./core/ports/AccessControlService.js";

// Get MySQL connection
import { mysqlPool } from "./adapters/config/mysql_config.js";

// Initialize adapters
const userRepository = new MySQLUserRepository(mysqlPool);
const propertyRepository = new MySQLPropertyRepository(mysqlPool);
const accessControl = new MySQLAccessControlRepository(mysqlPool);
const transactionManager = new MySQLTransactionManager(mysqlPool);

// Initialize and export the core services
export const propertyService = new PropertyService(propertyRepository);
export const userService = new UserService(userRepository);
export const accessControlService = new AccessControlService();
export const userCompositeService = new UserCompositeService(
  userService,
  propertyService,
  accessControlService,
  transactionManager
);
