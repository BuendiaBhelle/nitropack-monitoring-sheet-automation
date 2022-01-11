const {google} = require("googleapis");
const {Builder, By, Key, util} = require("selenium-webdriver");
require('dotenv').config();

async function writeToGoogleSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client })
    const spreadsheetId = process.env.SPREADSHEETID;

    const monthNames = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
    const dateObj = new Date();
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = month  + "/" + day  + '/' + year;
    
    var hours = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    const urls = [
        "https://www.collisioncenternorthscottsdale.com/",
        "https://www.sunrisejewelryusa.com/",
        "https://www.americanleatherusa.com/",
        "https://www.primeview.com/",
        "https://www.biltmoreloanandjewelry.com/",
        "https://www.lignans.net/",
        "https://www.newhopemedicalcenter.com/",
        "https://www.freddabranyon.com/",
        "https://www.everythingjustrocks.com/",
    ]
    
    for (let j = 0; j < urls.length; j++) {
        let ranges = [
            "ACC!A4:C4",
            "SJ!A4:C4",
            "AL!A4:C4",
            "PV!A4:C4",
            "BLJ!A4:C4",
            "Lignans!A4:C4",
            "NHU!A4:C4",
            "Fredda Branyon!A4:C4",
            "EJR!A4:C4",
        ]

        let values = [
            [
                urls[j],
                output,
                strTime
            ],
        ];

        const resource = {
            values,
        };

        const range = ranges[j];

        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: range,
            valueInputOption: "RAW",
            resource: resource
        });
        console.log(range);
    }
}
writeToGoogleSheets();


async function monitoringNitropack() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client })
    const spreadsheetId = process.env.SPREADSHEETID;

    let driver = await new Builder().forBrowser("chrome").build();
    
    const urls = [
        "https://www.collisioncenternorthscottsdale.com/",
        "https://www.sunrisejewelryusa.com/",
        "https://www.americanleatherusa.com/",
        "https://www.primeview.com/",
        "https://www.biltmoreloanandjewelry.com/",
        "https://www.lignans.net/",
        "https://www.newhopemedicalcenter.com/",
        "https://www.freddabranyon.com/",
        "https://www.everythingjustrocks.com/",
    ]

    for (let index = 0; index < urls.length; index++) {
        await driver.get("https://developers.google.com/speed/pagespeed/insights/");
        await driver.findElement(By.name("url")).sendKeys(urls[index], Key.RETURN);
        
        await driver.sleep(40000);

        await driver.executeScript("return document.getElementsByClassName('VfPpkd-YVzG2b')[0].click()");

        const score_length = await driver.executeScript("return document.getElementsByClassName('lh-gauge__percentage').length");

        console.log("IN DESKTOP.");

        console.log(urls[index]);

        for (let i = 0; i < score_length; i++) {
            const score_desktop = await driver.executeScript("return document.getElementsByClassName('lh-gauge__percentage')[" + i + "].innerText");
            
            if (score_desktop != "") {
                console.log("Desktop: " + score_desktop);

                let ranges_desktop = [
                    "ACC!D4",
                    "SJ!D4",
                    "AL!D4",
                    "PV!D4",
                    "BLJ!D4",
                    "Lignans!D4",
                    "NHU!D4",
                    "Fredda Branyon!D4",
                    "EJR!D4",
                ]

                let values = [
                    [
                        score_desktop
                    ],
                ];
            
                const resource_desktop = {
                    values,
                };

                const range_desktop = ranges_desktop[index];
            
                await googleSheets.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: range_desktop,
                    valueInputOption: "USER_ENTERED",
                    resource: resource_desktop
                });               
            }
        }

        await driver.sleep(10000);

        await driver.executeScript("return document.getElementsByClassName('VfPpkd-YVzG2b')[1].click()");

        console.log("IN MOBILE.");

        console.log(urls[index]);

        for (let j = 0; j < score_length; j++) {
            const score_mobile = await driver.executeScript("return document.getElementsByClassName('lh-gauge__percentage')[" + j + "].innerText");
            
            if (score_mobile != "") {
                console.log("Mobile: " + score_mobile);

                let ranges_mobile = [
                    "ACC!E4",
                    "SJ!E4",
                    "AL!E4",
                    "PV!E4",
                    "BLJ!E4",
                    "Lignans!E4",
                    "NHU!E4",
                    "Fredda Branyon!E4",
                    "EJR!E4",
                ]

                let values = [
                    [
                        score_mobile
                    ],
                ];
            
                const resource_mobile = {
                    values,
                };

                const range_mobile = ranges_mobile[index];
            
                await googleSheets.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: range_mobile,
                    valueInputOption: "USER_ENTERED",
                    resource: resource_mobile
                });               
            }
        }

        await driver.sleep(3000);

        await driver.switchTo().newWindow('tab');
    }
}
monitoringNitropack();