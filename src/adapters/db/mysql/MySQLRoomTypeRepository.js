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
  async findRoomTypeByDescription(description) {
    try {
      const query = "SELECT * FROM room_types WHERE description = ?";
      const params = [description];

      const [result] = await this.pool.execute(query, params);

      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An Error occurred trying to find a room type by description: ${e.message}`
      );
    }
  }

  // Find all room types by property ID
  async findAllPropertyRoomTypes(propertyId, conn = null) {
    try {
      const query =
        "SELECT room_types.id as id, room_types.property_id, room_types.description, room_types.type, room_types.gender, room_types.max_occupancy, room_types.inventory, products.id as product_id, products.room_name, beds.bed_number FROM room_types JOIN products ON products.room_type_id = room_types.id JOIN beds ON beds.product_id = products.id WHERE room_types.property_id = ?";
      const params = [propertyId];

      const [result] = await (conn || this.pool).execute(query, params);
      return result || [];
    } catch (e) {
      throw new Error(
        `An Error occurred trying to find all property roomTypes: ${e.message}`
      );
    }
  }

  // Find room type by ID and property ID
  async findRoomTypeById(roomTypeId, propertyId, conn = null) {
    try {
      const query =
        "SELECT id FROM room_types WHERE id = ? AND property_id = ?";
      const params = [roomTypeId, propertyId];

      const [result] = await (conn || this.pool).execute(query, params);

      return result || null;
    } catch (e) {
      throw new Error(`An Error occurred trying to find room type by ID`);
    }
  }
}
