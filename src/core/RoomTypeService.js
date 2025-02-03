import { RoomType } from "./entities/RoomType.js";

export class RoomTypeService {
  constructor(roomTypeOutputPort, mysqlPool) {
    this.roomTypeOutputPort = roomTypeOutputPort;
    this.pool = mysqlPool;
  }


  async createRoomType(propertyId, roomTypeData, connection) {
    try {

      const roomTypeExist = await this.roomTypeOutputPort.findOneRoomTypeByDescription(
        roomTypeData.description,
        propertyId,
        connection,
      );

      if (roomTypeExist !== null) {
        throw new Error("Room Type name already exist");
      }

      // Limit roomType creation
      const roomTypeList = await this.roomTypeOutputPort.findAllRoomTypesByPropertyId(
        propertyId,
        connection,
      );
      
      const roomType = new RoomType(roomTypeData);            // esto se desestructura adentro ?

      roomTypeList.push(roomType);

      const numberOfGuest = roomTypeList.reduce(
        (acc, currentValue) =>
          acc + currentValue.max_occupancy * currentValue.inventory,
        0
      );

      if (numberOfGuest > 25) {
        throw new Error(
          "Maximum number of beds reached. You can not create more than 25 beds"
        );
      }

      roomType.setPropertyId(propertyId);
      // roomType.setProducts();                  ##########    AQUI SE SETEABAN LOS PRODUCTS PERO AHORA ESTOS ESTAN EN UNA TABLA APARTE
      // RESOLVER LUEGO.

      const result = await this.roomTypeOutputPort.save(roomType, connection);
      return result;
    } catch (e) {
      throw e;
    }
  }

  
  async readRoomTypes(propertyId) {
    try {
      // Brings all room types from a specific property
      const roomTypesByProperty = await this.roomTypeOutputPort.findAllRoomTypesByPropertyId(
        propertyId
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
      const roomTypeExist = await this.roomTypeOutputPort.findOneRoomTypeByDescription(
        roomTypeData.description,
        propertyId, 
      );

      // If room type exist in the db, throw an error
      if (roomTypeExist !== null && !roomTypeData.id.equals(roomTypeExist.id)) {
        throw new Error("Room Type name already exist");
      }

      const result = await this.roomTypeOutputPort.updateRoomTypeById(roomTypeData);

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

      const roomTypeDeleted = await this.roomTypeOutputPort.deleteRoomTypeById(id);

      if (roomTypeDeleted === null) {
        throw new Error("No room types found that belong to this ID");
      }
      
      return roomTypeDeleted;
    } catch (e) {
      throw e;
    }
  } 
}
