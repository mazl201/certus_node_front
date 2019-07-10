/**
 * Created by Administrator on 2019/4/3.
 */
module.exports = {
    mysqlConfig : {
        mysqlHost: "172.16.3.247" ,
        mysqlPort:3306,
        mysqlUser:"admin",
        mysqlPass:"247mysqld",
        mysqldbPath:"certus_ims"
    },
    redisConf : {
        Host:"172.16.3.58",
        Port:"6379",
        Password:"redis@586379"
    },
    mongoConfig : {
        host: "172.16.3.247" ,
        port:27017,
    },
    server : {
        host:"172.16.3.246",
        port:"8080"
    },
    serverConf : {
        host:"172.16.3.247",
        port:"8089"
    },
    elasticSearchConf : {
        host:"172.16.3.247",
        port:"9200"
    }

};