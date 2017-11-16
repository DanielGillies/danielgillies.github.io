/**
 * @Author: Danny Gillies
 *
 * Starts the web server
 */

'use strict';

var httpPort = 80;
var httpsPort = 443;

var http = require('http');
var https = require('https');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var app = express();	

var privateKey  = fs.readFileSync('/etc/letsencrypt/live/dannoldg.com/privkey.pem', 'utf8');
var certificate  = fs.readFileSync('/etc/letsencrypt/live/dannoldg.com/fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

mongoose.connect('mongodb://localhost/boombox');

require('./server/routes')(app);

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('./'));

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// Route all http requests to https
http.get("*", function(req, res) {
	res.redirect("https://dannoldg.com"+req.url);
});

// Start server
httpServer.listen(httpPort);
httpsServer.listen(httpsPort);
console.log('Listening on port ' + httpPort);

// Expose app
exports = module.exports = app;