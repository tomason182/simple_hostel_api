export class TaxesAndFeesOutputPort {
  constructor(taxesAndFeesRepository) {
    this.taxesAndFeesRepository = taxesAndFeesRepository;
  }

  getTaxesAndFees(propertyId) {
    return this.taxesAndFeesRepository.getTaxesAndFees(propertyId);
  }

  addNewTax(propertyId, tax) {
    return this.taxesAndFeesRepository.addNewTax(propertyId, tax);
  }

  deleteTax(propertyId, taxId) {
    return this.taxesAndFeesRepository.deleteTax(propertyId, taxId);
  }
}
