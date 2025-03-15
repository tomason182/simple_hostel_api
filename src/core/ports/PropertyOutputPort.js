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

  // Property Payment methods
  getPropertyPaymentMethods(propertyId) {
    return this.propertyRepository.getPaymentMethods(propertyId);
  }

  getPropertyOnlinePayments(propertyId) {
    return this.propertyRepository.getOnlinePaymentMethods(propertyId);
  }

  updatePaymentMethods(propertyId, methodsToRemove, methodsToAdd) {
    return this.propertyRepository.updatePaymentMethods(
      propertyId,
      methodsToRemove,
      methodsToAdd
    );
  }

  updateOnlinePaymentMethods(propertyId, methodsToRemove, methodsToAdd) {
    return this.propertyRepository.updateOnlinePaymentMethods(
      propertyId,
      methodsToRemove,
      methodsToAdd
    );
  }

  updateReservationPolicies(propertyId, policies) {
    return this.propertyRepository.updateReservationPolicies(
      propertyId,
      policies
    );
  }
}
