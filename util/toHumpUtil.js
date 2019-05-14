/**
 * Created by Administrator on 2019/5/14.
 */

module.exports = function(strByUnderline){
    return strByUnderline.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}