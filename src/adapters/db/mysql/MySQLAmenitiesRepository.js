export class MySQLAmenitiesRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async getValidAmenities(idList) {
    try {
      if (!Array.isArray(idList)) {
        throw new Error("Parameter is not an Array");
      }
      const placeholders = idList.map(() => "?").join(", ");
      const query = `SELECT id FROM amenities WHERE id IN (${placeholders})`;
      const params = idList;

      const [result] = await this.mysqlPool.execute(query, params);

      return result || [];
    } catch (e) {
      throw new Error(
        `An error occurred getting valid amenities list. Error: ${e.message}`
      );
    }
  }

  async getRoomTypeAmenities(roomId) {
    try {
      const query = "SELECT * FROM room_type_amenities WHERE room_type_id = ?";
      const params = [roomId];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred getting all room types amenities. Error: ${e.message}`
      );
    }
  }

  async insertOrUpdateRoomTypeAmenities(
    roomTypeId,
    amenitiesToAdd,
    amenitiesToRemove
  ) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      if (Array.isArray(amenitiesToRemove) && amenitiesToRemove.length > 0) {
        const deletePlaceholders = amenitiesToRemove.map(() => "?").join(", ");

        const deleteQuery = `DELETE FROM room_type_amenities WHERE room_type_id = ? AND amenity_id IN (${deletePlaceholders})`;
        const deleteParams = [roomTypeId, ...amenitiesToRemove];

        await conn.execute(deleteQuery, deleteParams);
      }

      if (Array.isArray(amenitiesToAdd) && amenitiesToAdd.length > 0) {
        const addPlaceholder = amenitiesToAdd.map(() => "(?, ?)").join(", ");
        const addQuery = `INSERT INTO room_type_amenities (room_type_id, amenity_id) VALUES ${addPlaceholder}`;
        const addParams = amenitiesToAdd.flatMap(amenity => [
          roomTypeId,
          amenity,
        ]);

        await conn.execute(addQuery, addParams);
      }

      await conn.commit();
      return "Room types amenities inserter or updated successfully";
    } catch (e) {
      await conn.rollback();
      throw new Error(
        `An error occurred trying to insert or update amenities to room type. Error: ${e.message}`
      );
    } finally {
      await conn.release();
    }
  }
}
