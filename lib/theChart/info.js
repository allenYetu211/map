define("info", ['map', "jquery", "userservice" , 'chartInformations'], function(map, j, us, ch) {
    // dom操作
    var generate = $('#left-sidebar .mission .generate');
    var inventory = $('#left-sidebar .mission .inventory');

    // 全选
    $('#left-sidebar .selectAll').click(function(){
       $(this).parent().parent().parent().find('input').prop("checked", true);
    });
    // 取消
    $('#left-sidebar .unSelect').click(function(){
        $(this).parent().parent().parent().find('input').prop("checked", false);
    });

    generate.click(function(){
        alert(1);
    })


    /**
     * 获取数据
     */

    var sendRequest = {
        // GetSurveyTable: function() {
        //     ch.api.getDataManage('GetSurveyTable', {}, function(data) {
        //         storage.manage = data.surveyTable
        //         embellish.dAdminTree()
        //     })
        // },
        //
        //
        // GetReportData: function() {
        //     ch.api.getDataManage('GetReportData', {
        //         reportID: storage.reportid,
        //         categoriesID: storage.categoriesid,
        //         start: storage.showDataCount * (storage.newDataCount - 1),
        //         limit: storage.showDataCount * storage.newDataCount
        //     }, function(data) {
        //         storage.dataView = data.searchResult
        //         embellish.dataView()
        //     })
        // },
        //
        // ExportReportData: function() {
        //     ch.api.getDataManage('ExportReportData', {
        //         reportID: storage.reportid,
        //         categoriesID: storage.categoriesid
        //     }, function(data) {
        //         console.log(data)
        //     })
        // },

        // 获取任务单元农户
        GetCategory: function() {
            ch.api.getCetCatgory('GetCategory', '', function(data){
                console.log(data);
                alert(1);
            })
        }
    }
    sendRequest.GetCategory();

    /**
     * 渲染页面
     */
})
