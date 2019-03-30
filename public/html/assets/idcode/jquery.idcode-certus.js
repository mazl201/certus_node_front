/**
 * idcode 1.0 - validate user.
 * Version 1.0
 * @requires jQuery v1.2
 * author ehong[idehong@gmail.com]
 **/

/**
 * @example: $.idcode.setCode();
 * @desc: Make a validate code append to the element that id is idcode.
 *
 * @example $.idcode.validateCode();
 * @desc return true if user input value equal idcode.
 **/

(function ($) {
    var settings = {
        e: 'idcode',
        codeType: {name: 'follow', len: 5},//len是修改验证码长度的
        codeTip: '换个验证码?',
        inputID: 'Txtidcode'//验证元素的ID
    };

    var _set = {
        storeLable: 'codeval',
        store: '#ehong-code-input',
        codeval: '#ehong-code'
    }
    $.idcode = {
        getCode: function (option) {
            _commSetting(option);
            return _storeData(_set.storeLable, null);
        },
        setCode: function (option) {
            _commSetting(option);
            _setCodeStyle("#" + settings.e, settings.codeType.name, settings.codeType.len);
        },
        validateCode: function (option) {
            _commSetting(option);
            var inputV;
            if (settings.inputID) {
                inputV = $('#' + settings.inputID).val();
            } else {
                inputV = $(_set.store).val();
            }
            if (inputV.toUpperCase() == _storeData(_set.storeLable, null).toUpperCase()) {//修改的不区分大小写
                return true;
            } else {
                _setCodeStyle("#" + settings.e, settings.codeType.name, settings.codeType.len);
                return false;
            }
        },
        certusValidateCode: '逻辑错误',
        changeValidate: function () {

            //请求 后台 是否需要验证码
            var form = new FormData();
            form.append("username", $("#username").val());

            $.ajax({
                url: url + "oauth/change_verify",
                type: 'POST',
                crossDomain: true,
                cache: false,
                data: form,
                processData: false,
                async: false,
                contentType: false,
                dataType: "json"
            }).done(function (res, a, c) {
                if (res != "dontneed" && res.indexOf("ddeenn") > -1) {
                    $.idcode.certusValidateCode = res.replace("ddeenn", "");
                    $.idcode.setCode();
                    $("#lcode").show();
                    $.idcode.setCode();
                } else {
                    $("#lcode").hide();
                }
            }).fail(function (res, a, b, c) {
                if (res.responseText) {
                    try {
                        layer.msg(eval("(" + res.responseText + ")").message);
                    } catch (e) {
                        layer.msg("用户名或密码,或验证码错误，请稍后重试");
                    }
                    return;
                }
                layer.msg("已经与服务器断连");
            });

        }
    };

    function _commSetting(option) {
        $.extend(settings, option);
    }

    function _storeData(dataLabel, data) {
        var store = $(_set.codeval).get(0);
        if (data) {
            $.data(store, dataLabel, data);
        } else {

            return $.data(store, dataLabel);
        }
    }

    function _setCodeStyle(eid, codeType, codeLength) {
        var codeObj = _createCode(settings.codeType.name, settings.codeType.len);
        if (codeObj == "逻辑错误") {
            var form = new FormData();
            form.append("username", $("#username").val());

            $.ajax({
                url: url + "oauth/change_verify",
                type: 'POST',
                crossDomain: true,
                cache: false,
                data: form,
                processData: false,
                contentType: false,
                dataType: "json"
            }).done(function (res, a, c) {

                if (res != "dontneed" && res.indexOf("ddeenn") > -1) {
                    $.idcode.certusValidateCode = res.replace("ddeenn", "");
                    $.idcode.setCode();
                    $("#lcode").show();
                    $.idcode.setCode();
                } else {
                    $("#lcode").hide();
                }
            }).fail(function (res, a, b, c) {
                if (res.responseText) {
                    try {
                        layer.msg(eval("(" + res.responseText + ")").message);
                    } catch (e) {
                        layer.msg("用户名或密码,或验证码错误，请稍后重试");
                    }
                    return;
                }
                layer.msg("已经与服务器断连");
            });
        } else {

        }

        var randNum = Math.floor(Math.random() * 6);
        var htmlCode = ''
        if (!settings.inputID) {
            htmlCode = '<span><input id="ehong-code-input" type="text" maxlength="4" /></span>';
        }
        htmlCode += '<div id="ehong-code" class="ehong-idcode-val ehong-idcode-val';
        htmlCode += String(randNum);
        htmlCode += '" href="#" onblur="return false" onfocus="return false" oncontextmenu="return false" onclick="$.idcode.setCode()">' + _setStyle(codeObj) + '</div>' + '<span id="ehong-code-tip-ck" class="ehong-code-val-tip" onclick="$.idcode.changeValidate()">' + settings.codeTip + '</span>';
        $(eid).html(htmlCode);
        _storeData(_set.storeLable, codeObj);

    }


    function _setStyle(codeObj) {
        var fnCodeObj = new Array();
        var col = new Array('#BF0C43', '#E69A2A', '#707F02', '#18975F', '#BC3087', '#73C841', '#780320', '#90719B', '#1F72D8', '#D6A03C', '#6B486E', '#243F5F', '#16BDB5');
        var charIndex;
        for (var i = 0; i < codeObj.length; i++) {
            charIndex = Math.floor(Math.random() * col.length);
            fnCodeObj.push('<font color="' + col[charIndex] + '">' + codeObj.charAt(i) + '</font>');
        }
        return fnCodeObj.join('');
    }

    function _createCode(codeType, codeLength) {
        var codeObj;


        if (codeType == 'follow') {
            codeObj = _createCodeFollow(codeLength);
        } else if (codeType == 'calc') {
            codeObj = _createCodeCalc(codeLength);
        } else {
            codeObj = "";
        }
        return codeObj;
    }

    function _createCodeCalc(codeLength) {
        var code1, code2, codeResult;
        var selectChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        var charIndex;
        for (var i = 0; i < codeLength; i++) {
            charIndex = Math.floor(Math.random() * selectChar.length);
            code1 += selectChar[charIndex];

            charIndex = Math.floor(Math.random() * selectChar.length);
            code2 += selectChar[charIndex];
        }
        return [parseInt(code1), parseInt(code2), parseInt(code1) + parseInt(code2)];
    }

    function _createCodeFollow(codeLength) {
        var code = "";
        return $.idcode.certusValidateCode;
    }

})(jQuery);


