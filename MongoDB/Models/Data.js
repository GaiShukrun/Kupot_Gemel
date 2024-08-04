const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  fundId: { type: Number, required: false }, // מס' הקופה
  fundName: { type: String, required: false }, // שם קופה
  fundClassification: { type: String, required: false }, // סוג קופת גמל: תגמולים ואישית לפיצויים, קרנות השתלמות, מרכזית לפיצויים, מטרה אחרת, קופת גמל להשקעה, קופת גמל להשקעה חיסכון לכל ילד
  controllingCorporation: { type: String, required: false }, // שם תאגיד שולט
  managingCorporation: { type: String, required: false }, // שם חברה מנהלת
  reportPeriod: { type: Number, required: false }, // תקופת הדיווח yyyymm
  inceptionDate: { type: Date, required: false }, // תאריך הקמה
  targetPopulation: { type: String, required: false }, // כלל האוכלוסיה, עובדי סקטור מסויים, עובד מפעל/גוף מסויים, עובדי סקטור מסויים.
  specialization: { type: String, required: false }, // כללי, מניות, אג"ח, מט"ח, שקלי, מדד, חו"ל, ישראל, הלכתי, חכ"מ אחר, מבטיח תשואה, מדרגות, מתמחה אחר, מתמחים באפיקי השקעה סחירים, מתמחים בניהול אקטיבי, עוקבי מדדים, קיימות, שקלי
  subSpecialization: { type: String, required: false }, // כללי: ללא מניות, עד 10% מניות, ממשלתי, פסיבי, כללי. מניות: ישראל, חו"ל, הייטק, פסיבי. אג"ח: ללא מניות, צמוד מדד, קונצרני, טווח קצר, לא צמוד, ממשלתי, סולידי, משולב מניות וכו'. וכו'.
  deposits: { type: Number, required: false }, // הפקדות ללא העברות
  withdrawls: { type: Number, required: false }, // משיכות ללא העברות
  internalTransfers: { type: Number, required: false }, // העברות בין הקופות
  netMonthlyDeposits: { type: Number, required: false }, // צבירה נטו
  totalAssets: { type: Number, required: false }, // יתרת נכסים לסוף תקופה
  avgAnnualManagementFee: { type: Number, required: false }, // שיעור דמי ניהול ממוצעת שנתי – נכסים
  avgDepositFee: { type: Number, required: false }, // שיעור דמי ניהול ממוצעת מהפקדות
  monthlyYield: { type: Number, required: false }, // תשואה חודשית
  yearToDateYield: { type: Number, required: false }, // תשואה מצטברת מתחילת השנה
  yieldTrailing3Yrs: { type: Number, required: false }, // תשואה מצטברת ל-3 שנים עוקבות
  yieldTrailing5Yrs: { type: Number, required: false }, // תשואה מצטברת ל-5 שנים עוקבות
  avgAnnualYieldTrailing3Yrs: { type: Number, required: false }, // תשואה שנתיתי ממוצעת ל-3 שנים עוקבות
  avgAnnualYieldTrailing5Yrs: { type: Number, required: false }, // תשואה שנתית ממוצעת ל-5 שנים עוקבות
  standardDeviation: { type: Number, required: false }, // סטית תקן – 5 שנים עוקבות
  alpha: { type: Number, required: false }, // חישוב אלפא שנתית של תשואות הקופה על סמך התשואה החודשית של 60 החודשים האחרונים
  sharpeRatio: { type: Number, required: false }, // מדד שנתית של תשואות הקופה ביחס למדד ריבית ללא סיכון, על סמך התשואה החודשית של 60 החודשים האחרונים
  liquidAssetsPercent: { type: Number, required: false }, // אחוז הנזילות של נכסי הקופה
  stockMarketExposure: { type: Number, required: false }, // חשיפה למניות
  foreignExposure: { type: Number, required: false }, // חשיפה לחו"ל
  foreignCurrencyExposure: { type: Number, required: false }, // חשיפה למט"ח
  managingCorporationLegalId: { type: Number, required: false }, // ח.פ. של החברה המנהלת
  currentDate: { type: Date, required: false }, // תאריך נוכחי
});

const Fund = mongoose.model('Fund', fundSchema);

module.exports = Fund;