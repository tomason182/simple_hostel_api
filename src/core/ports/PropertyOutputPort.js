export class PropertyOutputPort {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  save(propertyData, connection) {
    return this.propertyRepository.save(propertyData, connection);
  }

  findUsers(propertyId, connection) {
    return this.propertyRepository.findUser(propertyId, connection);
  }
}
