export class TaxesAndFeesInputPort {
  constructor(taxesAndFeesService) {
    this.taxesAndFeesService = taxesAndFeesService;
  }

  getTaxesAndFees(propertyId) {
    return this.taxesAndFeesService.getTaxesAndFees(propertyId);
  }

  addNewTax(propertyId, tax) {
    return this.taxesAndFeesService.addNewTax(propertyId, tax);
  }

  deleteTax(propertyId, taxId) {
    return this.taxesAndFeesService.deleteTax(propertyId, taxId);
  }
}
