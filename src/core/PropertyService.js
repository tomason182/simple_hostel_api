import { Property } from "./entities/Property.js";
import { Policies } from "./entities/Policies.js";

export class PropertyService {
  constructor(propertyOutputPort) {
    this.propertyOutputPort = propertyOutputPort;
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

      // Convert all method to flat list
      const newPaymentMethodsFlat = newPaymentMethods.flatMap(p => p.id);
      const newOnlinePaymentMethodsFlat = newOnlinePaymentMethods.flatMap(
        p => p.id
      );
      const paymentMethodsFlat = paymentMethods.flatMap(p => p.id);
      const onlinePaymentMethodsFlat = onlinePaymentMethods.flatMap(p => p.id);

      // Convert methods to a Set for faster lookup
      const paymentMethodsSet = new Set(paymentMethodsFlat);
      const onlinePaymentMethodsSet = new Set(onlinePaymentMethodsFlat);
      const newPaymentMethodsSet = new Set(newPaymentMethodsFlat);
      const newOnlinePaymentMethodsSet = new Set(newOnlinePaymentMethodsFlat);

      let methodsToRemove = paymentMethodsFlat.filter(
        p => !newPaymentMethodsSet.has(p)
      );
      let methodsToAdd = newPaymentMethodsFlat.filter(
        np => !paymentMethodsSet.has(np)
      );

      let onlineMethodsToRemove = onlinePaymentMethodsFlat.filter(
        op => !newOnlinePaymentMethodsSet.has(op)
      );
      let onlineMethodsToAdd = newOnlinePaymentMethodsFlat.filter(
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

  async insertOrUpdateAdvancePaymentPolicies(propertyId, data) {
    try {
      const policies = new Policies(data);

      const result =
        await this.propertyOutputPort.insertOrUpdateAdvancePaymentPolicies(
          propertyId,
          policies
        );

      return result;
    } catch (e) {
      throw e;
    }
  }

  async insertCancellationPolicies(propertyId, data) {
    try {
      const propertyCancellationPolicies =
        await this.propertyOutputPort.getPropertyCancellationPolicies(
          propertyId
        );

      const daysBeforeArrival = data.days_before_arrival;
      const amountRefund = data.amount_refund;

      if (
        !propertyCancellationPolicies.every(
          policy => policy.days_before_arrival !== daysBeforeArrival
        )
      ) {
        return {
          status: "Error",
          msg: `There is a policy setted up for ${data.days_before_arrival} days. Please, remove it or update it`,
        };
      }

      await this.propertyOutputPort.insertCancellationPolicy(
        propertyId,
        daysBeforeArrival,
        amountRefund
      );

      return {
        status: "ok",
        msg: "Cancellation Policy inserted successfully",
      };
    } catch (e) {
      throw e;
    }
  }

  async updateCancellationPolicies(propertyId, data) {
    try {
      const propertyCancellationPolicies =
        await this.propertyOutputPort.getPropertyCancellationPolicies(
          propertyId
        );

      const id = data.id;
      const daysBeforeArrival = data.days_before_arrival;
      const amountRefund = data.amount_refund;

      const filteredPolicies = propertyCancellationPolicies.filter(
        policy => policy.id !== id
      );

      if (
        !filteredPolicies.every(
          policy => policy.days_before_arrival !== daysBeforeArrival
        )
      ) {
        return {
          status: "Error",
          msg: `There is a policy setted up for ${data.days_before_arrival} days. Please, remove it or update it`,
        };
      }

      await this.propertyOutputPort.updateCancellationPolicy(
        id,
        propertyId,
        daysBeforeArrival,
        amountRefund
      );

      return {
        status: "ok",
        msg: "Cancellation policy updated successfully",
      };
    } catch (e) {
      throw e;
    }
  }

  async deleteCancellationPolicies(propertyId, data) {
    try {
      const id = data.id;
      await this.propertyOutputPort.deleteCancellationPolicy(id, propertyId);

      return {
        status: "ok",
        msg: "Cancellation policy deleted successfully",
      };
    } catch (e) {
      throw e;
    }
  }

  async insertOrUpdateChildrenPolicies(propertyId, data) {
    try {
      const policies = new Policies(data);

      console.log(policies);

      await this.propertyOutputPort.insertOrUpdateChildrenPolicies(
        propertyId,
        policies
      );

      return {
        status: "ok",
        msg: "Children policy inserted or updated successfully",
      };
    } catch (e) {
      throw e;
    }
  }
}
