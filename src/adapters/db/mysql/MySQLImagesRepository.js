export class MySQLImagesRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async getRoomTypeImages(roomId) {
    try {
      const query =
        "SELECT file_name FROM room_type_images WHERE room_type_id = ?";
      const params = [roomId];

      const [result] = await this.mysqlPool(query, params);

      return result || [];
    } catch (e) {
      throw new Error(
        `An error occurred getting room types images. Error: ${e.message}`
      );
    }
  }

  async getPropertyImages(propertyId) {
    try {
      const query =
        "SELECT file_name FROM property_images WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await this.mysqlPool.execute(query, params);

      return result || [];
    } catch (e) {
      throw new Error(
        `An error occurred getting property images. Error: ${e.message}`
      );
    }
  }

  async saveRoomTypesImages(propertyId, roomId, files) {
    try {
      const placeholders = files.map(() => "(?,?,?)").join(", ");
      const query = `INSERT INTO room_type_images (room_type_id, file_name) VALUES ${placeholders}`;
      const params = files.flatMap(file => [propertyId, roomId, file]);

      const [result] = await this.mysqlPool.execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred saving room types images filenames: Error: ${e.message}`
      );
    }
  }

  async savePropertyImages(propertyId, files) {
    try {
      const placeholders = files.map(() => "(?,?)").join(", ");
      const query = `INSERT INTO property_images (property_id, file_name) VALUES ${placeholders}`;
      const params = files.flatMap(file => [propertyId, file]);

      const [result] = await this.mysqlPool.execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      `An error occurred saving property images filenames. Error: ${e.message}`;
    }
  }

  async deleteRoomTypeImage(propertyId, imageId) {
    try {
      const query =
        "DELETE FROM room_type_images WHERE id = ? AND property_id = ?";
      const params = [imageId, propertyId];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred deleting a room type image. Error: ${e.message}`
      );
    }
  }

  async deletePropertyImages(propertyId, imageId) {
    const query =
      "DELETE FROM property_images WHERE id = ? AND property_id = ?";
    const params = [imageId, propertyId];

    const [result] = await this.mysqlPool.execute(query, params);

    return result;
  }
}
