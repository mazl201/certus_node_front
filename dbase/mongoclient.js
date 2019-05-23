//搭建 与 mongodb 链接
var path = require('path');
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
var mongoConfig = require(path.resolve("./config", env)).mongoConfig;
var mongodb = require('mongodb');
var mongoclient = require('mongodb').MongoClient;
// var mongoConfig = require("../config/mongodb")
var server = new mongodb.Server(mongoConfig.host, mongoConfig.port, {auto_reconnect: true});

var collect = {}
var collection = mongoclient.connect("mongodb://172.16.3.247:27017",function(err,connect){
    if(err){

    }else{
        var collection = connect.db("certus_log").collection("error_log");
        collection.find({}).skip(2).count({},function(err,retNum){
            console.log("目前mongodb 中包含的 数据 包含 "+retNum+" 条")
        })
        return collection;
    }
});

module.exports = mongoclient