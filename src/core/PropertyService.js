import { Property } from "./entities/Property.js";

export class PropertyService {
  constructor(propertyOutputPort, mysqlPool) {
    this.propertyOutputPort = propertyOutputPort;
    this.pool = mysqlPool;
  }

  async createProperty(propertyData, connection) {
    try {
      const property = new Property(propertyData);

      const result = await this.propertyOutputPort.save(property, connection);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async getPropertyDetails(id) {
    try {
      const propertyExist = await this.propertyOutputPort.findPropertyDetails(
        id
      );

      if (propertyExist === null) {
        throw Error("Property not found");
      }

      const property = new Property(propertyExist);

      return property;
    } catch (e) {
      throw e;
    }
  }

  async updatePropertyDetails(propertyId, propertyDetails) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const propertyExist = await this.propertyOutputPort.findPropertyDetails(
        propertyId,
        conn
      );
      if (propertyExist === null) {
        throw Error("Property not found");
      }

      const property = new Property(propertyExist);
      property.setPropertyName(propertyDetails.property_name);
      property.setStreet(propertyDetails.street);
      property.setCity(propertyDetails.city);
      property.setPostalCode(propertyDetails.postal_code);
      property.setCountryCode(propertyDetails.country_code);
      property.setEmail(propertyDetails.email);
      property.setPhoneNumber(propertyDetails.phone_number);
      property.setBaseCurrency(propertyDetails.base_currency);

      const result = await this.propertyOutputPort.updatePropertyDetails(
        property,
        conn
      );

      await conn.commit();
      return result;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release();
    }
  }
}
