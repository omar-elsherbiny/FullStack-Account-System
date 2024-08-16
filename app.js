var express = require('express');
var fs = require('fs');
require('dotenv').config();

var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

const app = express();
const hostname = process.env.hostname;
const port = process.env.port;

function writeHtmlFile(result, filename) {
    fs.readFile(filename, function (error, data) {
        if (error) {
            result.writeHead(404, { 'Content-Type': 'text/html' });
            return result.end("404 Not Found");
        }
        result.writeHead(200, { 'Content-Type': 'text/html' });
        result.write(data);
        return result.end();
    });
}

app.use(connectLiveReload());

app.use(express.static('public'));

app.get('/', function (request, result) {
    writeHtmlFile(result, './src/index.html');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});