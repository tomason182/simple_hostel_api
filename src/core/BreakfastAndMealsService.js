export class BreakfastAndMealsService {
  constructor(breakfastAndMealsOutputPort) {
    this.breakfastAndMealsOutputPort = breakfastAndMealsOutputPort;
  }

  async getBreakfastSettings(propertyId) {
    try {
      const result =
        await this.breakfastAndMealsOutputPort.getBreakfastSettings(propertyId);

      // If result is null return default breakfast settings
      if (result === null) {
        return {
          property_id: propertyId,
          is_served: 0,
          is_included: 0,
          price: "",
        };
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateBreakfastSettings(propertyId, settings) {
    try {
      // Clean breakfast settings
      let breakfastSettings = {
        is_served: settings.is_served,
        is_included: settings.is_served ? settings.is_included : null,
        price: !settings.is_included ? settings.price : 0,
      };

      const result =
        await this.breakfastAndMealsOutputPort.updateBreakfastSettings(
          propertyId,
          breakfastSettings
        );

      return result;
    } catch (err) {
      throw err;
    }
  }
}
