export class MySQLRoomTypeRepository {
  constructor(mysqlPool) {
    this.pool = mysqlPool;
  }

  async save(roomType) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const roomTypeQuery =
        "INSERT INTO room_types (property_id, description, type, gender, max_occupancy, inventory) VALUES (?,?,?,?,?,?)";
      const roomTypeParams = [
        roomType.getPropertyId(),
        roomType.getDescription(),
        roomType.getType(),
        roomType.getGender(),
        roomType.getMaxOccupancy(),
        roomType.getInventory(),
      ];

      const [result] = await conn.execute(roomTypeQuery, roomTypeParams);

      roomType.setId(result.insertId);

      const products = roomType.getProducts();
      const roomTypeId = roomType.getId();

      for (const product of products) {
        const productQuery =
          "INSERT INTO products (room_type_id, room_name) VALUES (?,?)";
        const productParams = [roomTypeId, product.room_name];

        const [productResult] = await conn.execute(productQuery, productParams);
        const productId = productResult.insertId;

        for (const bed of product.beds) {
          const bedsQuery =
            "INSERT INTO beds (product_id, bed_number) VALUES (?,?)";
          const bedsParams = [productId, bed];

          await conn.execute(bedsQuery, bedsParams);
        }
      }
      await conn.commit();
      return roomType;
    } catch (e) {
      await conn.rollback();
      throw new Error(
        `An Error occurred trying to save room type: ${e.message}`
      );
    } finally {
      await conn.release();
    }
  }

  // Find RoomType by description
  async findRoomTypeByDescription(propertyId, description) {
    try {
      const query =
        "SELECT * FROM room_types WHERE property_id = ? AND description = ? AND status=1";
      const params = [propertyId, description];

      const [result] = await this.pool.execute(query, params);

      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An Error occurred trying to find a room type by description: ${e.message}`
      );
    }
  }

  // Find all Room types beds.
  async getAllPropertyBeds(propertyId, conn = null) {
    try {
      const query =
        "SELECT beds.id FROM beds JOIN products ON beds.product_id = products.id JOIN room_types ON products.room_type_id = room_types.id WHERE room_types.property_id = ? AND room_types.status=1";
      const params = [propertyId];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.pool.execute(query, params));

      const beds = result.map(r => r.id);

      return beds || [];
    } catch (e) {
      throw new Error(
        `An error occurred getting all property beds. Error: ${e.message}`
      );
    }
  }

  async findAllPropertyRoomTypes(propertyId, conn = null) {
    try {
      const query =
        "SELECT room_types.id AS id, room_types.property_id, room_types.description, room_types.type, room_types.gender, room_types.max_occupancy, room_types.inventory, products.id AS product_id, products.room_name, beds.id AS bed_id FROM room_types LEFT JOIN products ON room_types.id = products.room_type_id LEFT JOIN beds ON products.id = beds.product_id WHERE room_types.property_id = ? AND room_types.status=1 ORDER BY room_types.id, products.id, beds.id";
      const params = [propertyId];

      console.log(params);

      const [result] = await (conn || this.pool).execute(query, params);
      return result || [];
    } catch (e) {
      throw new Error(
        `An Error occurred trying to find all property roomTypes: ${e.message}`
      );
    }
  }

  async findPropertyRoomTypes(propertyId, conn = null) {
    try {
      const query =
        "SELECT room_types.id AS id, room_types.description, room_types.type, room_types.gender, room_types.max_occupancy, room_types.inventory FROM room_types WHERE property_id = ? AND status=1";
      const params = [propertyId];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.pool.execute(query, params));

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred getting all property roomTypes. Error: ${e.message}`
      );
    }
  }

  // Find room type by ID and property ID
  async findRoomTypeById(roomTypeId, propertyId, conn = null) {
    try {
      const query = "SELECT * FROM room_types WHERE id = ? AND property_id = ?";
      const params = [roomTypeId, propertyId];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.pool.execute(query, params));

      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An Error occurred trying to find room type by ID: Error: ${e.message}`
      );
    }
  }

  async getRoomTypeBeds(roomTypeId, conn = null) {
    try {
      const query =
        "SELECT beds.id FROM beds JOIN products ON products.id = beds.product_id WHERE products.room_type_id = ?";
      const params = [roomTypeId];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.pool.execute(query, params));

      const bedsId = result.map(row => row.id);

      return bedsId;
    } catch (e) {
      throw new Error(
        `An Error occurred trying to get all room types beds. Error: ${e.message}`
      );
    }
  }

  async deleteRoomTypeById(id, propertyId) {
    try {
      // NO ELIMINAMOS EL CUARTO LE SETEAMOS EL STATUS A 0 (disable)
      const query =
        "UPDATE room_types SET status = 0 WHERE id = ? AND property_id = ?";
      const params = [id, propertyId];

      const [result] = await this.pool.execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred trying to delete room type. Error: ${e.message}`
      );
    }
  }

  async getUpcomingReservations(roomTypeId, checkIn) {
    try {
      const query =
        "SELECT reservation_rooms.id, reservation_rooms.reservation_id FROM reservation_rooms JOIN reservations ON reservations.id = reservation_rooms.reservation_id WHERE reservations.check_out > ? AND reservation_rooms.room_type_id = ?";
      const params = [checkIn, roomTypeId];

      const [result] = await this.pool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get room types upcoming reservations. Error: ${e.message}`
      );
    }
  }

  async updateRoomTypeById(roomTypeData, propertyId) {
    try {
      const query =
        "UPDATE room_types SET description = ?, gender = ? WHERE id = ? AND property_id = ?";
      const params = [
        roomTypeData.description,
        roomTypeData.gender,
        roomTypeData.id,
        propertyId,
      ];

      const [result] = await this.pool.execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(`An error occurred trying to update room type`);
    }
  }
}
