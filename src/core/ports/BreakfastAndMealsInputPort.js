export class breakfastAndMealsInputPort {
  constructor(breakfastAndMealsService) {
    this.breakfastAndMealsService = breakfastAndMealsService;
  }

  getBreakfastSettings(propertyId) {
    return this.breakfastAndMealsService.getBreakfastSettings(propertyId);
  }

  updateBreakfastSettings(propertyId, breakfastSettings) {
    return this.breakfastAndMealsService.updateBreakfastSettings(
      propertyId,
      breakfastSettings
    );
  }
}
