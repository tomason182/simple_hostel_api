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

  updatePaymentMethods(propertyId, methodsToRemove, methodsToAdd) {
    return this.propertyRepository.updatePaymentMethods(
      propertyId,
      methodsToRemove,
      methodsToAdd
    );
  }

  // Policies
  getPropertyPolicies(propertyId) {
    return this.propertyRepository.getPropertyPolicies(propertyId);
  }

  updateReservationPolicies(propertyId, policies) {
    return this.propertyRepository.updateReservationPolicies(
      propertyId,
      policies
    );
  }

  insertOrUpdateAdvancePaymentPolicies(propertyId, policies) {
    return this.propertyRepository.insertOrUpdateAdvancePaymentPolicies(
      propertyId,
      policies
    );
  }

  getPropertyCancellationPolicies(propertyId) {
    return this.propertyRepository.getPropertyCancellationPolicies(propertyId);
  }

  insertCancellationPolicy(propertyId, daysBeforeArrival, amountRefund) {
    return this.propertyRepository.insertCancellationPolicy(
      propertyId,
      daysBeforeArrival,
      amountRefund
    );
  }

  updateCancellationPolicy(id, propertyId, daysBeforeArrival, amountRefund) {
    return this.propertyRepository.updateCancellationPolicy(
      id,
      propertyId,
      daysBeforeArrival,
      amountRefund
    );
  }

  deleteCancellationPolicy(id, propertyId) {
    return this.propertyRepository.deleteCancellationPolicy(id, propertyId);
  }

  insertOrUpdateChildrenPolicies(propertyId, policies) {
    return this.propertyRepository.insertOrUpdateChildrenPolicies(
      propertyId,
      policies
    );
  }

  insertOrUpdateOtherPolicies(propertyId, policies) {
    return this.propertyRepository.insertOrUpdateOtherPolicies(
      propertyId,
      policies
    );
  }
}
