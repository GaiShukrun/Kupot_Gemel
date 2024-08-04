const Fund = require('../Models/Data');

function scoreFund(fund, userAnswers) {
  const allValues = Array.from(userAnswers.values());
  let question;
  let score = 0;
  // Age range (Question 1)
  // const ageRange = userAnswers[1];
  // if (ageRange === "א. 18-25" && fund.targetPopulation.includes("פנסיונרים")) {
  //   score += 10;
  // }

  // fundClassification (Question 2)
  question = 2;
  const fundClassification = allValues[question-1];
  if (fundClassification === "כל הקופות") { // no score
  } else if (fundClassification === "תגמולים ואישית לפיצויים" && fund.fundClassification === "תגמולים ואישית לפיצויים") {
    score += 450;
  } else if (fundClassification === "קרנות השתלמות" && fund.fundClassification === "קרנות השתלמות") {
    score += 450;
  } else if (fundClassification === "קופת גמל להשקעה" && fund.fundClassification === "קופת גמל להשקעה") {
    score += 450;
  } else if (fundClassification === "קופת גמל להשקעה - חסכון לילד" && fund.fundClassification === "קופת גמל להשקעה - חסכון לילד") {
    score += 450;
  } else if (fundClassification === "מרכזית לפיצויים" && fund.fundClassification === "מרכזית לפיצויים") {
    score += 450;
  } else if (fundClassification === "מטרה אחרת" && fund.fundClassification === "מטרה אחרת") {
    score += 450;
  }





  // Specific Sector (Question 3)
  question = 3;
  const targetPopulation = allValues[question-1];
  if (targetPopulation === "לא" && fund.targetPopulation === "כלל האוכלוסיה") {
    score += 1000;
  } else if (targetPopulation === "כן, עובד סקטור מסויים" && fund.targetPopulation === "עובדי סקטור מסויים") {
    score += 1000;
  } else if (targetPopulation === "כן, עובד מפעל/גוף מסויים" && fund.targetPopulation === "עובדי מפעל/גוף מסויים") {
    score += 1000;
  }

  // Specialization (Question 4)
  question = 4;
  const specialization = allValues[question-1];
  if (specialization === "אין העדפה") { // no score
  } else if (specialization === "אג\"ח" && fund.specialization === "אג\"ח") {
    score += 250;
  } else if (specialization === "הלכתי" && fund.specialization === "הלכתי") {
    score += 250;
  } else if (specialization === "חו\"ל" && fund.specialization === "חו\"ל") {
    score += 250;
  } else if (specialization === "ישראל" && fund.specialization === "ישראל") {
    score += 250;
  } else if (specialization === "כללי" && fund.specialization === "כללי") {
    score += 250;
  } else if (specialization === "ללא סיווג" && fund.specialization === "ללא סיווג") {
    score += 250;
  } else if (specialization === "מבטיח תשואה" && fund.specialization === "מבטיח תשואה") {
    score += 250;
  } else if (specialization === "מדד" && fund.specialization === "מדד") {
    score += 250;
  } else if (specialization === "מדרגות" && fund.specialization === "מדרגות") {
    score += 250;
  } else if (specialization === "מודל חכ\"מ אחר" && fund.specialization === "מודל חכ\"מ אחר") {
    score += 250;
  } else if (specialization === "מניות" && fund.specialization === "מניות") {
    score += 250;
  } else if (specialization === "מתמחה אחר" && fund.specialization === "מתמחה אחר") {
    score += 250;
  } else if (specialization === "מתמחים באפיקי השקעה סחירים" && fund.specialization === "מתמחים באפיקי השקעה סחירים") {
    score += 250;
  } else if (specialization === "מתמחים בניהול אקטיבי" && fund.specialization === "מתמחים בניהול אקטיבי") {
    score += 250;
  } else if (specialization === "עוקבי מדדים" && fund.specialization === "עוקבי מדדים") {
    score += 250;
  } else if (specialization === "קיימות" && fund.specialization === "קיימות") {
    score += 250;
  } else if (specialization === "שקלי" && fund.specialization === "שקלי") {
    score += 250;
  }
  

  // SubSpecialization (Question 5)
  question = 5;
  const subSpecialization = allValues[question-1];
  if (subSpecialization === "אין העדפה") { // no score
  } else if (subSpecialization === "50-60" && fund.subSpecialization === "50-60") {
    score += 200;
  } else if (subSpecialization === "60 ומעלה" && fund.subSpecialization === "60 ומעלה") {
    score += 200;
  } else if (subSpecialization === "אג\"ח" && fund.subSpecialization === "אג\"ח") {
    score += 200;
  } else if (subSpecialization === "אג\"ח ישראל" && fund.subSpecialization === "אג\"ח ישראל") {
    score += 200;
  } else if (subSpecialization === "אג\"ח לא צמוד" && fund.subSpecialization === "אג\"ח לא צמוד") {
    score += 200;
  } else if (subSpecialization === "אג\"ח ללא מניות" && fund.subSpecialization === "אג\"ח ללא מניות") {
    score += 200;
  } else if (subSpecialization === "אג\"ח ממשלות" && fund.subSpecialization === "אג\"ח ממשלות") {
    score += 200;
  } else if (subSpecialization === "אג\"ח ממשלתי" && fund.subSpecialization === "אג\"ח ממשלתי") {
    score += 200;
  } else if (subSpecialization === "אג\"ח סחיר" && fund.subSpecialization === "אג\"ח סחיר") {
    score += 200;
  } else if (subSpecialization === "אג\"ח צמוד מדד" && fund.subSpecialization === "אג\"ח צמוד מדד") {
    score += 200;
  } else if (subSpecialization === "אג\"ח צמוד מדד בינוני" && fund.subSpecialization === "אג\"ח צמוד מדד בינוני") {
    score += 200;
  } else if (subSpecialization === "אג\"ח קונצרניות" && fund.subSpecialization === "אג\"ח קונצרניות") {
    score += 200;
  } else if (subSpecialization === "אוכלוסיית יעד" && fund.subSpecialization === "אוכלוסיית יעד") {
    score += 200;
  } else if (subSpecialization === "אשראי ואג\"ח" && fund.subSpecialization === "אשראי ואג\"ח") {
    score += 200;
  } else if (subSpecialization === "הלכה איסלאמית" && fund.subSpecialization === "הלכה איסלאמית") {
    score += 200;
  } else if (subSpecialization === "הלכה יהודית" && fund.subSpecialization === "הלכה יהודית") {
    score += 200;
  } else if (subSpecialization === "חו\"ל" && fund.subSpecialization === "חו\"ל") {
    score += 200;
  } else if (subSpecialization === "חיסכון לילד -חוסכים המעדיפים סיכון בינוני" && fund.subSpecialization === "חיסכון לילד -חוסכים המעדיפים סיכון בינוני") {
    score += 200;
  } else if (subSpecialization === "חיסכון לילד -חוסכים המעדיפים סיכון גבוה" && fund.subSpecialization === "חיסכון לילד -חוסכים המעדיפים סיכון גבוה") {
    score += 200;
  } else if (subSpecialization === "חיסכון לילד -חוסכים המעדיפים סיכון מועט" && fund.subSpecialization === "חיסכון לילד -חוסכים המעדיפים סיכון מועט") {
    score += 200;
  } else if (subSpecialization === "טווח קצר" && fund.subSpecialization === "טווח קצר") {
    score += 200;
  } else if (subSpecialization === "ישראל" && fund.subSpecialization === "ישראל") {
    score += 200;
  } else if (subSpecialization === "כללי" && fund.subSpecialization === "כללי") {
    score += 200;
  } else if (subSpecialization === "כספי (שקלי)" && fund.subSpecialization === "כספי (שקלי)") {
    score += 200;
  } else if (subSpecialization === "כספית" && fund.subSpecialization === "כספית") {
    score += 200;
  } else if (subSpecialization === "ללא מניות" && fund.subSpecialization === "ללא מניות") {
    score += 200;
  } else if (subSpecialization === "מבטיח תשואה" && fund.subSpecialization === "מבטיח תשואה") {
    score += 200;
  } else if (subSpecialization === "מדד" && fund.subSpecialization === "מדד") {
    score += 200;
  } else if (subSpecialization === "מדד ללא מניות" && fund.subSpecialization === "מדד ללא מניות") {
    score += 200;
  } else if (subSpecialization === "ממשלתי" && fund.subSpecialization === "ממשלתי") {
    score += 200;
  } else if (subSpecialization === "מניות" && fund.subSpecialization === "מניות") {
    score += 200;
  } else if (subSpecialization === "מניות ישראל" && fund.subSpecialization === "מניות ישראל") {
    score += 200;
  } else if (subSpecialization === "מניות סחיר" && fund.subSpecialization === "מניות סחיר") {
    score += 200;
  } else if (subSpecialization === "משולב במניות - פאסיבי" && fund.subSpecialization === "משולב במניות - פאסיבי") {
    score += 200;
  } else if (subSpecialization === "משולב מניות" && fund.subSpecialization === "משולב מניות") {
    score += 200;
  } else if (subSpecialization === "משולב סחיר" && fund.subSpecialization === "משולב סחיר") {
    score += 200;
  } else if (subSpecialization === "עד 10% מניות" && fund.subSpecialization === "עד 10% מניות") {
    score += 200;
  } else if (subSpecialization === "עד 50" && fund.subSpecialization === "עד 50") {
    score += 200;
  } else if (subSpecialization === "עוקב מדד s&p 500" && fund.subSpecialization === "עוקב מדד s&p 500") {
    score += 200;
  } else if (subSpecialization === "עוקבי מדד אג\"ח" && fund.subSpecialization === "עוקבי מדד אג\"ח") {
    score += 200;
  } else if (subSpecialization === "עוקבי מדדים - גמיש" && fund.subSpecialization === "עוקבי מדדים - גמיש") {
    score += 200;
  } else if (subSpecialization === "עוקבי מדדים גמיש" && fund.subSpecialization === "עוקבי מדדים גמיש") {
    score += 200;
  } else if (subSpecialization === "עוקב מדדי מניות" && fund.subSpecialization === "עוקב מדדי מניות") {
    score += 200;
  } else if (subSpecialization === "פאסיבי" && fund.subSpecialization === "פאסיבי") {
    score += 200;
  } else if (subSpecialization === "קיימות" && fund.subSpecialization === "קיימות") {
    score += 200;
  } else if (subSpecialization === "שקלי" && fund.subSpecialization === "שקלי") {
    score += 200;
  } else if (subSpecialization === "שקלי טווח קצר" && fund.subSpecialization === "שקלי טווח קצר") {
    score += 200;
  }



  // yearToDateYield (Question 7)
  question = 7;
  const yearToDateYield = allValues[question-1];
  if (yearToDateYield === "כן" && fund.yearToDateYield) {
    score += fund.yearToDateYield * 100;
  }

  // yieldTrailing3Yrs (Question 8)
  question = 8;
  const yieldTrailing3Yrs = allValues[question-1];
  if (yieldTrailing3Yrs === "כן" && fund.yieldTrailing3Yrs) {
    score += fund.yieldTrailing3Yrs * 100;
  }

  // yieldTrailing5Yrs (Question 9)
  question = 9;
  const yieldTrailing5Yrs = allValues[question-1];
  if (yieldTrailing5Yrs === "כן" && fund.yieldTrailing5Yrs) {
    score += fund.yieldTrailing5Yrs * 100;
  }






  
  return score.toFixed(2);
  }
  

  async function getBestFunds(userAnswers) {
    const allFunds = await Fund.find({});
    
    const scoredFunds = allFunds.map(fund => ({
      ...fund.toObject(),
      score: scoreFund(fund, userAnswers)
    }));
  
    scoredFunds.sort((a, b) => b.score - a.score);

    const uniqueFunds = [];
    const seenFundNames = new Set();

    for (const fund of scoredFunds) {
        if (!seenFundNames.has(fund.fundName)) {
            uniqueFunds.push(fund);
            seenFundNames.add(fund.fundName);
        }

        if (uniqueFunds.length === 3) {
            break;
        }
    }
    return uniqueFunds;
  }

module.exports = {
  getBestFunds
};