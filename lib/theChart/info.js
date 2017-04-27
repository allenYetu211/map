define("info", ['map', "jquery", "userservice" , 'chartInformations'], function(map, j, us, ch) {


            // $('#inforIframe')[0].contentWindow.ins_displaySheet()
            // $('#inforIframe')[0].contentWindow.ins_sheetPanel(storage.reportID, 15, false)


    // })

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
        surveyData:[]
    }

    /**
     * 获取数据
     */
    ch.st(function(data) {
        storage.phase=data.terms;
        console.log(storage.phase)
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
                console.log('data:', data)
                storage.surveyData=data.surveyData;
                RenderSurveyData();
            })
        },
        // 1.6.7任务生成接口
        GenerateTask: function(termID,categoryID,surveyID,_surveyTable, _surveyData) {
            ch.api.getCetCatgory('GenerateTask', {
                "termID": termID,
                "categoryID": categoryID,
                "surveyID": surveyID,
                "surveyTable": JSON.stringify(_surveyTable),
                "surveyData": JSON.stringify(_surveyData)
            }, function(data){
                if(data.success==true){
                    setTimeout(function () {
                        alert("成功");
                    },2000)
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
        // storage.surveyData 数组
        // for(var i in storage.surveyData){  //循环得到多少个市
        //     var item=$('<div class="item"></div>');
        //     console.log(storage.surveyData[i])
        //     for(var j in storage.surveyData[i]){
        //         // storage.surveyData[i] 对象     storage.surveyData[i][j] 数组
        //         var city=$('<p class="item-title">'+ storage.surveyData[i][j] +'</p>');
        //         item.append(city);
        //         for(var k in storage.surveyData[i][j]){
        //             // storage.surveyData[i][j][k] 对象 {XX镇：数组}
        //             for(var z in storage.surveyData[i][j][k]){
        //                 var town=$('<p>&nbsp;&nbsp;'+ storage.surveyData[i][j][k][z] +'</p>');
        //                 item.append(town);
        //                 for(var x in storage.surveyData[i][j][k][z]){
        //                     // storage.surveyData[i][j][k][z][x] 最里层对象
        //                     var data=storage.surveyData[i][j][k][z][x];
        //                     var village=$('<p class="village"><label><input type="checkbox" data-code="'+ data.dataCode +'" data-name="'+ data.dataName +'">'+ data.dataName +'</label></p>');
        //                     item.append(village);
        //                 }
        //             }
        //         }
        //     }
        //     $('.survey2 .content').append(item);
        // }
        var _su = storage.surveyData
        var ct = '<div>'
        _su.forEach(function(_val) {

            for ( var _k in _val) {
                ct += '<ul><li><p class="city">' + _k +'</p>'
                _val[_k].forEach(function(_v) {
                    ct += '<ul>'
                    for (var _j in _v) {
                        console.log(_v[_j])
                        ct += '<li><p class="town">&nbsp;&nbsp;' + _j + '</p>' + '<ul>'
                        _v[_j].forEach(function(_va) {
                            // ct += '<li>' + _va.dataName + '</li>'
                            ct += '<li class="village"><label><input type="checkbox" data-code="'+ _va.dataCode +'" data-name="'+ _va.dataName +'">'+ _va.dataName +'</label></li>'
                        })
                        ct += '</ul></li>'
                    }
                    ct += '</ul>'
                })
                ct += '</li></ul>'

            }
            ct += '</div>'

        })
        $('.survey2 .content').append(ct);
    }
    // 进度条
    var value = 0;
    function Progress() {
        $('#progress-bar').show();
        var Interval=setInterval(function(){
            value++;
            if(value>=80){
                clearInterval(Interval);
            }
            $('#progress-bar .progress-bar').css("width",value + "%").text(value + "%");
        },50);
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
        var termID=$('#left-sidebar .phase li.active').data('id');
        var categoryID=$('#left-sidebar .task .select1').val();
        var surveyID=$('#left-sidebar .task .select2').val();
        var _surveyTable = {}
        var _surveyData = {}
        var surveyTable= [];
        $('#left-sidebar .survey1 input[type=checkbox]').each(function(i,el){
            if(el.checked){
                surveyTable.push(el.dataset.id);
            }
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
    });
})
