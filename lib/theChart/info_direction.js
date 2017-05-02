define("info_direction", ['map', "jquery", "userservice" , 'chartInformations'], function(map, j, us, ch) {
    var flag=0;
    // dom操作


    /**
     *  数据存储仓库
     * */

    var storage = {

    }

    /**
     * 获取数据
     */
    ch.st(function(data) {
        storage.phase=data.terms;
        RenderPhase();
    });
    var sendRequest = {
        // 获取任务单元农户
        GetCategory: function() {
            ch.api.getCetCatgory('GetCategory', '', function(data){
                storage.category=data.category;
                RenderCategory();
                sendRequest.GetSurveyByCategory(1);
            })
        },
        GetSurveyByCategory: function(categoryID) {
            ch.api.getCetCatgory('GetSurveyByCategory', {
                categoryID: categoryID
            }, function(data){

            })
        }
    }

    //初始化
    sendRequest.GetCategory();

    /**
     * 渲染页面
     */
    function ChangePhase(index){
        $('#left-sidebar .phase li').removeClass('active');
        $('#left-sidebar .phase li:eq('+ index +')').addClass('active');
        $('#left-sidebar .phase-content').hide();
        $('#left-sidebar .phase-content:eq('+ index +')').show();
    }
    function RenderPhase(){
        for(var i in storage.phase){
            var li=$('<li class="button_d" data-id="'+ storage.phase[i].termID +'">');
            var h2=$('<h2>'+ storage.phase[i].termID +'</h2>');
            var h4=$('<h4>'+ storage.phase[i].termName +'</h4>');
            li.append(h2);
            li.append(h4);
            $('#left-sidebar .phase ul').append(li);
        }
        ChangePhase(flag);
    }
    function RenderCategory(){
        for(var i in storage.category){
            var option=$('<option></option>>');
            option.html(storage.category[i].categoryName);
            option.attr('value',storage.category[i].categoryID);
            $('#left-sidebar .task .select1').append(option);
        }
    }

    /*
    *用户操作
    * */

    $('#left-sidebar .phase .prev-btn').click(function(){
        if(flag>0){
            flag--;
            ChangePhase(flag);
        }
    });
    $('#left-sidebar .phase .next-btn').click(function(){
        if(flag<2){
            flag++;
            ChangePhase(flag);
        }
    });
    $('#left-sidebar .task .select1').change(function(){
        sendRequest.GetSurveyByCategory($(this).val());
    });
    $('#left-sidebar .task .select2').change(function(){
        sendRequest.GetSurveyTable(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
        sendRequest.GetSurveyData(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
    });

})
