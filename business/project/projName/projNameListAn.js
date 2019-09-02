/**
 * Created by Administrator on 2019/6/12.
 */
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