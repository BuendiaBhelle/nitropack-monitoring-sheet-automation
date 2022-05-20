const {google} = require("googleapis");
const {Builder, By, Key, util} = require("selenium-webdriver");
require('dotenv').config();


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

let site_ids = [
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
    "https://www.judefrances.com/"
]

let ranges_other = [
    "ACC!A4:C4",
    "SJ!A4:C4",
    "AL!A4:C4",
    "PV!A4:C4",
    "BLJ!A4:C4",
    "Lignans!A4:C4",
    "NHU!A4:C4",
    "Fredda Branyon!A4:C4",
    "EJR!A4:C4",
    "JFJ!A4:C4"
]

const pagespeed_url = "https://developers.google.com/speed/pagespeed/insights/";

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
    "JFJ!E4"
]

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
    "JFJ!D4"
]

var sheet_names = [
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


module.exports = { 
    output, 
    strTime,
    site_ids,
    urls,
    ranges_other,
    pagespeed_url,
    ranges_mobile,
    ranges_desktop,
    sheet_names
};