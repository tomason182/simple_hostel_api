export class MySQLTaxesAndFeesRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async getTaxesAndFees(propertyId) {
    try {
      const query = "SELECT * FROM taxes_and_fees WHERE property_id = ?";
      const params = [propertyId];

      const [result] = await this.mysqlPool.execute(query, params);

      return result || [];
    } catch (err) {
      throw new Error(`Unable to get property taxes. Error: ${err.message}`);
    }
  }

  async addNewTax(propertyId, tax) {
    try {
      const query =
        "INSERT INTO taxes_and_fees (property_id, name, type, value, per) VALUES (?,?,?,?,?)";
      const params = [
        propertyId,
        tax.name,
        tax.type,
        tax.value,
        tax.per || null,
      ];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (err) {
      throw new Error(`Unable to add new tax. Error: ${err.message}`);
    }
  }

  async deleteTax(propertyId, taxId) {
    try {
      const query =
        "DELETE FROM taxes_and_fees WHERE id = ? AND property_id = ?";
      const params = [taxId, propertyId];

      const [result] = await this.mysqlPool.execute(query, params);
    } catch (err) {
      throw new Error(`Unable to delete tax. Error: ${err.message}`);
    }
  }
}
