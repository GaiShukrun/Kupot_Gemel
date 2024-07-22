const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    fundNum: { type: String, required: true, unique: true },
    fundName: { type: String, required: true },
    reportTime: {type:String, require:false},
    sumreportPeriod: {type:String, require:false},
    threeyearsAverage: {type:String, require:false},
    fiveyearsAverage: { type:String, require:false},
    sharpInterest: { type:String, require:false},
    ManagementfeesLastYear: { type:String, require:false},
    deposits: { type:String, require:false},
    assets: { type:String, require:false},
    assetsBalance: {type:String, require:false},
    netAccumulation: {type:String, require:false},
    liquidityIndex: {type:String, require:false},
});

const data = mongoose.model('data', dataSchema);

module.exports = data;

