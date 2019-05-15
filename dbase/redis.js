//start 动态 配置 配置参数
var path = require('path');
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
const redisConf = require(path.resolve("./config", env)).redisConf;
//end

var redis = require("redis");

var redisClient = redis.createClient(redisConf.Port,redisConf.Host,{});

redisClient.auth(redisConf.Password,function(){
    console.log("redis auth success");
})

redisClient.on('ready',function(){
    console.log("redis connection established");
})

redisClient.on('error',function(){
    console.log("redis connection established failed");
})
module.exports = redisClient;
