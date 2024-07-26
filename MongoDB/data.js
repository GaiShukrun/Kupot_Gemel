const mongoose = require('mongoose');
const fetch = require('node-fetch');
const Fund = require('./Models/Data');
const url = 'https://data.gov.il/api/3/action/datastore_search?resource_id=a30dcbea-a1d2-482c-ae29-8f781f5025fb';
const uri = 'mongodb+srv://gaish:Gai%210524031660@cluster0.dcr3ai0.mongodb.net/test';

const connectDB = async () => {
    await mongoose.connect(uri);
};

const fetchData = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        return data.result.records;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
const insertData = async (data) => {
        const mapedData = data.map(item => ({
          fundId: item.FUND_ID,
          fundName: item.FUND_NAME,
          fundClassification: item.FUND_CLASSIFICATION,
          controllingCorporation: item.CONTROLLING_CORPORATION,
          managingCorporation: item.MANAGING_CORPORATION,
          reportPeriod: item.REPORT_PERIOD,
          inceptionDate: new Date(item.INCEPTION_DATE), 
          targetPopulation: item.TARGET_POPULATION,
          specialization: item.SPECIALIZATION,
          subSpecialization: item.SUB_SPECIALIZATION,
          deposits: item.DEPOSITS,
          withdrawls: item.WITHDRAWLS,
          internalTransfers: item.INTERNAL_TRANSFERS,
          netMonthlyDeposits: item.NET_MONTHLY_DEPOSITS,
          totalAssets: item.TOTAL_ASSETS,
          avgAnnualManagementFee: item.AVG_ANNUAL_MANAGEMENT_FEE,
          avgDepositFee: item.AVG_DEPOSIT_FEE,
          monthlyYield: item.MONTHLY_YIELD,
          yearToDateYield: item.YEAR_TO_DATE_YIELD,
          yieldTrailing3Yrs: item.YIELD_TRAILING_3_YRS,
          yieldTrailing5Yrs: item.YIELD_TRAILING_5_YRS,
          avgAnnualYieldTrailing3Yrs: item.AVG_ANNUAL_YIELD_TRAILING_3YRS,
          avgAnnualYieldTrailing5Yrs: item.AVG_ANNUAL_YIELD_TRAILING_5YRS,
          standardDeviation: item.STANDARD_DEVIATION,
          alpha: item.ALPHA,
          sharpeRatio: item.SHARPE_RATIO,
          liquidAssetsPercent: item.LIQUID_ASSETS_PERCENT,
          stockMarketExposure: item.STOCK_MARKET_EXPOSURE,
          foreignExposure: item.FOREIGN_EXPOSURE,
          foreignCurrencyExposure: item.FOREIGN_CURRENCY_EXPOSURE,
          managingCorporationLegalId: item.MANAGING_CORPORATION_LEGAL_ID,
          currentDate: new Date(item.CURRENT_DATE) // Convert to Date object
        }));
    for (const item of mapedData) {
        const fund = new Fund(item);
        await fund.save();
    }
};

const main = async () => {
    await connectDB();
    const data = await fetchData();
    await insertData(data);
    mongoose.connection.close();
};

main().catch(console.error);