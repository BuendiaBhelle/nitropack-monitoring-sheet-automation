const {google} = require("googleapis");
const {Builder, By, Key, util} = require("selenium-webdriver");
require('dotenv').config();
const config = require("./config");

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});

const spreadsheetId = process.env.SPREADSHEETID;
let output = config.output;
let strTime = config.strTime;
let site_ids = config.site_ids;
let urls = config.urls;
let ranges_other = config.ranges_other;
let pagespeed_url = config.pagespeed_url;
let ranges_mobile = config.ranges_mobile;
let ranges_desktop = config.ranges_desktop;
let sheet_names = config.sheet_names;

async function insertRow() {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client })

    // add rows to sheet
    try {
        for (let index = 0; index < site_ids.length; index++) {
            let requests = [{
                insertRange: {
                    range: {
                        sheetId: site_ids[index],
                        startRowIndex: 3,
                        endRowIndex: 4,
                        startColumnIndex: 0,
                    },
                    shiftDimension: "ROWS"
                }
            }];
    
            const batchUpdateRequest = {requests};
    
            await googleSheets.spreadsheets.batchUpdate({
                auth,
                spreadsheetId,
                resource: batchUpdateRequest,
                }, (err, response) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(site_ids[index]);
                }
            });
        }  
    } catch (error) {
        console.log(error);
    }

    console.log("add rows");
}

async function listTestDetails() {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client })
    
    // list other test details
    try {
        for (let index = 0; index < urls.length; index++) {
            let values = [
                [
                    urls[index],
                    output,
                    strTime
                ],
            ];
    
            const resource = {
                values,
            };
    
            const range = ranges_other[index];
    
            await googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: range,
                valueInputOption: "RAW",
                resource: resource
            });
            console.log(range);
        }
    } catch (error) {
        console.log(error);
    }

    console.log("other details");
}

async function mobileScore() {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client })

    const driver = await new Builder().forBrowser("chrome").build();
    
    for (let index = 0; index < urls.length; index++) {
        const range = ranges_mobile[index];
  
        // get desktop score
        try {
            await driver.get(pagespeed_url);
            await driver.findElement(By.name("url")).sendKeys(urls[index], Key.RETURN);
            let current_page_url = await driver.getCurrentUrl();
            await driver.get(current_page_url + "&form_factor=mobile");
            await driver.sleep(30000);
    
            let loading = await driver.executeScript("return document.getElementsByClassName('VfPpkd-JGcpL-IdXvz-LkdAo-Bd00G')[0]");
            if (loading) {
                await driver.sleep(20000);
            }
    
            let score = await driver.executeScript("return document.getElementsByClassName('lh-gauge__percentage')[0].innerText");
            var scoreFin = Number(score);
            console.log(scoreFin);
        } catch (error) {
            console.log(error);
        }


        let values = [
            [
                scoreFin
            ],
        ];

        const resource = {
            values,
        };

        // write the scores to sheet
        try {
            await googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: range,
                valueInputOption: "RAW",
                resource: resource
            });
            console.log(range);
        } catch (error) {
            console.log(error);
        }

        await driver.switchTo().newWindow('tab');
    }

    console.log("mobile");
}

async function desktopScore() {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client })
    const driver = await new Builder().forBrowser("chrome").build();
    
    for (let index = 0; index < urls.length; index++) {
        const range = ranges_desktop[index];
  
        // get desktop score
        try {
            await driver.get(pagespeed_url);
            await driver.findElement(By.name("url")).sendKeys(urls[index], Key.RETURN);
            let current_page_url = await driver.getCurrentUrl();
            await driver.get(current_page_url + "&form_factor=desktop");
            await driver.sleep(30000);
    
            let loading = await driver.executeScript("return document.getElementsByClassName('VfPpkd-JGcpL-IdXvz-LkdAo-Bd00G')[0]");
            if (loading) {
                await driver.sleep(20000);
            }
    
            let score = await driver.executeScript("return document.getElementsByClassName('lh-gauge__percentage')[1].innerText");
            var scoreFin = Number(score);
            console.log(scoreFin);
        } catch (error) {
            console.log(error);
        }


        let values = [
            [
                scoreFin
            ],
        ];

        const resource = {
            values,
        };

        // write the scores to sheet
        try {
            await googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: range,
                valueInputOption: "RAW",
                resource: resource
            });
            console.log(range);
        } catch (error) {
            console.log(error);
        }

        await driver.switchTo().newWindow('tab');
    }

    console.log("desktop");
}

async function displayFails() {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const getPageSpeedScoreLignans = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Lignans!D4:E4",
    });

    const lignansDesktop = getPageSpeedScoreLignans.data.values[0][0];
    const lignansMobile = getPageSpeedScoreLignans.data.values[0][1];

    if ((lignansMobile < 30) || (lignansDesktop < 30)) {
        console.log("INCLUDE LIGNANS.");
    } else {
        console.log("DO NOT INCLUDE LIGNANS.");
    }

    // Read PageSpeed Scores from google sheet
    try {
        console.log("Nitropack fails (" + config.output + "):");
        for (let index = 0; index < sheet_names.length; index++) {
            const getPageSpeedScore = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: sheet_names[index] + "!D4:E4",
            });
    
            const data_desktop = getPageSpeedScore.data.values[0][0];
            const data_mobile = getPageSpeedScore.data.values[0][1];

            if (data_mobile <= 49) {
                console.log("   * " + sheet_names[index]);
                if (data_desktop <= 49) {
                    console.log("     - Desktop: " + data_desktop);
                }
                console.log("     - Mobile: " + data_mobile);
            }
            else if (data_desktop <= 49) {
                console.log("   * " + sheet_names[index]);
                console.log("     - Desktop: " + data_desktop);
                if (data_mobile <= 49) {
                    console.log("     - Mobile: " + data_mobile);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

    console.log("fails");
}



module.exports = {
    insertRow,
    listTestDetails,
    mobileScore,
    desktopScore,
    displayFails
}