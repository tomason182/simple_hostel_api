const Property = require("./entities/Property");

class PropertyService {
  constructor(PropertyRepository) {
    this.PropertyRepository = PropertyRepository;
  }

  async createProperty(propertyName, email, connection = null) {
    try {
      const property = new Property({ propertyName, email });

      await this.PropertyRepository.save(property, connection);
      return property;
    } catch (e) {
      throw `An error occurred when trying to create a property: ${e.message}`;
    }
  }
}

module.exports = PropertyService;
