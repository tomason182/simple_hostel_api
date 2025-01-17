const Property = require("./entities/Property");

class PropertyService {
  constructor(PropertyRepository) {
    this.PropertyRepository = PropertyRepository;
  }

  async createProperty(propertyData, connection) {
    try {
      const property = new Property({
        propertyName: propertyData.propertyName,
        email: propertyData.email,
      });

      const result = await this.PropertyRepository.save(property, connection);
      return result;
    } catch (e) {
      throw `An error occurred when trying to create a property: ${e.message}`;
    }
  }
}

module.exports = PropertyService;
