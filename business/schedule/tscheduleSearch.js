var elasticsearch = require("elasticsearch");
//start 动态 配置 配置参数
var path = require('path');
//router
var router = require(path.resolve("./routes", 'socket')).router;
var socket = require(path.resolve("./routes", 'socket')).socket;
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
const elasticSearchConf = require(path.resolve("./config", env)).elasticSearchConf;

const esclient = new elasticsearch.Client({
    host: "http://"+elasticSearchConf.host + ":" + elasticSearchConf.port,
    //将日志信息显示在控制台，默认level:"console"
    log: "trace",
});

router.get('/socketInit1', function (req, res, next) {
    res.render('index', {title: 'this router mainly for socket transfer'});
});

router.post('/tschedule/list5new', function (req, res, next) {
    if(req.body.modudleName && req.body.param){
        let data = eval("("+req.body.param+")");
        socket.httpLocal("nodeVerify", data.headerAuthorization, function (data) {
            let resp;
            async function getFirstFive() {
                try {
                    resp = await esclient.search({
                        index: 'workflow',
                        type: 't_schedule',
                        body: {
                            "query": { "bool":{
                                    "must":[
                                        {"match":{
                                                "state":"N"
                                            }},{
                                            "match":{
                                                "dealUserId": data.userId
                                            }
                                        }
                                    ]
                                }},
                            "from": 0,
                            "size": 5,
                            "sort": { "createTime": { "order": "desc" } }
                        }
                    });
                } catch (e) {
                    resp = null;
                    res.status(200).json({})
                }
                let array = new Array();
                resp.hits.hits.forEach(function(a){
                    array.push(a._source)
                })
                res.status(200).json(array);
            }
            getFirstFive()
        })
    }else{
        res.status(500).end("failed")
    }
});

router.post('/tschedule/list5newCount', function (req, res, next) {
    if(req.body.modudleName && req.body.param){
        let data = eval("("+req.body.param+")");
        socket.httpLocal("nodeVerify", data.headerAuthorization, function (data) {
            let resp;
            async function getFirstFive() {
                try {
                    resp = await esclient.count({
                        index: 'workflow',
                        type: 't_schedule',
                        body: {
                            "query": { "bool":{
                                    "must":[
                                        {"match":{
                                                "state":"N"
                                            }},{
                                            "match":{
                                                "dealUserId": data.userId
                                            }
                                        }
                                    ]
                                }}
                        }
                    });
                } catch (e) {
                    resp = null;
                    res.status(200).end(0+"")
                }
                res.status(200).end(resp.count+"");
            }
            getFirstFive()
        })
    }else{
        res.status(500).end("failed")
    }

});

module.exports = function (socket) {
    socket.of("tschedule")
        .on("connection", function (client) {
            console.log("connected at member module");
            client.send("success connect");
            //列举 操作数据
            client.on("list5new", function (data) {
                var res = this;
                // socket.mysql.query("select * from proj_user_change_record where proj_id = ? order by update_date desc", [data.projId], function (err, result) {
                //     if (err) {
                //         console.log("查询失败");
                //     } else {
                //         res.write(result)
                //         // return result;
                //     }
                // })
                socket.httpLocal("nodeVerify", data.headerAuthorization, function (data) {
                    let resp;
                    async function getFirstFive() {
                        try {
                            resp = await esclient.search({
                                index: 'workflow',
                                type: 't_schedule',
                                body: {
                                    "query": { "bool":{
                                        "must":[
                                            {"match":{
                                                "state":"N"
                                            }},{
                                                "match":{
                                                    "dealUserId": data.userId
                                                }
                                            }
                                        ]
                                    }},
                                    "from": 0,
                                    "size": 5,
                                    "sort": { "createTime": { "order": "desc" } }
                                }
                            });
                        } catch (e) {
                            resp = null;
                            res.write({})
                        }
                        let array = new Array();
                        resp.hits.hits.forEach(function(a){
                            array.push(a._source)
                        })
                        res.write(array);
                    }
                    getFirstFive()
                })

            });

            client.on("list5newCount", function (data) {
                var res = this;
                socket.httpLocal("nodeVerify", data.headerAuthorization, function (data) {
                    let resp;
                    async function getFirstFive() {
                        try {
                            resp = await esclient.count({
                                index: 'workflow',
                                type: 't_schedule',
                                body: {
                                    "query": { "bool":{
                                        "must":[
                                            {"match":{
                                                "state":"N"
                                            }},{
                                                "match":{
                                                    "dealUserId": data.userId
                                                }
                                            }
                                        ]
                                    }}
                                }
                            });
                        } catch (e) {
                            resp = null;
                            res.write(0)
                        }

                        res.write(resp.count);
                    }
                    getFirstFive()
                })
            })
        })
}