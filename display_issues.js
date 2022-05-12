const {google} = require("googleapis");
require('dotenv').config();
const config = require("./config");

async function displaySitesToBeReported() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = process.env.SPREADSHEETID;

    var sites = [
        "ACC",
        "SJ",
        "AL",
        "PV",
        "BLJ",
        "Lignans",
        "NHU",
        "Fredda Branyon",
        "EJR",
        "JFJ"
    ]

    const getPageSpeedScoreLignans = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Lignans!D4:E4",
    });

    const lignansDesktop = getPageSpeedScoreLignans.data.values[0][0];
    const lignansMobile = getPageSpeedScoreLignans.data.values[0][1];

    if ((lignansMobile < 30) || (lignansDesktop < 30)) {
        console.log("DO NOT INCLUDE LIGNANS.");
    }

    // Read PageSpeed Scores from google sheet
    try {
        console.log("Nitropack fails (" + config.output + "):");
        for (let index = 0; index < sites.length; index++) {
            const getPageSpeedScore = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: sites[index] + "!D4:E4",
            });
    
            const data_desktop = getPageSpeedScore.data.values[0][0];
            const data_mobile = getPageSpeedScore.data.values[0][1];

            if (data_mobile <= 49) {
                console.log("   * " + sites[index]);
                if (data_desktop <= 49) {
                    console.log("     - Desktop: " + data_desktop);
                }
                console.log("     - Mobile: " + data_mobile);
            }
            else if (data_desktop <= 49) {
                console.log("   * " + sites[index]);
                console.log("     - Desktop: " + data_desktop);
                if (data_mobile <= 49) {
                    console.log("     - Mobile: " + data_mobile);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}
displaySitesToBeReported();