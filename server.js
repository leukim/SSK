var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var logger = require('express-logger');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require("cookie-parser");
var session = require("express-session");

// main config
var app = express();
app.set('port', process.env.PORT);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
//app.set('view options', { layout: false });
//app.use(logger());
app.use(bodyParser.json());
//app.use(methodOverride());
app.use(cookieParser('your secret here'));
app.use(session());
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);
require("./routes")(app);
app.use(express.static(__dirname + '/public'));

/*app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});/**/

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://ssk:ssk@ds043917.mongolab.com:43917/ssk');

// routes
require('./routes')(app);

app.listen(app.get('port'), process.env.IP, function(){
  console.log(("Express server listening on port " + app.get('port')));
});