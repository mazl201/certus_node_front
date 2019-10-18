var express = require('express');
var router = express.Router();
var path = require('path');
var http = require('http'),
    io = require('socket.io'),
    fs = require('fs'),
    mysql = require(path.resolve("./dbase","mysql")),
    httpLocal = require(path.resolve("./util","HttpUtils")),
    redisClient = require(path.resolve("./dbase","redis.js"));

router.get('/socketInit', function (req, res, next) {
    res.render('index', {title: 'this router mainly for socket transfer'});
});
var socket = {};
//尝试 初始 话 mysql进入 域外
socket.mysql = mysql;
//include redisClient
socket.redisClient = redisClient;
//include httpLocal
socket.httpLocal = httpLocal;


module.exports = {router:router,socket:socket};