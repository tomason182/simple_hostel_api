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
}
