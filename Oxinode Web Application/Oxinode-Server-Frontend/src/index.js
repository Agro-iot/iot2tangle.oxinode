require("dotenv").config();
const path = require('path');
const express = require('express');
const appHttps = express();
const publicPath = path.join(__dirname, '..', 'public');
const https = require('https');
const fs = require('fs');
const appHttp = express();

if(process.env.ssl === "on"){
    appHttps.use(express.static(publicPath));
    appHttps.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });
    // Certificate
    const key = fs.readFileSync(process.env.private_key, 'utf8');
    const cert = fs.readFileSync(process.env.certificate, 'utf8',);
    const ca = fs.readFileSync(process.env.ca, 'utf8');
    const httpsServer = https.createServer(
        { key, cert, ca}, appHttps
    );
    httpsServer.listen(443, () => {
        console.log('Server Https is up!');
    });
} else {
    appHttp.use(express.static(publicPath));
    appHttp.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });
    appHttp.listen(80, ()=>{
        console.log('Server Http is up!');
    })
}
