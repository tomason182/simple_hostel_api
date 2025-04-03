export class RoomTypeInputPort {
  constructor(roomTypeService) {
    this.roomTypeService = roomTypeService;
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

  updateRoomType(roomTypeData, propertyId) {
    return this.roomTypeService.updateRoomType(roomTypeData, propertyId);
  }

  deleteRoomTypeById(id, propertyId) {
    return this.roomTypeService.deleteRoomTypeById(id, propertyId);
  }

  addOrUpdateRoomTypesAmenities(propertyId, data) {
    return this.roomTypeService.addOrUpdateRoomTypesAmenities(propertyId, data);
  }
}
