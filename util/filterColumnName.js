var toHumpUtil = require("./toHumpUtil");
module.exports = function (arrayToProcess) {
    if (arrayToProcess && arrayToProcess instanceof Array) {
        var newArray = new Array();
        arrayToProcess.forEach(function (p1, p2, p3) {
            // print(p1);
            var map = {};
            for (var key in p1) {
                map[toHumpUtil(key)] = p1[key];
            }
            newArray.push(map);
            // newArray.put()
        })
        return newArray;
    }
}