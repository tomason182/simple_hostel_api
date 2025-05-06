export class BreakfastAndMealsOutputPort {
  constructor(breakfastAndMealsRepository) {
    this.breakfastAndMealsRepository = breakfastAndMealsRepository;
  }

  getBreakfastSettings(propertyId) {
    return this.breakfastAndMealsRepository.getBreakfastSettings(propertyId);
  }

  updateBreakfastSettings(propertyId, breakfastSettings) {
    return this.breakfastAndMealsRepository.updateBreakfastSettings(
      propertyId,
      breakfastSettings
    );
  }
}
