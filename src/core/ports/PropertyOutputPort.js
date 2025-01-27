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

  updatePropertyDetails(propertyDetails, conn = null) {
    return this.propertyRepository.updatePropertyDetails(propertyDetails, conn);
  }
}
