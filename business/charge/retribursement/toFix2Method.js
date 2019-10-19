var Decimal = require("decimal.js");

var path = require('path');
var router = require(path.resolve("./routes", 'socket')).router;
var socket = require(path.resolve("./routes", 'socket')).socket;

router.post('/calculate/surplus', function (req, res, next) {
    if(req.body.modudleName && req.body.param){
        let data = eval("("+req.body.param+")");

        try{
            var total = new Decimal(data.total);
            var now = new Decimal(data.now);
            var decimal2 = new Decimal(data.additional);
            now = now.sub(decimal2);
            var surplus =total.sub(now);
            var datas = data.datas;
            if(datas && datas.length > 0){
                datas.forEach(function(data,index,a){
                    var decimal = new Decimal(data.money);
                    surplus =surplus.sub(decimal)
                })
                res.status(200).json({"surplus":surplus.toFixed(2)});
            }else{
                res.status(200).json({"surplus":surplus.toFixed(2)});
            }
        }catch(e){
            console.log("can't evaulate");
            res.status.json({"surplus":new Decimal(data.total).toFixed(2)})
        }

    }else{
        res.status(500).end("failed")
    }
});

function toFix2(socket){
    socket.of("calculate").on("connection",function(client){
        client.send("success connect");
        client.on("surplus",function(data,b,c){
           try{
               var total = new Decimal(data.total);
               var now = new Decimal(data.now);
               var decimal2 = new Decimal(data.additional);
               now = now.sub(decimal2);
               var surplus =total.sub(now);
               var datas = data.datas;
               if(datas && datas.length > 0){
                   datas.forEach(function(data,index,a){
                       var decimal = new Decimal(data.money);
                       surplus =surplus.sub(decimal)
                   })
                   this.write({"surplus":surplus.toFixed(2)});
               }else{
                   this.write({"surplus":surplus.toFixed(2)});
               }
           }catch(e){
                console.log("can't evaulate");
                this.write({"surplus":new Decimal(data.total).toFixed(2)})
           }
        })
    })
}

module.exports = toFix2;