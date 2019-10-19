var filterColumn = require("../../../util/filterColumnName.js");

var path = require('path');
var router = require(path.resolve("./routes", 'socket')).router;
var socket = require(path.resolve("./routes", 'socket')).socket;

router.post('/customAll/list', function (req, res, next) {
    if(req.body.modudleName && req.body.param){
        let param = eval("("+req.body.param+")");

        console.log("start query mysql to find result");
        socket.mysql.query("select t.*,tt.user_name as userName from charge_againest t left join base_user tt on tt.user_id = t.real_kj_id and tt.is_old = 0 where triburse_code = ? order by time desc;",[param.borrowCode],function(err,result){
            //处理 错误
            if(err){
                console.log("查询 charge_againest 失败,mysql 使用失败");
            }else{
                res.status(200).end(filterColumn(result));
            }
        })

    }else{
        res.status(500).end("failed")
    }
});

function regularGrid(socket){
    socket.of("/chargeGrid").on("connection",function(client){
        console.log("connection established and init regularData");
        client.send("success connect");
        client.on("regularData",function(data,b,c){
            var res = this;
            var param = data;
            console.log("start query mysql to find result");
            socket.mysql.query("select t.*,tt.user_name as userName from charge_againest t left join base_user tt on tt.user_id = t.real_kj_id and tt.is_old = 0 where triburse_code = ? order by time desc;",[param.borrowCode],function(err,result){
                //处理 错误
                if(err){
                    console.log("查询 charge_againest 失败,mysql 使用失败");
                }else{
                    res.write(filterColumn(result));
                }
            })
        })

    })
}

exports = module.exports = regularGrid