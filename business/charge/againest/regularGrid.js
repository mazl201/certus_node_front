
function regularGrid(socket){
    socket.of("/chargeGrid").on("connection",function(client){
        console.log("connection established and init regularData");
        client.send("success connect");
        client.on("regularData",function(data,b,c){
            var res = this;
            var param = data;
            console.log("start query mysql to find result");
            socket.mysql.query("select * from charge_againest where triburse_code = ? order by time desc;",[param.borrowCode],function(err,result){
                //处理 错误
                if(err){
                    console.log("查询 charge_againest 失败,mysql 使用失败");
                }else{
                    res.write(result);
                }
            })
        })

    })
}

exports = module.exports = regularGrid