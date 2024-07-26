const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  fundId: { type: Number, required: false },
  fundName: { type: String, required: false },
  fundClassification: { type: String, required: false },
  controllingCorporation: { type: String, required: false },
  managingCorporation: { type: String, required: false },
  reportPeriod: { type: Number, required: false },
  inceptionDate: { type: Date, required: false },
  targetPopulation: { type: String, required: false },
  specialization: { type: String, required: false },
  subSpecialization: { type: String, required: false },
  deposits: { type: Number, required: false },
  withdrawls: { type: Number, required: false },
  internalTransfers: { type: Number, required: false },
  netMonthlyDeposits: { type: Number, required: false },
  totalAssets: { type: Number, required: false },
  avgAnnualManagementFee: { type: Number, required: false },
  avgDepositFee: { type: Number, required: false },
  monthlyYield: { type: Number, required: false },
  yearToDateYield: { type: Number, required: false },
  yieldTrailing3Yrs: { type: Number, required: false },
  yieldTrailing5Yrs: { type: Number, required: false },
  avgAnnualYieldTrailing3Yrs: { type: Number, required: false },
  avgAnnualYieldTrailing5Yrs: { type: Number, required: false },
  standardDeviation: { type: Number, required: false },
  alpha: { type: Number, required: false },
  sharpeRatio: { type: Number, required: false },
  liquidAssetsPercent: { type: Number, required: false },
  stockMarketExposure: { type: Number, required: false },
  foreignExposure: { type: Number, required: false },
  foreignCurrencyExposure: { type: Number, required: false },
  managingCorporationLegalId: { type: Number, required: false },
  currentDate: { type: Date, required: false },
});

const Fund = mongoose.model('Fund', fundSchema);

module.exports = Fund;