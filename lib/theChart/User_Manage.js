/**
 * Created by donggua on 2017/5/5.
 */
define('userManagement', ['jquery', 'api'], function(jq, _API) {

    /**
     *  数据存储仓库
     * */

    var storage = {

    }

    var sendRequest = {
        // 1.6.2 获取分类目录接口
        // GetCategory: function() {
        //     _API._G('TaskManage.asmx/GetCategory', '', function(data){
        //         storage.category=data.category;
        //         RenderCategory();
        //         sendRequest.GetSurveyByCategory(1);
        //     })
        // },
        // //1.6.3 获取分类目录下的调查对象接口
        // GetSurveyByCategory: function(categoryID) {
        //     _API._G('TaskManage.asmx/GetSurveyByCategory', {
        //         categoryID: categoryID
        //     }, function(data){
        //         storage.survey=data.survey;
        //         RenderSurvey();
        //         sendRequest.GetSurveyTable(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
        //         sendRequest.GetSurveyData(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
        //     })
        // }

    }


})