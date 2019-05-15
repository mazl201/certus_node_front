/**
 * Created by Administrator on 2019/5/15.
 */
module.exports = function(socket){
    socket.of("member")
        .on("connection",function(client){
            console.log("connected at member module");
            client.send("success connect");
            //列举 操作数据
            client.on("listUserOperate",function(data){
                var res = this;
                socket.mysql.query("select * from proj_user_change_record where proj_id = ? order by update_date desc",[data.projId],function(err,result){
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
                            socket.mysql.query(insertSql,[insertData.id,insertData.operateTypeName,insertData.operatedManName,insertData.operatorName,insertData.roleChangeTo,insertData.projId,insertData.updateDate],function(err,result){
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
                            //校验 一下 值 是否 重复

                            //暂时 使用 sha256 的方式 是否 维持 一个 简单的 队列 在 redis 里面

                            socket.mysql.query(insertSql,[insertData.id,insertData.operateTypeName,insertData.operatedManName,insertData.operatorName,insertData.roleChangeTo,insertData.projId,insertData.updateDate],function(err,result){
                                if(err){
                                    console.log("数据插入不成功");
                                }else{
                                    res.write({"date":"success"})
                                }
                            })
                        };
                            break;
                        case "delete": {
                            insertData.operateTypeName = "删除";
                            socket.mysql.query(insertSql,[insertData.id,insertData.operateTypeName,insertData.operatedManName,insertData.operatorName,insertData.roleChangeTo,insertData.projId,insertData.updateDate],function(err,result){
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
}