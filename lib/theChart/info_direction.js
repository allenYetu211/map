define("info_direction", ['map', "jquery", "userservice" , 'chartInformations'], function(map, j, us, ch) {
    var flag=0;
    // dom操作


    /**
     *  数据存储仓库
     * */

    var storage = {
        phase:[],
        category:[],
        task:{}
    }

    /**
     * 获取数据
     */
    //1.7.1	获取调查期接口
    ch.st(function(data) {
        storage.phase=data.terms;
        RenderPhase();
    });
    var sendRequest = {
        // 1.7.2 获取分类目录接口
        GetCategory: function() {
            ch.api.getCetCatgory('GetCategory', '', function(data){
                storage.category=data.category;
                RenderCategory();
                init();
            })
        },
        //1.7.3 获取任务列表接口
        GetTask: function(termID,categoryID,status) {
            ch.api.getCetCatgory('GetTask', {
                termID: termID,
                categoryID: categoryID,
                status: status
            }, function(data){
                storage.task=data.task;
                console.log(data);
                RenderGetTask();
            })
        }
    }

    //初始化
    sendRequest.GetCategory();
    function init(){
        var termID=flag+1;
        var categoryID=$('#left-sidebar .classify .select1').val();
        var status=$('#left-sidebar .tab-page li[class="active"]').attr('data-status');
        sendRequest.GetTask(termID,categoryID,status);
    }
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
            $('#left-sidebar .classify .select1').append(option);
        }
    }
    function RenderGetTask(){
        $('#left-sidebar ._table').html('');
        var tb=$('<table></table>');
        var tr1=$('<tr></tr>');
        for(var i in storage.task.column){
            var th=$('<th>'+ storage.task.column[i] +'</th>');
            tr1.append(th);
        }
        tb.append(tr1);

        for(var j in storage.task.data){
            var tr=$('<tr data-taskID='+ storage.task.taskID[j] +'></tr>');
            for(var k in storage.task.data[j]) {
                var td=$('<td>'+ storage.task.data[j][k].value +'</td>');
                tr.append(td);
            }
            tb.append(tr);
        }
        $('#left-sidebar ._table').append(tb);
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
    $('#left-sidebar .classify .select1').change(function(){

    });


})
