export class RoomTypeOutputPort {
  constructor(roomTypeRepository) {
    this.roomTypeRepository = roomTypeRepository;
  }

  save(roomType, connection) {
    return this.roomTypeRepository.save(roomType, connection);
  }

  findRoomTypeByDescription(description, propertyId, conn = null) {
    return this.roomTypeRepository.findRoomTypeByDescription(
      description,
      propertyId,
      conn
    );
  }

  findAllPropertyRoomTypes(propertyId, conn = null) {
    return this.roomTypeRepository.findAllPropertyRoomTypes(propertyId, conn);
  }

  findRoomTypeById(id, conn = null) {
    return this.roomTypeRepository.findRoomTypeById(id, conn);
  }

  updateRoomTypeById(roomTypeData, conn = null) {
    return this.roomTypeRepository.updateRoomTypeById(roomTypeData, conn);
  }

  deleteRoomTypeById(id, conn = null) {
    return this.roomTypeRepository.deleteRoomTypeById(id, conn);
  }
}
