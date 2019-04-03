var mysql = require("mysql");
const mysqlConfig = require("../config/config")
var mysqlConnect = mysql.createConnection({

    host     :mysqlConfig.mysqlHost,

    user     : mysqlConfig.mysqlUser,

    password : mysqlConfig.mysqlPass,

    port: mysqlConfig.mysqlPort,

    database: mysqlConfig.mysqldbPath,
});

mysqlConnect.connect();

module.exports = mysqlConnect;