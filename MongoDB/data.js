const mongoose = require('mongoose');
const Fund = require('./Models/Data');
const puppeteer = require('puppeteer');

const uri = 'mongodb+srv://gaish:Gai%210524031660@cluster0.dcr3ai0.mongodb.net/test';

const connectDB = async () => {
    await mongoose.connect(uri);
};

const scrapeData = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://gemelnet.cma.gov.il/views/dafmakdim.aspx', { waitUntil: 'networkidle2' });

    // Click the element at /html/body/section/form/table/tbody/tr[4]/td[2]/input
    await page.waitForSelector('#knisa', { visible: true });
    await page.click('#knisa');

    // Wait for the dropdown to be available
    await page.waitForSelector('#selActiveKupot', { visible: true });

    // Log the options to check if "All Funds" is available
    const options = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#selActiveKupot option')).map(option => ({
            text: option.textContent,
            value: option.value
        }));
    });


    // Select "All Funds" if available
    await page.evaluate(() => {
        const selectElement = document.querySelector('#selActiveKupot');
        const allFundsOption = Array.from(selectElement.options).find(option => option.text.includes('כל הקופות'));
        if (allFundsOption) {
            selectElement.value = allFundsOption.value;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            throw new Error('All Funds option not found');
        }
    });

    // Select "שנה אחרונה"
    await page.waitForSelector('#rbTkufa12', { visible: true });
    await page.click('#rbTkufa12');

    // Click the "הצג דוח" button
    await page.waitForSelector('#cbDisplay', { visible: true, timeout: 60000 });
    await page.waitForFunction(() => {
        const button = document.querySelector('#cbDisplay');
        return button && button.offsetParent !== null && !button.disabled;
    }, { timeout: 60000 });

    // Wait for the results to load
    await page.waitForSelector('#divTsuot > table > tbody > tr > td:nth-child(2)', { visible: true, timeout: 60000 });

    console.log('im here');
    // Extract the data
    const data = await page.evaluate(() => {
        const rows = document.querySelectorAll('#P58c03791ed6d407089ee741cdff9e870_2_oReportCell > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td:nth-child(3) > table > tbody');
        console.log(rows);
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return {
                fundNum: columns[0].innerText,
                fundName: columns[1].innerText,
                reportTime: columns[2].innerText,
                sumreportPeriod: columns[3].innerText,
                threeyearsAverage: columns[4].innerText,
                fiveyearsAverage: columns[5].innerText,
                sharpInterest: columns[6].innerText,
                ManagementfeesLastYear: columns[7].innerText,
                deposits: columns[8].innerText,
                assets: columns[9].innerText,
                assetsBalance: columns[10].innerText,
                netAccumulation: columns[11].innerText,
                liquidityIndex: columns[12].innerText
            };
        });
    });

    await browser.close();
    return data;
};

const insertData = async (data) => {
    for (const item of data) {
        const existingRecord = await Fund.findOne({ reportTime: item.reportTime });
        if (!existingRecord) {
            const fund = new Fund(item);
            await fund.save();
        }
    }
};

module.exports = { scrapeData, insertData, connectDB };

const main = async () => {
    await connectDB();
    const data = await scrapeData();
    //await insertData(data);
    mongoose.connection.close();
};

main().catch(console.error);
