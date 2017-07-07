/**
 * @Author: Danny Gillies
 *
 * Starts the web server
 */

'use strict';

var port = 8080;

var http = require('http');
var express = require('express');
var path = require('path');
var app = express();	
var server = http.createServer(app);

require('./server/routes')(app);

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('./'));

// Start server
server.listen(port);
console.log('Listening on port ' + port);

// Expose app
exports = module.exports = app;