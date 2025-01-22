import { Property } from "./entities/Property.js";
import { PropertyOutputPort } from "./ports/PropertyOutputPort.js";

export class PropertyService extends PropertyOutputPort {
  constructor() {
    super();
  }

  async createProperty(propertyData, connection) {
    try {
      const property = new Property({
        propertyName: propertyData.propertyName,
        email: propertyData.email,
      });

      const result = await super.save(property, connection);
      return result;
    } catch (e) {
      throw `An error occurred when trying to create a property: ${e.message}`;
    }
  }

  async findAllPropertyUsers(propertyId, connection) {
    try {
      const result = await super.findUsers(propertyId, connection);

      return result;
    } catch (e) {
      throw e;
    }
  }
}
