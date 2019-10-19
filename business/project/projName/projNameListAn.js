/**
 * Created by Administrator on 2019/6/12.
 */
var path = require('path');
var router = require(path.resolve("./routes", 'socket')).router;
var socket = require(path.resolve("./routes", 'socket')).socket;

router.post('/projName/list', function (req, res, next) {
    if(req.body.modudleName && req.body.param){
        let data = eval("("+req.body.param+")");

        socket.httpLocal("listProjName", data.headerAuthorization, function (projNames) {
            res.write(projNames)
        })

    }else{
        res.status(500).end("failed")
    }
});

router.post('/customAll/list', function (req, res, next) {
    if(req.body.modudleName && req.body.param){
        let data = eval("("+req.body.param+")");

        //校验
        socket.httpLocal("listCustomers", data.headerAuthorization, function (projNames) {
            res.write(projNames)
        })

    }else{
        res.status(500).end("failed")
    }
});

module.exports = function(socket){
    socket.of("projName")
        .on("connection",function(client){
            console.log("connected at member module");
            client.send("success connect");
            client.on("list",function(data){
                var res = this;
                //校验
                socket.httpLocal("listProjName", data.headerAuthorization, function (projNames) {
                    res.write(projNames)
                })
                //查询数据库
            })
        })

    socket.of("customAll")
        .on("connection",function(client){
            console.log("connected at member module");
            client.send("success connect");
            client.on("list",function(data){
                var res = this;
                //校验
                socket.httpLocal("listCustomers", data.headerAuthorization, function (projNames) {
                    res.write(projNames)
                })
                //查询数据库
            })
        })

}