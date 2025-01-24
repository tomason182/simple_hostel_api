import { Property } from "./entities/Property.js";

export class PropertyService {
  constructor(propertyOutputPort) {
    this.propertyOutputPort = propertyOutputPort;
  }

  async createProperty(propertyData, connection) {
    try {
      const property = new Property({
        propertyName: propertyData.propertyName,
        email: propertyData.email,
      });

      const result = await this.propertyOutputPort.save(property, connection);
      return result;
    } catch (e) {
      throw `An error occurred when trying to create a property: ${e.message}`;
    }
  }
}
