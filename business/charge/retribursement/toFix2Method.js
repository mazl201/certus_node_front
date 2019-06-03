var Decimal = require("decimal.js");
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