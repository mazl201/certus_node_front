var mysql = require("mysql");
var mysqlConnect = mysql.createConnection({

    host     : '172.16.3.58',

    user     : 'mysqladmin',

    password : 'mysql@583306',

    port: '3306',

    database: 'certus',
});

mysqlConnect.connect();

module.exports = mysqlConnect;