export class PropertyOutputPort {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  save(propertyData, connection) {
    return this.propertyRepository.save(propertyData, connection);
  }

  findPropertyDetails(id, conn = null) {
    return this.propertyRepository.findPropertyDetails(id, conn);
  }

  updateContactInfo(propertyId, data) {
    return this.propertyRepository.updateContactInfo(propertyId, data);
  }

  updatePropertyDetails(propertyDetails, conn = null) {
    return this.propertyRepository.updatePropertyDetails(propertyDetails, conn);
  }
}
