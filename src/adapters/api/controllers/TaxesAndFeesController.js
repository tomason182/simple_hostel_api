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

      return res.status(200).json(result.msg);
    } catch (err) {
      next(err);
    }
  };

  // @desc    Get property taxes and fees settings
  // @route   GET /api/v2/taxes/settings
  // @access  Private
  getTaxesAndFeesSettings = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;

      const result = await this.taxesAnFeesInputPort.getTaxesAndFeesSetting(
        propertyId
      );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // @desc    Update property taxes and fees settings
  // @route   PUT /api/v2/taxes/settings
  // @access  Private
  updateTaxesAndFeesSetting = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      // data = {embedded = true || embedded = false }
      const data = matchedData(req);

      const result = await this.taxesAnFeesInputPort.updateTaxesAndFeesSettings(
        embedded
      );

      if (result.status === "error") {
        return res.status(400).json(result);
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

      const tax = matchedData(req);

      console.log(tax);

      return res.status(200).json("ok");
    } catch (err) {
      next(err);
    }
  };
}
