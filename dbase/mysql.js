var mysql = require("mysql");
// const mysqlConfig = require("../config/config")
var path = require('path');
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
const mysqlConfig = require(path.resolve("./config", env)).mysqlConfig;
var mysqlConnect = mysql.createConnection({

    host     :mysqlConfig.mysqlHost,

    user     : mysqlConfig.mysqlUser,

    password : mysqlConfig.mysqlPass,

    port: mysqlConfig.mysqlPort,

    database: mysqlConfig.mysqldbPath,
});

mysqlConnect.connect();

mysqlConnect.on("error",function(error){
    //目前 先 简单 打印 成 日志
    console.log(error);
})

module.exports = mysqlConnect;