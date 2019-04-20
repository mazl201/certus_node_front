//搭建 与 mongodb 链接
var path = require('path');
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
var mongoConfig = path.resolve(__dirname, env).mongoConfig;
var mongodb = require('mongodb');
// var mongoConfig = require("../config/mongodb")
var server = new mongodb.Server(mongoConfig.host, mongoConfig.port, {auto_reconnect: true});
var db = new mongodb.Db('admin', server, {safe: true});
db.open(function (err, db) {
    if (!err) {
        console.log('connect');
        return;
    } else {
        console.log(err);
    }
});

module.exports = db;