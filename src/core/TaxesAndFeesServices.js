export class TaxesAndFeesService {
  constructor(taxesAndFeesOutputPort) {
    this.taxesAndFeesOutputPort = taxesAndFeesOutputPort;
  }

  async getTaxesAndFees(propertyId) {
    try {
      const taxes = await this.taxesAndFeesOutputPort.getTaxesAndFees(
        propertyId
      );

      // If taxes = [] => Taxes are included in rate.

      return {
        status: "ok",
        msg: taxes,
      };
    } catch (err) {
      throw err;
    }
  }

  async addNewTax(propertyId, tax) {
    try {
      const result = await this.taxesAndFeesOutputPort.addNewTax(
        propertyId,
        tax
      );

      console.log(result);

      return {
        status: "ok",
        msg: result,
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteTax(propertyId, taxId) {
    try {
      const result = await this.taxesAndFeesOutputPort.deleteTax(
        propertyId,
        taxId
      );

      return {
        status: "ok",
        msg: result,
      };
    } catch (err) {
      throw err;
    }
  }
}
