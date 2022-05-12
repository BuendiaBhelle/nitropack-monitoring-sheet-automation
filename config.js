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



module.exports = { output, strTime };