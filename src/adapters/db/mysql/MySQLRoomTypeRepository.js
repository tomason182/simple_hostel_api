export class MySQLRoomTypeRepository {
  constructor(mysqlPool) {
    this.pool = mysqlPool;
  }

  async save(roomType, conn) {
    try {
      const roomTypeQuery =
        "INSERT INTO room_type (property_id, description, type, gender, max_occupancy, inventory) VALUES (?,?,?,?,?,?)";
      const roomTypeParams = [
        roomType.getPropertyId(),
        roomType.getDescription(),
        roomType.getType(),
        roomType.getGender(),
        roomType.getMaxOccupancy(),
        roomType.getInventory(),
      ];

      const [result] = await (conn || this.pool).execute(
        roomTypeQuery,
        roomTypeParams
      );

      roomType.setId(result.insertId);

      const products = roomType.getProducts();
      const roomTypeId = roomType.getId();

      for (const product of products) {
        const productQuery =
          "INSERT INTO products (room_type_id, room_name) VALUES (?,?)";
        const productParams = [roomTypeId, product.room_name];

        const [productResult] = await (conn || this.pool).execute(
          productQuery,
          productParams
        );
        const productId = productResult.insertId;

        for (const bed of product.beds) {
          const bedsQuery =
            "INSERT INTO beds (product_id, bed_number) VALUES (?,?)";
          const bedsParams = [productId, bed];

          await (conn || this.pool).execute(bedsQuery, bedsParams);
        }
      }
      return roomType;
    } catch (e) {
      throw new Error(
        `An Error occurred trying to save room type: ${e.message}`
      );
    }
  }
}
