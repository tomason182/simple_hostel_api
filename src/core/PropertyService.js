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

  async getPropertyPolicies(propertyId) {
    try {
      const policiesResult = await this.propertyOutputPort.getPropertyPolicies(
        propertyId
      );

      const policies = new Policies(policiesResult.policies);
      policies.setCancellationPolicies(
        policiesResult.policies.cancellation_policies
      );
      policies.setPaymentMethods(policiesResult.payment_methods);

      return policies;
    } catch (e) {
      throw e;
    }
  }

  async insertOrUpdateReservationsPolicies(propertyId, policiesData) {
    try {
      const policies = new Policies(policiesData);
      policies.setPaymentMethods(policiesData.payment_methods_accepted);

      // New payment methods
      const newPaymentMethods = policies.getPaymentMethods() || [];

      // Get property selected payment methods
      const oldPaymentMethods =
        await this.propertyOutputPort.getPropertyPaymentMethods(propertyId);

      const oldPaymentMethodsFlat = oldPaymentMethods.flatMap(
        p => p.payment_method
      );

      let methodsToRemove = oldPaymentMethodsFlat.filter(
        oldMethod =>
          !newPaymentMethods.some(newMethod => newMethod === oldMethod)
      );
      let methodsToAdd = newPaymentMethods.filter(
        newMethod =>
          !oldPaymentMethodsFlat.some(oldMethod => oldMethod === newMethod)
      );

      console.log("method to add: ", methodsToAdd);
      console.log("method to remove: ", methodsToRemove);

      if (methodsToRemove.length > 0 || methodsToAdd.length > 0) {
        await this.propertyOutputPort.updatePaymentMethods(
          propertyId,
          methodsToRemove,
          methodsToAdd
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

  async insertOrUpdateOtherPolicies(propertyId, data) {
    try {
      const policies = new Policies(data);

      await this.propertyOutputPort.insertOrUpdateOtherPolicies(
        propertyId,
        policies
      );

      return {
        status: "ok",
        msg: "Other policies inserted or updated successfully",
      };
    } catch (e) {
      throw e;
    }
  }
}
