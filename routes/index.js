var express = require('express');
var router = express.Router();
// var db = require("../dbase/mongodb");

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.writeHeader(200, {'Content-Type': 'text/html;charset:utf-8'});
    res.render('index', {title: 'Express'});
});

module.exports = router;
