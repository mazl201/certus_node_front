var express = require('express');
var router = express.Router();

// db = require("../dbase/mongodb");
mysql = require("../dbase/mysql");
http = require("../util/HttpUtils");
uuid = require("uuid");
require("../public/socket/socket.io.js");
var path = require('path');
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
const server = require(path.resolve("./config", env)).server;

router.post("/transmitSocket",function(req, res, next){
    if(req.body.modudleName && req.body.param){
        let modudleName = req.body.modudleName;
        let param = req.body.param;
        let params = req.body.params;
        try{
            var socket = io(server.host + ":9001" + "/" + modudleName);
            // var socket = io("localhost:9000");
            socket.on("connect", function (msg, b, c) {

            })
            socket.on("message", function (data, b, c) {
                if (data && data == "success connect") {
                    if (param) {
                        param.headerAuthorization = access_token;
                    }
                    let url = "http://"+ server.host +":8086/end/";
                    socket.emit(url, param);
                } else if (data) {
                    socket.close();
                    res.json(data);
                }
            })
        }catch(e){
            console.log(e);
        }
    }else{
        res.status(500).end("failed")
    }

})


router.post('/receiveSubmit', function (req, res, next) {
    res.render('index', {title: 'index'});
});

router.get('/receiveSubmit', function (req, res, next) {
    res.render('index', {title: 'index'});
    // db.insert(["aaa","bbb"],{safe:true},function(err,result){
    //                    console.log(result);
    //               });
    db.collection('certus', {safe: true}, function (err, collection) {
        var tmp1 = {title: 'hello', number: 1};
        collection.insert(tmp1, {safe: true}, function (err, result) {
            console.log(result);
        });
    });
    mysql.query("select * from base_user", function (err, results, fields) {
        if (err) {
            throw err;
        }
    })
});

//处理 成员 操作 记录
router.post("/listUserOperate", function (req, res, next) {
    mysql.query("select * from proj_user_change_record where proj_id = ? order by update_date desc",[req.body.projId],function(err,result){
        if(err){
            console.log("查询失败");
        }else{
            res.json(result)
            // return result;
        }
    })
})

//处理公司 code
router.post("/relatedCompanyName", function (req, res, next) {
    mysql.query("select company as companyName,company_id as companyCode from company",function(err,result){
        if(err){
            console.log("查询失败");
        }else{
            res.json(result)
            // return result;
        }
    })
})

//处理 成员 操作 记录
router.post("/projUserOperate", function (req, res, next) {
    http("nodeVerify", req.header("Authorization").replace("bearer ", ""), function (userName) {
        var userNameOrigin = req.body.baseInfo.userName;
        var insertData = {
            operatorName: userName,
            operateTypeName: "",
            operatedManName: userNameOrigin,
            roleChangeTo: req.body.baseInfo.roleName,
            id: uuid.v1(),
            projId:req.body.baseInfo.projId,
            updateDate:new Date()
        };

        var insertSql = "INSERT INTO `proj_user_change_record` (`id`,`operate_type_name`,`operated_man_name`,`operator_name`,`role_change_to`,`proj_id`,`update_date`)VALUES(?, ?, ?, ?, ?, ?,?)"
        switch (req.body.operate) {

            case "change": {

                insertData.operateTypeName = "修改"


                var userId = req.body.baseInfo.userId;
                var projId = req.body.baseInfo.proId;
                //比对 roleId 是否变化
                var params = [projId, userId];
                var roleId = req.body.baseInfo.roleId
                mysql.query(insertSql,[insertData.id,insertData.operateTypeName,insertData.operatedManName,insertData.operatorName,insertData.roleChangeTo,insertData.projId,insertData.updateDate],function(err,result){
                    if(err){
                        console.log("数据插入不成功");
                    }else{
                        res.json({"date":"success"})
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
                        res.json({"date":"success"})
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
                        res.json({"date":"success"})
                    }
                })
            };break;
        }
    })

})

module.exports = router;