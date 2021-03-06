var Decimal = require("decimal.js");

var path = require('path');
var router = require(path.resolve("./routes", 'socket')).router;
var socket = require(path.resolve("./routes", 'socket')).socket;

router.post('/businessTotalPrice/caculateTotal', function (req, res, next) {
    if(req.body.modudleName && req.body.param){
        let data = eval("("+req.body.param+")");

        //校验
        var retur = {total:0.00,datas:[]};
        if(data && data.length > 0){
            socket.redisClient.set(this.id,0.00);
            var redisKey = this.id;
            data.forEach(function(every){
                var discountPrice = new Decimal(every.cataPrice*(every.discountedRate)/100);
                var taxPrice = new Decimal(discountPrice.toFixed(2)*(100+every.taxRate)/100);
                every.discountPrice = discountPrice.toFixed(2);
                every.taxPrice = taxPrice.toFixed(2);
                socket.redisClient.incrbyfloat(redisKey,taxPrice.toFixed(2),function(err,ret){
                    if(err){
                        console.log("business quote item data can't in")
                    }else{

                    }
                });
            })
            retur.datas = data;
            var innerClient = this;
            socket.redisClient.get(this.id,function(err,ret){
                if(err){
                    console.log("if has nothing")
                }else{
                    retur.total = new Decimal(ret).toFixed(2);
                    res.status(200).end(retur+"");
                }
            })
        }else{
            socket.redisClient.del(this.id);
            res.status(200).end(retur+"");
        }

    }else{
        res.status(500).end("failed")
    }
});

function businessRedis(socket){

    socket.of("businessTotalPrice").on("connection",function(client){
        client.send(client.id);
        client.on("caculateTotal",function(data,b,c){
            var retur = {total:0.00,datas:[]};
            if(data && data.length > 0){
                socket.redisClient.set(this.id,0.00);
                var redisKey = this.id;
                data.forEach(function(every){
                    var discountPrice = new Decimal(every.cataPrice*(every.discountedRate)/100);
                    var taxPrice = new Decimal(discountPrice.toFixed(2)*(100+every.taxRate)/100);
                    every.discountPrice = discountPrice.toFixed(2);
                    every.taxPrice = taxPrice.toFixed(2);
                    socket.redisClient.incrbyfloat(redisKey,taxPrice.toFixed(2),function(err,ret){
                        if(err){
                            console.log("business quote item data can't in")
                        }else{

                        }
                    });
                })
                retur.datas = data;
                var innerClient = this;
                socket.redisClient.get(this.id,function(err,ret){
                    if(err){
                        console.log("if has nothing")
                    }else{
                        retur.total = new Decimal(ret).toFixed(2);
                        innerClient.send(retur);
                    }
                })
            }else{
                this.send(retur);
                socket.redisClient.del(this.id);
            }

        })
    })
}

module.exports = businessRedis