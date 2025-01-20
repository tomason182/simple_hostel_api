export class UserCompositeService {
  constructor(
    userService,
    propertyService,
    accessControlService,
    transactionManagerPort
  ) {
    this.userService = userService;
    this.propertyService = propertyService;
    this.accessControlService = accessControlService;
    this.transactionManagerPort = transactionManagerPort;
  }

  async createUserWithProperty(userData, PropertyData) {
    return this.transactionManagerPort.runInTransaction(async connection => {
      try {
        const user = await this.userService.createUser(userData, connection);
        const property = await this.propertyService.createProperty(
          PropertyData,
          connection
        );
        const role = "admin";
        const accessControlID = await this.accessControlService.save(
          user.id,
          property.id,
          role,
          connection
        );

        return accessControlID;
      } catch (e) {
        throw new Error(`Unable to create user with property: ${e.message}`);
      }
    });
  }
}
