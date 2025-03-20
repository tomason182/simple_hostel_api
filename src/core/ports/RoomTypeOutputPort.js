export class RoomTypeOutputPort {
  constructor(roomTypeRepository, amenitiesRepository) {
    this.roomTypeRepository = roomTypeRepository;
    this.amenitiesRepository = amenitiesRepository;
  }

  save(roomType) {
    return this.roomTypeRepository.save(roomType);
  }

  findRoomTypeByDescription(description, propertyId, conn = null) {
    return this.roomTypeRepository.findRoomTypeByDescription(
      description,
      propertyId,
      conn
    );
  }

  getAllPropertyBeds(propertyId, conn = null) {
    return this.roomTypeRepository.getAllPropertyBeds(propertyId, conn);
  }

  findAllPropertyRoomTypes(propertyId, conn = null) {
    return this.roomTypeRepository.findAllPropertyRoomTypes(propertyId, conn);
  }

  findRoomTypeById(id, propertyId, conn = null) {
    return this.roomTypeRepository.findRoomTypeById(id, propertyId, conn);
  }

  updateRoomTypeById(roomTypeData, conn = null) {
    return this.roomTypeRepository.updateRoomTypeById(roomTypeData, conn);
  }

  deleteRoomTypeById(id, propertyId, conn = null) {
    return this.roomTypeRepository.deleteRoomTypeById(id, propertyId, conn);
  }

  getUpcomingReservations(id, checkIn) {
    return this.roomTypeRepository.getUpcomingReservations(id, checkIn);
  }

  // Amenities
  getValidAmenities(amenitiesList) {
    return this.amenitiesRepository.getValidAmenities(amenitiesList);
  }

  getRoomTypeAmenities(roomId) {
    return this.amenitiesRepository.getRoomTypeAmenities(roomId);
  }

  insertOrUpdateRoomTypeAmenities(
    roomTypeId,
    amenitiesToAdd,
    amenitiesToRemove
  ) {
    return this.amenitiesRepository.insertOrUpdateRoomTypeAmenities(
      roomTypeId,
      amenitiesToAdd,
      amenitiesToRemove
    );
  }
}
