export class RatesAndAvailabilityOutputPort {
  constructor(ratesAndAvailabilityRepository, roomTypeRepository) {
    this.ratesAndAvailabilityRepository = ratesAndAvailabilityRepository;
    this.roomTypeRepository = roomTypeRepository;
  }

  findRoomTypeById(roomTypeId, propertyId, conn = null) {
    return true;
    return this.roomTypeRepository.findRoomTypeById(
      roomTypeId,
      propertyId,
      conn
    );
  }
}
