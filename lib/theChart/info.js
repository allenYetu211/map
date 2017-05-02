define("info", ['map', "jquery", "userservice" , 'chartInformations'], function(map, j, us, ch) {




    // dom操作
    var generate = $('#left-sidebar .mission .generate');
    var inventory = $('#left-sidebar .mission .inventory');
    var flag=0;
    // 全选
    $('#left-sidebar .selectAll').click(function(){
       $(this).parent().parent().parent().find('input').prop("checked", true);
    });
    // 取消
    $('#left-sidebar .unSelect').click(function(){
        $(this).parent().parent().parent().find('input').prop("checked", false);
    });

    /**
     *  数据存储仓库
     * */

    var storage = {
        phase:[],
        category:'',
        survey:'',
        surveyTable:{},
        surveyData:[],
        task:{},
        // 记录任务清单输入
        sureTask:''
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
                storage.survey=data.survey;
                RenderSurvey();
                sendRequest.GetSurveyTable(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
                sendRequest.GetSurveyData(($('#left-sidebar .task .select1').val()),($('#left-sidebar .task .select2').val()));
            })
        },
        GetSurveyTable: function(categoryID,surveyID) {
            ch.api.getCetCatgory('GetSurveyTable', {
                "categoryID": categoryID,
                "surveyID": 3
            }, function(data){
                storage.surveyTable=data.surveyTable;
                RenderSurveyTable();
            })
        },
        GetSurveyData: function(categoryID,surveyID) {
            ch.api.getCetCatgory('GetSurveyData', {
                "categoryID": categoryID,
                "surveyID": 3
            }, function(data){
                storage.surveyData=data.surveyData;
                RenderSurveyData();
            })
        },
        // 1.6.7任务生成接口
        GenerateTask: function(termID,categoryID,surveyID,_surveyTable, _surveyData) {
            console.log('222')
            ch.api.getCetCatgory('GenerateTask', {
                "termID": termID,
                "categoryID": categoryID,
                "surveyID": surveyID,
                "surveyTable": JSON.stringify(_surveyTable),
                "surveyData": JSON.stringify(_surveyData)
            }, function(data){
                if(data.success==true){
                    setTimeout(function () {
                        $('#progress-bar').hide();
                        $('#generate-success h3').text('任务生成成功');
                        $('#generate-success').show();
                    },2000)
                }else{
                    setTimeout(function () {
                        $('#progress-bar').hide();
                        $('#generate-success h3').text('任务生成失败');
                        $('#generate-success').show();
                    },2000)
                }
            })
        },
        //1.6.8	获取生成任务列表接口
        GetGenerateTask: function(content) {
            ch.api.getCetCatgory('GetGenerateTask', {"content":content}, function(data){
                if(data.success){
                    storage.task=data.task;
                    RenderGetGenerateTask();
                }
            })
        },
        //1.6.9 删除任务接口
        DeleteTask: function(arr) {
            var _obj = {}
            _obj['taskID'] = arr
            ch.api.getCetCatgory('DeleteTask', {"taskID": JSON.stringify(_obj)}, function(data){
                if(data.success==true){
                    sendRequest.GetGenerateTask(sureTask);
                }
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
    function RenderSurvey(){
        $('#left-sidebar .task .select2').html('');
        for(var i in storage.survey){
            var option=$('<option></option>>');
            option.html(storage.survey[i].surveyName);
            option.attr('value',storage.survey[i].surveyID);
            $('#left-sidebar .task .select2').append(option);
        }
    }
    function RenderSurveyTable(){
        $('.survey1 .content').html('');
        for(var i in storage.surveyTable){
            var item=$('<div class="item"></div>');
            var title=$('<p class="item-title">'+ i +'</p>');
            item.html(title);
            for(var j in storage.surveyTable[i]){
                if(storage.surveyTable[i][j].isSelect=='ture'){
                    var p = $('<p><label><input type="checkbox" checked data-id='+ storage.surveyTable[i][j].reportID +'>'+ storage.surveyTable[i][j].reportName +'</label><img src="./images/chart/icon_data_info.png" alt=""></p>');
                }else{
                    var p = $('<p><label><input type="checkbox" data-id='+ storage.surveyTable[i][j].reportID +'>'+ storage.surveyTable[i][j].reportName +'</label><img src="./images/chart/icon_data_info.png" alt=""></p>');
                }
                item.append(p);
            }
            $('.survey1 .content').append(item);
        }
    }
    function RenderSurveyData(){
        $('.survey2 .content').html('');
        // var _su = storage.surveyData
        // var ct = '<div>'
        // _su.forEach(function(_val) {
        //
        //     for ( var _k in _val) {
        //         ct += '<ul><li><p class="city">' + _k +'</p>'
        //         _val[_k].forEach(function(_v) {
        //             ct += '<ul>'
        //             for (var _j in _v) {
        //                 ct += '<li><p class="town">&nbsp;&nbsp;' + _j + '</p>' + '<ul>'
        //                 _v[_j].forEach(function(_va) {
        //                     // ct += '<li>' + _va.dataName + '</li>'
        //                     ct += '<li class="village"><label><input type="checkbox" data-code="'+ _va.dataCode +'" data-name="'+ _va.dataName +'">'+ _va.dataName +'</label></li>'
        //                 })
        //                 ct += '</ul></li>'
        //             }
        //             ct += '</ul>'
        //         })
        //         ct += '</li></ul>'
        //
        //     }
        //     ct += '</div>'
        //
        // })
        // $('.survey2 .content').append(ct);
    }
    // 渲染任务清单表格
    function RenderGetGenerateTask(){
        $('#GetTask .content').html('');
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
        $('#GetTask .content').append(tb);
    }



    // 进度条
    var progress_flag=true;
    var value = 0;
    function Progress() {
        $('#progress-bar').show();
        var Interval=setInterval(function(){
            value+=2;
            if(value>=90){
                clearInterval(Interval);
            }
            $('#progress-bar .progress-bar').css("width",value + "%").text(value + "%");
        },40);
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
    // 任务生成
    $('#left-sidebar .mission .generate').click(function(){
        // termID,categoryID,surveyID,surveyTable,surveyData
       if(progress_flag){
           progress_flag=false;
           var termID=$('#left-sidebar .phase li.active').data('id');
           var categoryID=$('#left-sidebar .task .select1').val();
           var surveyID=$('#left-sidebar .task .select2').val();
           var _surveyTable = {}
           var _surveyData = {}
           var surveyTable= [];
           $('#left-sidebar .survey1 input[type=checkbox]').each(function(i,el){
               if(el.checked){
                   surveyTable.push(el.dataset.id);
               }1
           });
           var surveyData=[];
           $('#left-sidebar .survey2 input[type=checkbox]').each(function(i,el){
               if(el.checked){
                   var surveyObj={};
                   surveyObj.dataName=el.dataset.name;
                   surveyObj.dataCode=el.dataset.code;
                   surveyData.push(surveyObj);
               }
           });
           _surveyTable['surveyTable'] = surveyTable;
           _surveyData['surveyData'] = surveyData;
           sendRequest.GenerateTask(termID,categoryID,surveyID,_surveyTable, _surveyData);
           // 进度条
           Progress();
       }
    });
    // 任务生成成功-取消
    $('#generate-success img').click(function(){
       $('#generate-success').hide();
       value=0;
        $('#progress-bar .progress-bar').css("width",value + "%").text(value + "%");
        progress_flag=true;
    })

    // 查看任务
    $('.survey1 .content').delegate('img','click',function(){
        var reportID=$(this).parent().find('input').attr('data-id');
        $('#task-table').show();
        $('#inforIframe')[0].contentWindow.ins_displaySheet()
        $('#inforIframe')[0].contentWindow.ins_sheetPanel(reportID, 15, false)
    })
    //关闭查看任务
    $('#task-table h3 img').click(function(){
        $('#task-table').hide();
    })

    //点击任务清单
    $('#left-sidebar .mission .inventory').click(function(){
        $('#GetTask').show();
        sureTask='';
        sendRequest.GetGenerateTask(sureTask);
    })
    //关闭任务清单
    $('#GetTask h3 img').click(function(){
        $('#GetTask').hide();
    })
    //任务清单搜索
    $('#GetTask-search .selectSearchbar').click(function(){
        sureTask=$('#GetTask-search input').val();
        sendRequest.GetGenerateTask(sureTask);
    })
    // 任务清单清楚搜索
    $('#GetTask-search .close').click(function(){
        sureTask='';
        sendRequest.GetGenerateTask(sureTask);
    })
    //任务清单行
    $('#GetTask .content').delegate('tr','click',function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        }else{
            $(this).addClass('active');
        }
    })
    //任务清单删除
    $('#GetTask .delete').click(function(){
        $('#GetTask .make-sure').show();
    })
    $('#GetTask .make-sure .cancel').click(function(){
        $('#GetTask .make-sure').hide();
    })
    $('#GetTask .make-sure .sure').click(function(){
        $('#GetTask .make-sure').hide();
        var arr=[];
        $('#GetTask .content tr').each(function(i,v){
            if(v.className=='active'){
                arr.push(parseInt(v.getAttribute('data-taskid')));
            }
        })
        sendRequest.DeleteTask(arr);
    })
})
