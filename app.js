var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
// var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var mongoDB = 'mongodb://favouroked:Awesome123@ds243285.mlab.com:43285/mentor';
mongoose.connect(mongoDB, {useMongoClient: true});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log("YOu are now connected to mongodb");
});

var index = require('./routes/index');
var students = require('./routes/students');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true,
    // cookie: { secure: true }
}));


// Express validators
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    res.locals.user = req.user || null;
    next()
});


app.use('/', index);
app.use('/students', students);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
