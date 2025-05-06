export class breakfastAndMealsService {
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
      const result =
        await this.breakfastAndMealsOutputPort.updateBreakfastSettings(
          propertyId,
          settings
        );

      return result;
    } catch (err) {
      throw err;
    }
  }
}
