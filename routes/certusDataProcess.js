var express = require('express');
var router = express.Router();
var db = require("./mongodb");

router.post('/receiveSubmit', function(req, res, next) {
    res.render('index', { title: 'index' });
});

router.get('/receiveSubmit', function(req, res, next) {
    res.render('index', { title: 'index' });
});

module.exports = router;