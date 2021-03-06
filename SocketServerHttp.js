var http = require('http'),
    io = require('socket.io'),
    fs = require('fs'),
    mysql = require("./dbase/mysql"),
    httpLocal = require("./util/HttpUtils"),
    redisClient = require("./dbase/redis.js");


// 虽然我们这里使用了同步的方法，那会阻塞 Node 的事件循环，但是这是合理的，因为 readFileSync() 在程序周期中只执行一次，而且更重要的是，同步方法能够避免异步方法所带来的“与 SocketIO 之间额外同步的问题”。当 HTML 文件读取完毕，而且服务器准备好之后，如此按照顺序去执行就能让客户端马上得到 HTML 内容。
// var sockFile = fs.readFileSync('socket.html');

// Socket 服务器还是构建于 HTTP 服务器之上，因此先调用 http.createServer()
server = http.createServer();
//预留 http 请求 口
server.on('request', function (req, res) {


});

server.listen(9001);

var socket = io.listen(server); // 交由 Socket.io 接管

// Socket.io 真正的连接事件
// socket.on('connection', function(client){
//     console.log('Client connected');
//     client.send('Welcome client ' + client.sessionId); // 向客户端发送文本
// });


socket.of('/upandrunning')
    .on('connection', function (client) {
        console.log('Client connected to Up and Running namespace.');
        client.send("Welcome to 'Up and Running'");
        // client.end("aaaa")
    });

socket.of('/weather')
    .on('connection', function (client) {
        console.log('Client connected to Weather namespace.');
        client.send("Welcome to 'Weather Updates'");
    });


//处理 成员权限 查询
socket.of('/department')
    .on('connection', function (client) {
        console.log('Client connected to Weather namespace.');
        client.send("success connect");
        client.on('relatedCompanyName',function(data,b,c){
            var res = this;
            mysql.query("select company as companyName,company_id as companyCode from company",function(err,result){
                if(err){
                    console.log("查询 company ,查询失败");
                }else{
                    res.write(result)
                    // res.end();
                }
            })
        })
    });

//添加 成员 操作 方式 方法
var operateRequ = require("./business/projMember/memberOperate/operate.js");
operateRequ(socket);


//regularGrid
var require2 = require("./business/charge/againest/regularGrid");
require2(socket);

var businessRedis = require("./business/project/businessQuote/business-redis.js")
businessRedis(socket);

var toFix2Method = require("./business/charge/retribursement/toFix2Method.js")
toFix2Method(socket);

var tscheduleSearch = require("./business/schedule/tscheduleSearch.js");
tscheduleSearch(socket)


var projName = require("./business/project/projName/projNameListAn.js");
projName(socket);

//尝试 初始 话 mysql进入 域外
socket.mysql = mysql;
//include redisClient
socket.redisClient = redisClient;
//include httpLocal
socket.httpLocal = httpLocal;


module.exports = socket;