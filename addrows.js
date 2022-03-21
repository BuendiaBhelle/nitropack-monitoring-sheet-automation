const {google} = require("googleapis");
require('dotenv').config();

async function insertRow() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client })
    const spreadsheetId = process.env.SPREADSHEETID;

    //ACC - 1844108131
    //SJ - 82997184
    //AL - 574332572
    //PV - 1062492705
    //BLJ - 1180534636
    //Lignans - 898317464
    //NHU - 1557671517
    //Fredda Branyon - 7802066
    //EJR - 1988369747
    // JFJ - 2001892666

    let sites = [
        1844108131,
        82997184,
        574332572,
        1062492705,
        1180534636, 
        898317464,
        1557671517,
        7802066,
        1988369747,
        2001892666
    ]

    for (let index = 0; index < sites.length; index++) {
        let requests = [{
            insertRange: {
                range: {
                    sheetId: sites[index],
                    startRowIndex: 3,
                    endRowIndex: 4,
                    startColumnIndex: 0,
                },
                shiftDimension: "ROWS"
            }
        }];

        const batchUpdateRequest = {requests};

        const addRows = await googleSheets.spreadsheets.batchUpdate({
            auth,
            spreadsheetId,
            resource: batchUpdateRequest,
            }, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                console.log(sites[index]);
            }
        });
    }  


}
insertRow();
