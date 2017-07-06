/**
 * @Author: Danny Gillies
 *
 * Starts the web server
 */

'use strict';

var http = require('http');
var server = http.createServer(app);

// Start server
server.listen(3000);
console.log('Listening on port 3000');