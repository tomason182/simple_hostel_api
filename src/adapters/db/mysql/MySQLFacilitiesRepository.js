export class MySQLFacilitiesRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async getPropertyFacilities(propertyId) {
    try {
      const query = "SELECT * FROM property_facilities WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await this.mysqlPool.execute(query, params);

      return result || [];
    } catch (e) {
      throw new Error(
        `An error occurred getting all property facilities. Error: ${e.message}`
      );
    }
  }

  async insertOrUpdateFacilities(
    propertyId,
    facilitiesToAdd,
    facilitiesToRemove
  ) {
    let conn;
    try {
      conn = await this.mysqlPool.getConnection();
      await conn.beginTransaction();

      if (Array.isArray(facilitiesToRemove) && facilitiesToRemove.length > 0) {
        const deletePlaceholders = facilitiesToRemove.map(() => "?").join(", ");
        const deleteQuery = `DELETE FROM property_facilities WHERE property_id = ? AND facility_id IN (${deletePlaceholders})`;
        const deleteParams = [propertyId, ...facilitiesToRemove];

        await conn.execute(deleteQuery, deleteParams);
      }

      if (Array.isArray(facilitiesToAdd) && facilitiesToAdd.length > 0) {
        const addPlaceholder = facilitiesToAdd.map(() => "(?, ?)").join(", ");
        const addQuery = `INSERT INTO property_facilities (property_id, facility_id) VALUES ${addPlaceholder}`;
        const addParams = facilitiesToAdd.flatMap(facility => [
          propertyId,
          facility,
        ]);

        await conn.execute(addQuery, addParams);
      }

      await conn.commit();
      return "Property facilities updated successfully";
    } catch (e) {
      if (conn) await conn.rollback();
      throw new Error(
        `An error occurred updating property facilities. Error: ${e.message}`
      );
    } finally {
      if (conn) await conn.release();
    }
  }
}
