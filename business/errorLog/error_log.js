var client = require("../../dbase/mongoclient.js");
var express = require('express');
var router = express.Router();

console.log("enter error_Log 1")

/* GET users listing. */
router.get('/error', function(req, res, next) {
    // res.send('respond with a resource');
    var response =res;
    var collection = client.connect("mongodb://172.16.3.247:27017",function(err,connect){
        if(err){

        }else{
            var collection = connect.db("certus_log").collection("error_log");
            collection.find({}).sort({time:-1}).limit(200).toArray(function(err,ret){
                if(err){
                    console.log("")
                }else{
                    console.log("22")
                    res.render("error_log",{title:"bbbb",error:ret})
                }
            })
            return collection;
        }
    });
});

module.exports = router;


// db.