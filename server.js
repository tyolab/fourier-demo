/**
 * Creating a tyo-mq server and express server to serve static files
 */

 const tyoMQ = new (require('tyo-mq/lib/server'))();
 tyoMQ.start();

 var express = require('express')
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic('public', { 'index': ['index.htm'] }))
app.listen(6000)

