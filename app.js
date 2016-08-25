var express = require("express");
var bodyParser  =   require("body-parser");
var app = express();
var routes = require('./routes/index');
var webhooks = require('./routes/webhook');
var telegrams = require('./routes/telegram');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : true}));

app.use('/', routes);
app.use('/webhook', webhooks);
app.use('/telegram', telegrams);
app.listen(3001);
console.log("Listening to PORT 3001");

module.exports = app;