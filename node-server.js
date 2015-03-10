/* global console,require, __dirname */
/* 
This is a lightweight node server to quickly throw up pages to preview front-end elements only and save on desktop memory.

For full features & backend, run a properly configured python server via eclipse.

DO NOT USE THIS FOR BACKEND FEATURES

*/

var express = require('express');
var app = express()
.use('/', express.static(__dirname))

var port = 8888;
console.log("Starting server on port " + port);
app.listen(port);
