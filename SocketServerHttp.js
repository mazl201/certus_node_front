var http = require('http'),
    io = require('socket.io'),
    fs = require('fs'),
    mysql = require("./dbase/mysql"),
    httpLocal = require("./util/HttpUtils");

// 虽然我们这里使用了同步的方法，那会阻塞 Node 的事件循环，但是这是合理的，因为 readFileSync() 在程序周期中只执行一次，而且更重要的是，同步方法能够避免异步方法所带来的“与 SocketIO 之间额外同步的问题”。当 HTML 文件读取完毕，而且服务器准备好之后，如此按照顺序去执行就能让客户端马上得到 HTML 内容。
// var sockFile = fs.readFileSync('socket.html');

// Socket 服务器还是构建于 HTTP 服务器之上，因此先调用 http.createServer()
server = http.createServer();
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
                    console.log("查询失败");
                }else{
                    res.write(result)
                    // res.end();
                }
            })
        })
    });

socket.of("member")
      .on("connection",function(client){
          console.log("connected at member module");
          client.send("success connect");
          //列举 操作数据
          client.on("listUserOperate",function(data){
              var res = this;
              mysql.query("select * from proj_user_change_record where proj_id = ? order by update_date desc",[data.projId],function(err,result){
                  if(err){
                      console.log("查询失败");
                  }else{
                      res.write(result)
                      // return result;
                  }
              })
          })
          //成员操作
          client.on("projUserOperate",function(body){
              var res = this;
              httpLocal("nodeVerify", body.headerAuthorization, function (userName) {
                  var userNameOrigin = body.baseInfo.userName;
                  var insertData = {
                      operatorName: userName,
                      operateTypeName: "",
                      operatedManName: userNameOrigin,
                      roleChangeTo: body.baseInfo.roleName,
                      id: uuid.v1(),
                      projId:body.baseInfo.projId,
                      updateDate:new Date()
                  };

                  var insertSql = "INSERT INTO `proj_user_change_record` (`id`,`operate_type_name`,`operated_man_name`,`operator_name`,`role_change_to`,`proj_id`,`update_date`)VALUES(?, ?, ?, ?, ?, ?,?)"
                  switch (body.operate) {

                      case "change": {

                          insertData.operateTypeName = "修改"


                          var userId = body.baseInfo.userId;
                          var projId = body.baseInfo.proId;
                          //比对 roleId 是否变化
                          var params = [projId, userId];
                          var roleId = body.baseInfo.roleId
                          mysql.query(insertSql,[insertData.id,insertData.operateTypeName,insertData.operatedManName,insertData.operatorName,insertData.roleChangeTo,insertData.projId,insertData.updateDate],function(err,result){
                              if(err){
                                  console.log("数据插入不成功");
                              }else{
                                  res.write({"date":"success"})
                              }
                          })
                      }
                          ;
                          break;
                      case "new": {
                          insertData.operateTypeName = "新增";
                          mysql.query(insertSql,[insertData.id,insertData.operateTypeName,insertData.operatedManName,insertData.operatorName,insertData.roleChangeTo,insertData.projId,insertData.updateDate],function(err,result){
                              if(err){
                                  console.log("数据插入不成功");
                              }else{
                                  res.write({"date":"success"})
                              }
                          })
                      }
                          ;
                          break;
                      case "delete": {
                          insertData.operateTypeName = "删除";
                          mysql.query(insertSql,[insertData.id,insertData.operateTypeName,insertData.operatedManName,insertData.operatorName,insertData.roleChangeTo,insertData.projId,insertData.updateDate],function(err,result){
                              if(err){
                                  console.log("数据插入不成功");
                              }else{
                                  res.write({"date":"success"})
                              }
                          })
                      };break;
                  }
              })
          })
      })