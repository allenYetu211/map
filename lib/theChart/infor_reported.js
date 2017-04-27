define('infor_reported', ['jquery', 'map', 'chartInformations'], function(jq, map, ch) {
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
        GetSurveyTree: function(_ys) {
            ch.api.getDevelopment('GetSurveyTree', {
                surveyCode: ch.us_code,
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

})