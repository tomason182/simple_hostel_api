import { Property } from "./entities/Property.js";
import { Policies } from "./entities/Policies.js";

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

  async updateContactInfo(propertyId, data) {
    try {
      const result = await this.propertyOutputPort.updateContactInfo(
        propertyId,
        data
      );

      return result;
    } catch (e) {
      throw e;
    }
  }

  async updatePropertyDetails(propertyId, propertyDetails) {
    try {
      const property = new Property(propertyDetails);
      property.setId(propertyId);

      const result = await this.propertyOutputPort.updatePropertyDetails(
        property
      );

      return result;
    } catch (e) {
      throw e;
    }
  }

  async insertOrUpdateReservationsPolicies(propertyId, policiesData) {
    try {
      const policies = new Policies(policiesData);
      policies.setPaymentMethods(policiesData.payment_methods_accepted);
      policies.setOnlinePaymentMethods(
        policiesData.online_payment_methods_accepted
      );

      // New payment methods
      const newPaymentMethods = policies.getPaymentMethods() || [];
      const newOnlinePaymentMethods = policies.getOnlinePaymentMethods() || [];

      // Get property selected payment methods
      const paymentMethods =
        await this.propertyOutputPort.getPropertyPaymentMethods(propertyId);
      const onlinePaymentMethods =
        await this.propertyOutputPort.getPropertyOnlinePayments(propertyId);

      // Convert methods to a Set for faster lookup
      const paymentMethodsSet = new Set(paymentMethods);
      const onlinePaymentMethodsSet = new Set(onlinePaymentMethods);
      const newPaymentMethodsSet = new Set(newPaymentMethods);
      const newOnlinePaymentMethodsSet = new Set(newOnlinePaymentMethods);

      let methodsToRemove = paymentMethods.filter(
        p => !newPaymentMethodsSet.has(p)
      );
      let methodsToAdd = newPaymentMethods.filter(
        np => !paymentMethodsSet.has(np)
      );

      let onlineMethodsToRemove = onlinePaymentMethods.filter(
        op => !newOnlinePaymentMethodsSet.has(op)
      );
      let onlineMethodsToAdd = newPaymentMethods.filter(
        np => !onlinePaymentMethodsSet.has(np)
      );

      if (methodsToRemove.length > 0 || methodsToAdd.length > 0) {
        await this.propertyOutputPort.updatePaymentMethods(
          propertyId,
          methodsToRemove,
          methodsToAdd
        );
      }

      if (onlineMethodsToRemove.length > 0 || onlineMethodsToAdd.length > 0) {
        await this.propertyOutputPort.updateOnlinePaymentMethods(
          propertyId,
          onlineMethodsToRemove,
          onlineMethodsToAdd
        );
      }

      const result = await this.propertyOutputPort.updateReservationPolicies(
        propertyId,
        policies
      );

      return result;
    } catch (e) {
      throw e;
    }
  }
}
