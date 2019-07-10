/**
 * Created by Administrator on 2019/4/3.
 */
module.exports = {
    mysqlConfig : {
        mysqlHost: "172.16.3.58" ,
        mysqlPort:3306,
        mysqlUser:"mysqladmin",
        mysqlPass:"mysql@583306",
        mysqldbPath:"certus"
    },
    redisConf : {
        Host:"172.16.3.246",
        Port:"6379",
        Password:"ims890123T"
    },
    mongoConfig : {
        host: "172.16.3.247" ,
        port:27017,
    },
    server : {
        host:"172.16.3.58",
        port:"8080"
    },
    serverConf : {
        host:"172.16.3.58",
        port:"8089"
    },
    elasticSearchConf : {
        host:"172.16.3.58",
        port:"9200"
    }
};