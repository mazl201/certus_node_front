var createError = require('http-errors');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var usersRouter = require('./routes/mongodb');

var app = express();


// Connection url
// var url = 'mongodb://106.12.10.241:27018/admin';
// // Connect using MongoClient
// MongoClient.connect(url, function (err, db) {
//     // Use the admin database for the operation
//     var adminDb = db.admin();
//     // List all the available databases
//     adminDb.listDatabases(function (err, dbs) {
//         test.equal(null, err);
//         test.ok(dbs.databases.length > 0);
//         db.close();
//     });
// });
var mongodb = require('mongodb');
var server = new mongodb.Server('106.12.10.241', 27018, {auto_reconnect: true});
var db = new mongodb.Db('admin', server, {safe: true});
db.open(function (err, db) {
    db.createCollection('myqueue',{safe: true}, function (err, collection) {
        if (err) {
            console.log(err);
        }
    })
    if (!err) {
        console.log('connect');
        return;
    } else {
        console.log(err);
    }


});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
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
