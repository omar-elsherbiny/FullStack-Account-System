var express = require('express');
var fs = require('fs');
require('dotenv').config();

const app = express();
const hostname = process.env.hostname;
const port = process.env.port;

function writeHtmlFile(res, filename) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}

app.use(express.static('public'));

app.get(['/','/index'], function (req, res) {
    writeHtmlFile(res, './index.html');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});