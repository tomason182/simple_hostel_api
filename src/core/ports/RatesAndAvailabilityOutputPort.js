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

  // Rate and availability services
  insertOrUpdateRange(
    roomTypeId,
    propertyId,
    startDate,
    endDate,
    customRate,
    customAvailability,
    conn = null
  ) {
    return this.ratesAndAvailabilityRepository.insertOrUpdateRange(
      roomTypeId,
      propertyId,
      startDate,
      endDate,
      customRate,
      customAvailability,
      conn
    );
  }

  findByDateRange(propertyId, from, to) {
    return this.ratesAndAvailabilityRepository.getAllPropertyRanges(
      propertyId,
      from,
      to
    );
  }

  // Room type services
  findRoomTypeById(roomTypeId, propertyId, conn = null) {
    return this.roomTypeRepository.findRoomTypeById(
      roomTypeId,
      propertyId,
      conn
    );
  }

  // availability Services
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
