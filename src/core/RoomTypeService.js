import { RoomType } from "./entities/RoomType.js";

export class RoomTypeService {
  constructor(roomTypeOutputPort) {
    this.roomTypeOutputPort = roomTypeOutputPort;
  }

  async createRoomType(propertyId, roomTypeData) {
    try {
      const roomTypeExist =
        await this.roomTypeOutputPort.findRoomTypeByDescription(
          roomTypeData.description,
          propertyId
        );

      if (roomTypeExist !== null) {
        throw new Error("Room Type name already exist");
      }

      // Limit roomType creation
      const beds = await this.roomTypeOutputPort.getAllPropertyBeds(propertyId);

      const roomType = new RoomType(roomTypeData);

      let newBeds = 0;
      if (roomType.getType() === "dorm") {
        newBeds = roomType.getMaxOccupancy() * roomType.getInventory();
      } else {
        newBeds = roomType.getInventory();
      }

      const totalBeds = beds.length + newBeds;

      if (totalBeds > 50) {
        throw new Error(
          "Maximum number of beds reached. You can not create more than 50 beds"
        );
      }

      roomType.setPropertyId(propertyId);
      roomType.setProducts();

      // Add room type to room type table and get back the ID.
      const result = await this.roomTypeOutputPort.save(roomType);

      return result;
    } catch (e) {
      throw e;
    }
  }

  async getAllPropertyRoomTypes(propertyId, conn = null) {
    try {
      // Brings all room types from a specific property
      const roomTypesByProperty =
        await this.roomTypeOutputPort.findAllPropertyRoomTypes(
          propertyId,
          conn
        );

      if (roomTypesByProperty === null) {
        throw new Error("No room types found that belong to this property");
      }

      return roomTypesByProperty;
    } catch (e) {
      throw e;
    }
  }

  async findRoomTypeById(id) {
    try {
      const roomType = await this.roomTypeOutputPort.findRoomTypeById(id);

      if (roomType === null) {
        throw new Error("No room types found that belong to this ID");
      }

      return roomType;
    } catch (e) {
      throw e;
    }
  }

  async updateRoomTypeById(roomTypeData, propertyId) {
    try {
      // Check if new description is unique
      // Check if room type exist in the database
      const roomTypeExist =
        await this.roomTypeOutputPort.findOneRoomTypeByDescription(
          roomTypeData.description,
          propertyId
        );

      // If room type exist in the db, throw an error
      if (roomTypeExist !== null && !roomTypeData.id.equals(roomTypeExist.id)) {
        throw new Error("Room Type name already exist");
      }

      const result = await this.roomTypeOutputPort.updateRoomTypeById(
        roomTypeData
      );

      if (result === 0 || result === null) {
        throw new Error("Room type update could not be done");
      }

      return result;
    } catch (e) {
      throw e;
    }
  }

  async deleteRoomTypeById(id) {
    try {
      const roomTypeDeleted = await this.roomTypeOutputPort.deleteRoomTypeById(
        id
      );

      if (roomTypeDeleted === null) {
        throw new Error("No room types found that belong to this ID");
      }

      return roomTypeDeleted;
    } catch (e) {
      throw e;
    }
  }
}
