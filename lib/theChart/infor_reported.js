define('infor_reported', ['jquery', 'map', 'chartInformations', 'translatePopup'], function(jq, map, ch, c) {
    /**
     * 
     * Dom操作
     */

    var storage = {
        cookie: ''
    }

    ch.su.sendUser()

    var serverCode = {
        sendSurvey: function(code) {
            sendReques.GetSurveyTree(code)
        }
    }

    /**
     * 
     * 发送请求
     */
    var sendReques = {
        GetSurveyTree: function(code, _ys) {
            ch.api.getDevelopment('GetSurveyTree', {
                surveyCode: code,
                categoryID: '-1',
                isFrist: _ys || '1'
            }, function(data) {
                console.log(data)
            })
        }
    }


    /**
     * 
     * 页面渲染renderingDOM
     * 
     */

    var renderingDOM = {

    }
    return {
        S: serverCode.sendSurvey
    }

})