var createError = require('http-errors');
var express = require('express');
//暂时不用
//var MongoClient = require('mongodb').MongoClient;
//test
var test = require('assert');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//引入 session 管理工具
var session = require('express-session');

//引入 数据库 js
var mongodb = require('./dbase/mongodb');
var mongodb = require('./dbase/mysql');


//引入 路由 js
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var certusProcess = require('./routes/certusDataProcess');
var app = express();

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));




//允许跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // 表示任意的源
    // res.header("Access-Control-Allow-Origin", "http://www.wtapi.wang"); // 只有这个网址
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",'unknown')
    res.header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    next();
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//router
app.use("/",indexRouter);
app.use('/users', usersRouter);
app.use('/certus/dataProcess', certusProcess);

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
