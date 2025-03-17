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

  getPropertyPolicies(propertyId) {
    return this.propertyService.getPropertyPolicies(propertyId);
  }

  insertOrUpdateReservationsPolicies(propertyId, policiesData) {
    return this.propertyService.insertOrUpdateReservationsPolicies(
      propertyId,
      policiesData
    );
  }

  insertOrUpdateAdvancePaymentPolicies(propertyId, data) {
    return this.propertyService.insertOrUpdateAdvancePaymentPolicies(
      propertyId,
      data
    );
  }

  insertCancellationPolicies(propertyId, data) {
    return this.propertyService.insertCancellationPolicies(propertyId, data);
  }

  updateCancellationPolicies(propertyId, data) {
    return this.propertyService.updateCancellationPolicies(propertyId, data);
  }

  deleteCancellationPolicies(propertyId, data) {
    return this.propertyService.deleteCancellationPolicies(propertyId, data);
  }

  insertOrUpdateChildrenPolicies(propertyId, data) {
    return this.propertyService.insertOrUpdateChildrenPolicies(
      propertyId,
      data
    );
  }

  insertOrUpdateOtherPolicies(propertyId, data) {
    return this.propertyService.insertOrUpdateOtherPolicies(propertyId, data);
  }
}
