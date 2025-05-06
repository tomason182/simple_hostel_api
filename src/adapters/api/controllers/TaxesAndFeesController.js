import { validationResult, matchedData } from "express-validator";

export class TaxesAndFeesController {
  constructor(taxesAnFeesInputPort) {
    this.taxesAnFeesInputPort = taxesAnFeesInputPort;
  }

  // @desc    Get property taxes
  // @route   GET /api/v2/taxes
  // @access  Private
  getTaxesAndFees = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;

      const result = await this.taxesAnFeesInputPort.getTaxesAndFees(
        propertyId
      );

      if (result.status === "error") {
        return res.status(400).json(result.msg);
      }

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // @desc    Add taxes and fees
  // @route   POST /api/v2/taxes/
  // @access  Private
  addNewTax = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const propertyId = req.user.property_id;
      // tax =  { name: string, type: percentage || fixed, value: number, per: booking || night || guest}
      const tax = matchedData(req);

      const result = await this.taxesAnFeesInputPort.addNewTax(propertyId, tax);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // @desc  Delete tax
  // @route DELETE /api/v2/taxes/:id
  // @access Private
  deleteTax = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const propertyId = req.user.property_id;
      const { id } = matchedData(req);

      const result = await this.taxesAnFeesInputPort.deleteTax(propertyId, id);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
