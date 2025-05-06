export class TaxesAndFeesInputPort {
  constructor(taxesAndFeesService) {
    this.taxesAndFeesService = taxesAndFeesService;
  }

  getTaxesAndFees(propertyId) {
    return this.taxesAndFeesService.getTaxesAndFees(propertyId);
  }

  getTaxesAndFeesSetting(propertyId) {
    return this.taxesAndFeesService.getTaxesAndFeesSetting(propertyId);
  }

  updateTaxesAndFeesSettings(propertyId, data) {
    return this.taxesAndFeesService.updateTaxesAndFeesSettings(
      propertyId,
      data
    );
  }

  addNewTax(propertyId, tax) {
    return this.taxesAndFeesService.addNewTax(propertyId, tax);
  }

  deleteTax(propertyId, taxId) {
    return this.taxesAndFeesService.deleteTax(propertyId, taxId);
  }
}
