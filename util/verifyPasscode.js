/**
 * Created by Administrator on 2019/4/3.
 */
var passwordByMysql = function(mysql,pass){
    var blob = new Blob([pass],{type:"text/plain;charset=utf-8"});
    var params = [blob];
    mysql.query("select * from oauth_access_token where token = ?",params,function (err, result) {
        new Buffer( blob, 'binary' ).toString('base64');
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }

        console.log
    })
}
module.exports = passwordByMysql;