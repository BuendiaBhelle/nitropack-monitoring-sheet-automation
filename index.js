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

    const driver = await new Builder().forBrowser("chrome").build();
    const pagespeed_url = "https://developers.google.com/speed/pagespeed/insights/";

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
    
    for (let index = 0; index < urls.length; index++) {
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
                urls[index],
                output,
                strTime
            ],
        ];

        const resource = {
            values,
        };

        const range = ranges[index];

        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: range,
            valueInputOption: "RAW",
            resource: resource
        });
        console.log(range);

        await driver.get(pagespeed_url);
        await driver.findElement(By.name("url")).sendKeys(urls[index], Key.RETURN);
        await driver.switchTo().newWindow('tab');
    }
}
writeToGoogleSheets();