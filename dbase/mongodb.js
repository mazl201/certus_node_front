//搭建 与 mongodb 链接
var mongodb = require('mongodb');
var mongoConfig = require("../config/mongodb")
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