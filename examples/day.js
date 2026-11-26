// Usage: node examples/day.js 2027-04-07 17.385 78.4867 Asia/Kolkata
const ssp = require('..');
const [iso = '2027-04-07', lat = '23.1765', lon = '75.7885', tzid = 'Asia/Kolkata'] = process.argv.slice(2);
const [y, m, d] = iso.split('-').map(Number);
console.log(JSON.stringify(ssp.summary(y, m, d, { lat: +lat, lon: +lon, tzid }), null, 2));
