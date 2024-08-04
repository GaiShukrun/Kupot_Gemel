const mongoose = require('mongoose');

const fundAnalyticsSchema = new mongoose.Schema({
    fundId: String,
    fundName: String,
    fundClassification: String,
    controllingCorporation: String,
    totalAssets: Number,
    inceptionDate: Date,
    targetPopulation: String,
    specialization: String,
    subSpecialization: String,
    avgAnnualManagementFee: Number,
    avgDepositFee: Number,
    standardDeviation: Number,
    alpha: Number,
    sharpeRatio: Number,
    historicalData: [{
      reportPeriod: Number,
      monthlyYield: Number,
      yearToDateYield: Number,
      yieldTrailing3Yrs: Number,
      yieldTrailing5Yrs: Number,
      totalAssets: Number,
      liquidAssetsPercent: Number,
      stockMarketExposure: Number,
      foreignExposure: Number,
      foreignCurrencyExposure: Number
    }]
  });
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: {type:String, require:true},
    lastname: {type:String, require:true},
    securityQuestion: {type:String, require:true},
    securityAnswer: { type:String, require:true},
    role: { type: String, enum: ['user', 'admin','tech'], default: 'user'},
    favoriteFunds: [fundAnalyticsSchema]

});

const User = mongoose.model('User', userSchema);

module.exports = User;

