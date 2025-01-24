export class PropertyOutputPort {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  save(propertyData, connection) {
    return this.propertyRepository.save(propertyData, connection);
  }
}
