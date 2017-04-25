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
     *  数据存储仓库
     * */

    var storage = {
        phase:[],
        category:'',
        survey:'',
        surveyTable:{}
    }

    ch.st(function(data) {
        storage.phase=data.terms;
        RenderPhase();
    });
    function RenderPhase(){
        
    }

    /**
     * 获取数据
     */

    var sendRequest = {
        // 获取任务单元农户
        GetCategory: function() {
            ch.api.getCetCatgory('GetCategory', '', function(data){
                storage.category=data.category;
                RenderCategory();
            })
        },
        GetSurveyByCategory: function(categoryID) {
            ch.api.getCetCatgory('GetSurveyByCategory', {
                categoryID: categoryID
            }, function(data){
                storage.survey=data.survey;
                RenderSurvey();
                sendRequest.GetSurveyTable(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
                sendRequest.GetSurveyData(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
            })
        },
        GetSurveyTable: function(categoryID,surveyID) {
            console.log(categoryID,surveyID)
            ch.api.getCetCatgory('GetSurveyTable', {
                categoryID: categoryID,
                surveyID: surveyID
            }, function(data){
                storage.surveyTable=data.surveyTable;
                RenderSurveyTable();
            })
        },
        GetSurveyData: function(categoryID,surveyID) {
            console.log(categoryID,surveyID)
            ch.api.getCetCatgory('GetSurveyData', {
                categoryID: categoryID,
                surveyID: surveyID
            }, function(data){
                console.log(data)
            })
        }
    }
    //初始化
    sendRequest.GetCategory();
    sendRequest.GetSurveyByCategory(1);
    /**
     * 渲染页面
     */
    function RenderCategory(){
        for(var i in storage.category){
            var option=$('<option></option>>')
            option.html(storage.category[i].categoryName);
            option.attr('value',storage.category[i].categoryID);
            $('#left-sidebar .task .select1').append(option);
        }
    }
    function RenderSurvey(){
        $('#left-sidebar .task .select2').html('');
        for(var i in storage.survey){
            var option=$('<option></option>>')
            option.html(storage.survey[i].surveyName);
            option.attr('value',storage.survey[i].surveyID);
            $('#left-sidebar .task .select2').append(option);
        }
    }
    function RenderSurveyTable(){
        for(var i in storage.surveyTable){
            var item=$('<div class="item"></div>');
            var title=$('<p class="item-title">'+ i +'</p>');
            item.html(title);
            for(var j in storage.surveyTable[i]){
                var p = $('<p><label><input type="checkbox" data-id='+ storage.surveyTable[i][j].reportID +'>'+ storage.surveyTable[i][j].reportName +'</label><img src="./images/chart/icon_data_info.png" alt=""></p>');
                item.append(p);
            }
            $('.survey1 .content').append(item);
        }
    }


    $('#left-sidebar .task .select1').change(function(){
        sendRequest.GetSurveyByCategory($(this).val());
    });
    $('#left-sidebar .task .select2').change(function(){
        sendRequest.GetSurveyTable(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
        sendRequest.GetSurveyData(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
    });

})
