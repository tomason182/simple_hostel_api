export class RoomTypeInputPort {
  constructor(roomTypeService, roomTypeRepository) {
    this.roomTypeService = roomTypeService;
    this.roomTypeRepository = roomTypeRepository;
  }

  createRoomType(propertyId, roomTypeData) {
    return this.roomTypeService.createRoomType(propertyId, roomTypeData);
  }

  readRoomTypes(propertyId) {
    return this.roomTypeService.getAllPropertyRoomTypes(propertyId);
  }

  findRoomTypeById(id) {
    return this.roomTypeService.findRoomTypeById(id);
  }

  updateRoomTypeById(roomTypeData) {
    return this.roomTypeService.updateRoomTypeById(roomTypeData);
  }

  deleteRoomTypeById(id) {
    return this.roomTypeService.deleteRoomTypeById(id);
  }
}
