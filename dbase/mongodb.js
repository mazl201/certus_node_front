//搭建 与 mongodb 链接
var path = require('path');
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
var mongoConfig = require(path.resolve("./config", env)).mongoConfig;
var mongodb = require('mongodb');
// var mongoConfig = require("../config/mongodb")
var server = new mongodb.Server(mongoConfig.host, mongoConfig.port, {auto_reconnect: true});
var db = new mongodb.Db('admin', server, {safe: true});
db.open(function (err, db) {
    if (!err) {
        console.log('connect');
        db.db("certus_log").collection("error_log").find({},function(err,res){
            if(err){
                println("111")
            }
        });
        // if(stuname){
        //     query.where('stuname',stuname);
        // }

        // //计算分页数据
        // query.exec(function(err,rs){
        //     if(err){
        //         res.send(err);
        //     }else{
        //         //计算数据总数
        //     }
        // });
        db.db("certus_log").collection("error_log").count(function(err,intNum){
            if(err){
                console.log("11")
            }
        })
        return;
    } else {

        console.log(db.toSource());
    }
});

db

module.exports = db;