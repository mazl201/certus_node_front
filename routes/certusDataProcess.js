var express = require('express');
var router = express.Router();
db = require("../dbase/mongodb");
mysql = require("../dbase/mysql");

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

module.exports = router;