export class BreakfastAndMealsService {
  constructor(breakfastAndMealsOutputPort) {
    this.breakfastAndMealsOutputPort = breakfastAndMealsOutputPort;
  }

  async getBreakfastSettings(propertyId) {
    try {
      const result =
        await this.breakfastAndMealsOutputPort.getBreakfastSettings(propertyId);

      // If result is [] then breakfast is not included.

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
