define('infor_reported', ['jquery', 'map', 'chartInformations', 'translatePopup'], function(jq, map, ch, c) {
    /**
     * 
     * Dom操作
     */


    /**
     * 
     * 发送请求
     */
    console.log(ch)
    var sendReques = {
        var _cms = new c._cookie()
        var code = _cms._getCookie('surveyCode')
        GetSurveyTree: function(_ys) {
            ch.api.getDevelopment('GetSurveyTree', {
                surveyCode: code,
                categoryID: '-1',
                isFrist: _ys || '1'
            }, function(data) {
                console.log(data)
            })
        }
    }
    sendReques.GetSurveyTree()

    /**
     * 
     * 页面渲染renderingDOM
     * 
     */

    var renderingDOM = {

    }

})