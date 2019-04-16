var server = require("../config/server");
var http = require("http");
var request = require("request");
var post = function (url, token, callback) {
    var options = {
        host: server.host,
        port: server.port,
        path: '/' + url,
        method: 'POST',
        strictSSL: false,
        rejectUnauthorized: false,
        crossDomain: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "bearer " + token
        }
    }
    var o = {
        url: "http://" + server.host + ":" + server.port + "/" + url,
        method: 'GET',
        strictSSL: false,
        timeout: 1500,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": "bearer " + token
        },
        // body: {"user":"111"}
    };
    request(o, function(err, response, body){
        if(err){
            console("没有鉴权无法继续执行");
        }else{
            callback(eval("("+body+")").userName)
        }
    })

    // var req = http.request(options, function(res){
    //     res.setEncoding("utf8");
    //     res.on('data',function(res){
    //         console.log('BODY: ' + chunk);
    //     })
    //     res.on('end',function(res){
    //         console.log("111");
    //     })
    // });
    //
    // req.on('error', function (e) {
    //     console.log('problem with request: ' + e.message);
    // });
}

module.exports = post;