var minify = require('html-minifier').minify;
const fs = require("fs");

const locationOfSpiffData = "C:/Arduino/fastledServer/data/index.html";

let html = fs.readFileSync("./index.html").toString();
const script = fs.readFileSync("./dist/index.js").toString();

const regex = /<!--here-->\r\n.*/;

html = html.replace(regex,`<script async=false defer=false>${script}</script>`);
// use the ip as the default server address
const serverAddresRegex = /this\.serverAddress.*;/
html = html.replace(serverAddresRegex,`this.serverAddress = ko.observable(location.hostname);`);

const minified = minify(html, {collapseWhitespace: true,
    minifyCSS: true, minifyJS:true, caseSensitive:true
});



fs.writeFileSync('./dist/index.html', minified);

fs.writeFileSync(locationOfSpiffData, minified);

/* 
const htmlLength = minified.length;
const buff = new Buffer.from(minified);
const base64html = buff.toString('base64');

fs.writeFileSync('./dist/base64Index.txt', `const char HTML[] PROGMEM = "${base64html}";\nconst int HtmlLength = ${htmlLength};`);

 */


