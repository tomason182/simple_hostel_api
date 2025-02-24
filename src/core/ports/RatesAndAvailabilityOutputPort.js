export class RatesAndAvailabilityOutputPort {
  constructor(
    ratesAndAvailabilityRepository,
    roomTypeRepository,
    availabilityService
  ) {
    this.ratesAndAvailabilityRepository = ratesAndAvailabilityRepository;
    this.roomTypeRepository = roomTypeRepository;
    this.availabilityService = availabilityService;
  }

  insertRange(rateAndAvailability, conn = null) {
    return this.ratesAndAvailabilityRepository.insertRange(
      rateAndAvailability,
      conn
    );
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
