//搭建 与 mongodb 链接
var mongodb = require('mongodb');
var server = new mongodb.Server('106.12.10.241', 27018, {auto_reconnect: true});
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