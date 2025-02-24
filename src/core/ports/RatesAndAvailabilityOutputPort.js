export class RatesAndAvailabilityOutputPort {
  constructor(ratesAndAvailabilityRepository, roomTypeRepository) {
    this.ratesAndAvailabilityRepository = ratesAndAvailabilityRepository;
    this.roomTypeRepository = roomTypeRepository;
  }

  findRoomTypeById(roomTypeId, propertyId, conn = null) {
    return this.roomTypeRepository.findRoomTypeById(
      roomTypeId,
      propertyId,
      conn
    );
  }

  checkCustomAvailability(
    roomType,
    startDate,
    endDate,
    customAvailability,
    conn = null
  ) {
    return this.availabilityService.checkCustomAvailability(
      roomType,
      startDate,
      endDate,
      customAvailability,
      conn
    );
  }
}
