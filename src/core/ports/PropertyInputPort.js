export class PropertyInputPort {
  constructor(propertyService, propertyRepository) {
    this.propertyService = propertyService;
    this.propertyRepository = propertyRepository;
  }

  getPropertyDetails(id) {
    return this.propertyService.getPropertyDetails(id);
  }
  updatePropertyDetails(propertyId, propertyData) {
    return this.propertyService.updatePropertyDetails(propertyId, propertyData);
  }

  updateContactInfo(propertyId, data) {
    return this.propertyService.updateContactInfo(propertyId, data);
  }
}
