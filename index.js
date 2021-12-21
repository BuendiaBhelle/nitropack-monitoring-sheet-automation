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
    let driver = await new Builder().forBrowser("chrome").build();

    // ACC
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.collisioncenternorthscottsdale.com/", Key.RETURN);

    // SJ
    await driver.switchTo().newWindow('tab');
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.sunrisejewelryusa.com/", Key.RETURN);

    // AL
    await driver.switchTo().newWindow('tab');
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.americanleatherusa.com/", Key.RETURN);

    // PV
    await driver.switchTo().newWindow('tab');
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.primeview.com/", Key.RETURN);

    // BLJ
    await driver.switchTo().newWindow('tab');
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.biltmoreloanandjewelry.com/", Key.RETURN);

    // LIGNANS
    await driver.switchTo().newWindow('tab');
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.lignans.net/", Key.RETURN);

    // NHU
    await driver.switchTo().newWindow('tab');
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.newhopemedicalcenter.com/", Key.RETURN);

    // FREDDA BRANYON
    await driver.switchTo().newWindow('tab');
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.freddabranyon.com/", Key.RETURN);

    // EJR
    await driver.switchTo().newWindow('tab');
    await driver.get("https://developers.google.com/speed/pagespeed/insights/");
    await driver.findElement(By.name("url")).sendKeys("https://www.everythingjustrocks.com/", Key.RETURN);
}
monitoringNitropack();