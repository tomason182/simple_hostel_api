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
        return {
          status: "error",
          msg: "Room Type name already exist",
        };
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
        return {
          status: "error",
          msg: "Maximum number of beds reached. You can not create more than 50 beds",
        };
      }

      roomType.setPropertyId(propertyId);
      roomType.setProducts();

      // Add room type to room type table and get back the ID.
      await this.roomTypeOutputPort.save(roomType);

      return {
        status: "success",
        msg: "Room type created successfully",
      };
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

      let roomTypes = [];

      for (const element of roomTypesByProperty) {
        let roomType = roomTypes.find(r => r.getId() === element.id);

        if (!roomType) {
          roomType = new RoomType({
            id: element.id,
            property_id: element.property_id,
            description: element.description,
            type: element.type,
            gender: element.gender,
            max_occupancy: element.max_occupancy,
            inventory: element.inventory,
          });

          const amenities = await this.roomTypeOutputPort.getRoomTypeAmenities(
            roomType.getId()
          );

          roomType.setAmenities(amenities);

          roomTypes.push(roomType);
        }

        let products = roomType.getProducts();
        let beds = [];
        let product = products.find(p => p.id === element.product_id);
        if (!product) {
          beds.push(element.bed_id);
          let product = {
            id: element.product_id,
            room_name: element.room_name,
            beds,
          };
          products.push(product);
        } else {
          product.beds.push(element.bed_id);
        }
      }

      return roomTypes;
    } catch (e) {
      throw e;
    }
  }

  async updateRoomType(roomTypeData, propertyId) {
    try {
      // Check if new description is unique
      // Check if room type exist in the database

      const roomTypeExist =
        await this.roomTypeOutputPort.findRoomTypeByDescription(
          propertyId,
          roomTypeData.description
        );

      // If room type exist in the db, throw an error
      if (roomTypeExist !== null && !roomTypeData.id.equals(roomTypeExist.id)) {
        return {
          status: "error",
          msg: "Room type description already exist",
        };
      }

      const result = await this.roomTypeOutputPort.updateRoomTypeById(
        roomTypeData,
        propertyId
      );

      if (result === 0 || result === null) {
        return {
          status: "error",
          msg: "Room type could not be updated",
        };
      }

      console.log(result);

      return { status: "ok", msg: result };
    } catch (e) {
      throw e;
    }
  }

  async deleteRoomTypeById(id, propertyId) {
    try {
      // Check if room type has upcoming reservations
      const today = new Date();
      const hasReservation =
        await this.roomTypeOutputPort.getUpcomingReservations(id, today);

      if (hasReservation.length > 0) {
        return {
          status: "error",
          msg: "The are upcoming reservations for the room type you want to delete",
        };
      }

      const roomTypeDeleted = await this.roomTypeOutputPort.deleteRoomTypeById(
        id,
        propertyId
      );

      if (roomTypeDeleted === null) {
        throw new Error("No room types found that belong to this ID");
      }

      return roomTypeDeleted;
    } catch (e) {
      throw e;
    }
  }

  // Amenities

  async addOrUpdateRoomTypesAmenities(propertyId, data) {
    try {
      // Chequear que el id del room type corresponde con la propiedad.
      const roomTypeId = data.id;
      const amenitiesIds = data.amenities;

      const roomType = await this.roomTypeOutputPort.findRoomTypeById(
        roomTypeId,
        propertyId
      );

      if (roomType === null) {
        throw new Error("Room type do not match property");
      }

      // Validate amenities id
      const validIds = await this.roomTypeOutputPort.getValidAmenities(
        amenitiesIds
      );

      if (validIds.length === 0) {
        return {
          status: "error",
          msg: "Invalid amenities ID",
        };
      }

      const validAmenities = validIds.flatMap(item => item.id);

      const oldAmenities = await this.roomTypeOutputPort.getRoomTypeAmenities(
        roomTypeId
      );

      const oldAmenitiesFlat = oldAmenities.flatMap(
        amenity => amenity.amenity_id
      );

      const amenitiesToRemove = oldAmenitiesFlat.filter(
        oldAmenity => !validAmenities.some(amenity => amenity === oldAmenity)
      );
      const amenitiesToAdd = validAmenities.filter(
        amenity => !oldAmenitiesFlat.some(oldAmenity => oldAmenity === amenity)
      );

      const result =
        await this.roomTypeOutputPort.insertOrUpdateRoomTypeAmenities(
          roomTypeId,
          amenitiesToAdd,
          amenitiesToRemove
        );

      return result;
    } catch (e) {
      throw e;
    }
  }
}
