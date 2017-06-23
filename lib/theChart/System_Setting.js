/**
 * Created by donggua on 2017/5/26.
 */
define('System_Setting', ['jquery','local', 'api'], function(jq, l, _API) {
    if (l._Lh !== 'System_Setting.html') {
        return
    }

    /**
     *  数据存储仓库
     * */

    var storage = {
        category:[],
        survey:{},
        notD: false,
        notA: false,
        notC: false,
        surveyOpType: '',

        mapGroup:[],
        baseMap:{},
        flag:'baseFlag'
    }



    /**
     *  ajax 开始
     * */
    var sendRequest = {
        // 1.11.1 获取分类目录接口
        GetCategory: function() {
            _API._G('TaskManage.asmx/GetCategory', '', function(data){
                storage.category=data.category;
                RenderCategory();
            })
        },
        // 1.11.2 分类目录操作接口
        CategoryOp: function(categoryID,categoryName) {
            _API._G('SurveyManage.asmx/CategoryOp', {
                categoryID:categoryID,
                categoryName:categoryName,
                opType:CatalogueOp
            }, function(data){
                if(data.success){
                    sendRequest.GetCategory();
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                    RenderCategory()
                }
            })
        },
        // 1.11.3 获取分类目录下调查对象接口
        GetSurveyByCategory: function(categoryID) {
            _API._G('SurveyManage.asmx/GetSurveyByCategory', {
                categoryID:categoryID
            }, function(data){
                storage.survey=data.survey;
                RenderSurveyTable();
            })
        },
        // 1.11.4 获取字段列表接口
        GetFieldByReport: function(reportName,callback,j) {
            _API._G('SurveyManage.asmx/GetFieldByReport', {
                reportName:reportName
            }, function(data){
                callback(data.values,j);
            })
        },
        // 1.11.5 调查对象操作接口
        SurveyOp: function(surveyArr) {
            var _obj={};
            _obj['survey']=surveyArr;
            _API._G('SurveyManage.asmx/SurveyOp', {
                survey:JSON.stringify(_obj),
                categoryID:_categoryID,
                opType:storage.surveyOpType
            }, function(data){
                if(data.success){
                    sendRequest.GetSurveyByCategory(_categoryID);
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                    sendRequest.GetSurveyByCategory(_categoryID);
                }
            })
        },
        // 1.11.6 生成调查对象数据接口
        GenerateSurvey: function() {
            _API._G('SurveyManage.asmx/GenerateSurvey', {
                categoryID:_categoryID
            }, function(data){
                if(data.success){
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                }
            })
        },
        // 1.12.1 获取分类目录接口
        GetMapGroup: function() {
            _API._G('BaseMapManage.asmx/GetMapGroup', '', function(data){
                storage.mapGroup=data.mapGroup;
                RendermapGroup();
            })
        },
        // 1.12.2 分类目录操作接口
        MapGroupOp: function(MapGroupID,MapGroupName) {
            _API._G('BaseMapManage.asmx/MapGroupOp', {
                MapGroupID:MapGroupID,
                MapGroupName:MapGroupName,
                opType:MapGroupOp
            }, function(data){
                if(data.success){
                    sendRequest.GetMapGroup();
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                    RendermapGroup()
                }
            })
        },
        // 1.12.3 获取分类目录下调查对象接口
        GetMapByGroup: function(mapGroupID) {
            _API._G('BaseMapManage.asmx/GetMapByGroup', {
                mapGroupID:mapGroupID
            }, function(data){
                storage.baseMap=data.baseMap;
                RenderBaseMapTable();
            })
        },
        // 1.12.4 获取属性字段（点选）接口
        GetAttributeField: function(tableName,callback,j) {
            _API._G('BaseMapManage.asmx/GetAttributeField', {
                tableName:tableName
            }, function(data){
                callback(data.values,j);
            })
        },
        // 1.12.5 调查对象操作接口
        BaseMapOp: function(baseMapArr) {
            var _obj={};
            _obj['baseMap']=baseMapArr;
            _API._G('BaseMapManage.asmx/BaseMapOp', {
                baseMap:JSON.stringify(_obj),
                mapGroupID:_MapGroupID,
                opType:storage.surveyOpType
            }, function(data){
                if(data.success){
                    sendRequest.GetMapByGroup(_MapGroupID);
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                    sendRequest.GetMapByGroup(_MapGroupID);
                }
            })
        }
    }
    sendRequest.GetCategory();
    sendRequest.GetMapGroup();
    /**
     *  ajax 结束
     * */



    /**
     * 渲染开始
     * */
    //渲染 1.11.1
    function RenderCategory(){
        $('.catalogue').html('');
        for(var i in storage.category){
            if(i==li_active){
                var li=$('<li class="active"></li>');
            }else{
                var li=$('<li></li>');
            }
            var span=$('<span categoryID="'+ storage.category[i].categoryID +'">'+ storage.category[i].categoryName +'</span>');
            var input=$('<input type="text" class="change" value="'+ storage.category[i].categoryName +'">');
            li.append(span);
            li.append(input);
            $('.catalogue').append(li);
        }
    }
    //渲染 1.11.3
    function RenderSurveyTable(){
        $('#systemTableList').html('');
        var tb=$('<table></table>')
        var tr1=$('<tr style="background: #e9eff4"></tr>');
        for(var i in storage.survey.column){
            var th=$('<th data-egField="'+ storage.survey.column[i].egField +'">'+ storage.survey.column[i].chField +'</th>')
            tr1.append(th)
        }
        tb.append(tr1);
        for(var j in storage.survey.data){
            var tr=$('<tr class="_deleteTr" data-id="'+ storage.survey.surveyID[j] +'"></tr>');
            for(var k in storage.survey.data[j]){
                var td=$('<td></td>');
                var Pro=storage.survey.columnPro[k];
                switch (Pro.type){
                    case 'number':
                        var span=$('<span>'+ storage.survey.data[j][k].value +'</span>')
                        var input=$('<input type="number" value="'+ storage.survey.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number_dic':
                        if(k==1||k==2){
                            for(var x in Pro.values){
                                if(Pro.values[x]==storage.survey.data[j][k].value){
                                    var span=$('<span data-selectindex="'+ x +'">'+ storage.survey.data[j][k].value +'</span>')
                                }
                            }
                        }else{
                            var span=$('<span>'+ storage.survey.data[j][k].value +'</span>')
                        }

                        if(k==2){
                            var select=$('<select class="TABLE" values=""></select>');
                            for(var key in Pro.values){
                                if(Pro.values[key]==storage.survey.data[j][k].value){
                                    // 默认选中，发请求获取values
                                    select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                                    sendRequest.GetFieldByReport(key,function(values,_j){
                                        $('#systemTableList .TABLE').eq(_j).attr('values',values);
                                        $('#systemTableList .TABLE').eq(_j).parent().nextAll().each(function(i,v){
                                            for(var _id in values){
                                                if(values[_id]==$(v).children(":first").text()){
                                                    $(v).children(":first").attr('data-selectIndex',_id);
                                                }
                                                $(v).children(":last").append($('<option data-selectIndex="'+ _id +'">'+ values[_id] +'</option>'))
                                            }
                                        })
                                    },j);
                                }else{
                                    select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                                }
                            }
                        }else {
                            var select=$('<select></select>');
                            for(var key in Pro.values){
                                if(Pro.values[key]==storage.survey.data[j][k].value){
                                    select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                                }else{
                                    select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                                }
                            }
                        }

                        td.append(span);
                        td.append(select);
                        break;
                }
                tr.append(td);
            }
            tb.append(tr);
        }
        $('#systemTableList').append(tb);
    }

    //渲染 1.12.1
    function RendermapGroup(){
        $('.base-map').html('');
        for(var i in storage.mapGroup){
            if(i==li1_active){
                var li=$('<li class="active"></li>');
            }else{
                var li=$('<li></li>');
            }
            var span=$('<span mapGroupID="'+ storage.mapGroup[i].mapGroupID +'">'+ storage.mapGroup[i].mapGroupName +'</span>');
            var input=$('<input type="text" class="change" value="'+ storage.mapGroup[i].mapGroupName +'">');
            li.append(span);
            li.append(input);
            $('.base-map').append(li);
        }
    }

    //渲染 1.12.3
    function RenderBaseMapTable(){
        $('#systemTableList').html('');
        var tb=$('<table></table>')
        var tr1=$('<tr style="background: #e9eff4"></tr>');
        for(var i in storage.baseMap.column){
            var th=$('<th data-egField="'+ storage.baseMap.column[i].egField +'">'+ storage.baseMap.column[i].chField +'</th>')
            tr1.append(th)
        }
        tb.append(tr1);
        for(var j in storage.baseMap.data){
            var tr=$('<tr class="_deleteTr" data-id="'+ storage.baseMap.mapID[j] +'"></tr>');
            for(var k in storage.baseMap.data[j]){
                var td=$('<td></td>');
                var Pro=storage.baseMap.columnPro[k];
                switch (Pro.type){
                    case 'string':
                        var span=$('<span>'+ storage.baseMap.data[j][k].value +'</span>')
                        var input=$('<input type="text" value="'+ storage.baseMap.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number':
                        var span=$('<span>'+ storage.baseMap.data[j][k].value +'</span>')
                        var input=$('<input type="number" value="'+ storage.baseMap.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number_dic':
                        var _span='';
                        for(var x in Pro.values){
                            if(Pro.values[x]==storage.baseMap.data[j][k].value){
                                _span=$('<span data-selectindex="'+ x +'">'+ storage.baseMap.data[j][k].value +'</span>')
                            }
                        }

                        if(k==4){
                            var select=$('<select class="origin" values=""></select>');
                            for(var key in Pro.values){
                                if(Pro.values[key]==storage.baseMap.data[j][k].value){
                                    // 默认选中，发请求获取values
                                    select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                                    sendRequest.GetAttributeField(key,function(values,_j){
                                        var _ul=$('.mulDic_ul ul').eq(_j);
                                        var arr=[];
                                        $('#systemTableList .origin').eq(_j).attr('values',values);
                                        var _v=$('#systemTableList .origin').eq(_j).parent().next();  //_v 最后一列td
                                        for(var l in values){
                                            if((storage.baseMap.data[_j][5].value.indexOf(values[l]))!==-1){
                                                var li=$('<li><label><input type="checkbox" checked data-id="'+ l +'" value="'+ values[l] +'">'+ values[l] +'</label></li>');
                                                arr.push(l)
                                            }else{
                                                var li=$('<li><label><input type="checkbox" data-id="'+ l +'" value="'+ values[l] +'">'+ values[l] +'</label></li>');
                                            }
                                            _ul.append(li);
                                        }
                                        $('#systemTableList .mulDic_div').eq(_j).prev().attr('data-arr',arr);
                                    },j);
                                }else{
                                    select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                                }
                            }
                        }else {
                            var select=$('<select></select>');
                            for(var key in Pro.values){
                                if(Pro.values[key]==storage.baseMap.data[j][k].value){
                                    select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                                }else{
                                    select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                                }
                            }
                        }

                        td.append(_span);
                        td.append(select);
                        break;

                    case 'number_mulDic':
                        var span=$('<span>'+ storage.baseMap.data[j][k].value +'</span>')
                        var div=$('<div class="mulDic_div"><input type="text" class="mulDic_input"><button class="mulDic_btn"><img src="images/chart/icon_bigmapfold.png"></button></div>');
                        var ul_div=$('<div class="mulDic_ul"></div>');
                        var ul=$('<ul></ul>');
                        var p=$('<p class="mulDic_p" style="background: #e9eff4;cursor: pointer; padding: 4px 5px; text-align: center">完成</p>')
                        ul_div.append(ul)
                        ul_div.append(p)
                        div.append(ul_div);
                        td.append(span);
                        td.append(div);
                        break;
                }
                tr.append(td);
            }
            tb.append(tr);
        }
        $('#systemTableList').append(tb);
    }

    //存储成功
    // function isSuccess(v){
    //     $('.show-success h3').text(v)
    //     $('.show-success').show(400);
    //     setTimeout(function(){
    //         $('.show-success').hide(400);
    //     },1000)
    // }
    function isSuccess(v){
        $('.al-popup-prompt .al-prompt-informations').text(v)
        $('.al-popup-prompt').show(400);
    }

    /**
     * 渲染结束
     * */

    /**
     * DOM操作
     * */
    /**
     * 删除id
     */
    $('body').on('click', '._deleteTr', function() {
        if (!storage.notD) return
        $(this).toggleClass('active')
    })

    /**
     * 存储
     */
    $('.serverListData').on('click', function() {
        //底图管理
        function MsgTr1(v){
            var _obj={}
            for(var i in storage.baseMap.column){
                switch (storage.baseMap.columnPro[i].type){
                    case 'string':
                        _obj[storage.baseMap.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                    case 'number':
                        _obj[storage.baseMap.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                    case 'number_dic':
                        _obj[storage.baseMap.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-selectindex');
                        break;
                    case 'number_mulDic':
                        _obj[storage.baseMap.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-arr').split(',');
                        break;
                }
            }
            _obj['F_MAPID']=v.getAttribute('data-id');
            surveyArr.push(_obj);
        }
        function MsgTr2(v){
            var _obj={}
            for(var i in storage.baseMap.column){
                if(i<=3){
                    switch (storage.baseMap.columnPro[i].type){
                        case 'string':
                            _obj[storage.baseMap.column[i].egField]=$($(v).children().get(i)).find('span').text();
                            break;
                        case 'number':
                            _obj[storage.baseMap.column[i].egField]=$($(v).children().get(i)).find('span').text();
                            break;
                        case 'number_dic':
                            _obj[storage.baseMap.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-selectindex');
                            break;
                        case 'number_mulDic':
                            _obj[storage.baseMap.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-arr').split(',');
                            break;
                    }
                }else{
                    switch (storage.baseMap.columnPro[i].type){
                        case 'string':
                            _obj[storage.baseMap.column[i].egField]='';
                            break;
                        case 'number':
                            _obj[storage.baseMap.column[i].egField]='';
                            break;
                        case 'number_dic':
                            _obj[storage.baseMap.column[i].egField]='';
                            break;
                        case 'number_mulDic':
                            _obj[storage.baseMap.column[i].egField]='';
                            break;
                    }
                }
            }
            _obj['F_MAPID']=v.getAttribute('data-id');
            surveyArr.push(_obj);
        }
        if(storage.flag=='baseFlag'){
            var flag=true;
            function IsNull(){
                var tr=$('#systemTableList tr');
                tr.each(function(i,v){
                    $(v).find('td').each(function(_i,_v){
                        if($(_v).find('span').text()==''){
                            alert('不能为空');
                            RenderBaseMapTable()
                            flag=false;
                            return false;
                        }
                        if(_i==3&&$(_v).find('span').text()=='影像'){
                            return false
                        }
                    })
                })
            }
            IsNull();
            //--添--
            if(storage.notA&&flag){
                var surveyArr=[];
                $('._addTr').each(function(i,v){
                    if($(v).find('span').eq(3).text()=='影像'){
                        MsgTr2(v);
                    }else {
                        MsgTr1(v);
                    }
                })
                sendRequest.BaseMapOp(surveyArr);
            }
            //--修--
            if(storage.notC&&flag){
                var surveyArr=[];
                $('#systemTableList ._deleteTr').each(function(i,v){
                    if($(v).find('span').eq(3).text()=='影像'){
                        MsgTr2(v);
                    }else {
                        MsgTr1(v);
                    }
                })
                sendRequest.BaseMapOp(surveyArr);
            }
            // --删--
            if(storage.notD&&flag){
                var surveyArr=[];
                $('._deleteTr').each(function(i,v){
                    if(v.className=='_deleteTr active'){
                        if($(v).find('span').eq(3).text()=='影像'){
                            MsgTr2(v);
                        }else {
                            MsgTr1(v);
                        }
                    }
                })
                sendRequest.BaseMapOp(surveyArr);
            }
        }

        //目录管理
        function MsgTr3(v){
            var _obj={}
            for(var i in storage.survey.column){
                switch (storage.survey.columnPro[i].type){
                    case 'number':
                        _obj[storage.survey.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                    case 'number_dic':
                        _obj[storage.survey.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-selectindex');
                        break;
                }
            }
            _obj['F_SURVEYID']=v.getAttribute('data-id');
            surveyArr.push(_obj);
        }
        if(storage.flag=="catalogueFlag"){
            var flag=true;
            function IsNull(){
                var spans=$('#systemTableList span');
                spans.each(function(i,v){
                    if(v.innerText==''){
                        alert('不能为空')
                        RenderBaseMapTable()
                        flag=false;
                        return false;
                    }
                })
            }
            IsNull();
            //--添--
            if(storage.notA&&flag){
                var surveyArr=[];
                $('._addTr').each(function(i,v){
                    MsgTr3(v);
                })
                sendRequest.SurveyOp(surveyArr);
            }
            //--修--
            if(storage.notC&&flag){
                var surveyArr=[];
                $('#systemTableList ._changeTr').each(function(i,v){
                    MsgTr3(v);
                })
                sendRequest.SurveyOp(surveyArr);
            }
            // --删--
            if(storage.notD){
                var surveyArr=[];
                $('._deleteTr').each(function(i,v){
                    if(v.className=='_deleteTr active'){
                        MsgTr3(v);
                    }
                })
                sendRequest.SurveyOp(surveyArr);
            }
        }



        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
    })

    /**
     * 删除
     */
    $('.deleteListData').on('click', function() {
        $('#systemTableList').find('tr').removeClass('action')
        $(this).toggleClass('active')
        $('.addListData, .changeListData').removeClass('active')
        storage.surveyOpType = '2'
        storage.notD = !storage.notD
        storage.notA = false
        storage.notC = false
    })

    /**
     * 修改
     */
    $('.changeListData').on('click', function() {
        $('#systemTableList').find('tr').removeClass('action')
        $(this).toggleClass('active')
        $('.addListData, .deleteListData').removeClass('active')
        $('._deleteTr,._addTr').removeClass('active')
        storage.surveyOpType = '1'
        storage.notC = !storage.notC
        storage.notA = false
        storage.notD = false
    })
    
    /**
     * 新增
     */
    $('.addListData').on('click', function() {
        if(storage.flag=='baseFlag'){
            $('#systemTableList').find('tr').removeClass('action');
            $('.changeListData, .deleteListData').removeClass('active');
            $('._deleteTr,._addTr').removeClass('active');
            storage.surveyOpType = '0';
            storage.notA = true;
            storage.notC = false;
            storage.notD = false;
            var tr=$('<tr class="_addTr" data-id="'+ -1 +'"></tr>');
            for(var k in storage.baseMap.columnPro){
                var td=$('<td></td>');
                var Pro=storage.baseMap.columnPro[k];
                switch (Pro.type){
                    case 'string':
                        var span=$('<span></span>');
                        var input=$('<input type="text" value="">');
                        td.append(span);
                        td.append(input);
                        break;
                    case 'number':
                        var span=$('<span></span>');
                        var input=$('<input type="number" value="">');
                        td.append(span);
                        td.append(input);
                        break;
                    case 'number_dic':
                        var index=null;
                        if(k==4){
                            var select=$('<select class="origin"></select>');
                        }else{
                            var select=$('<select></select>');
                        }
                        for(var key in Pro.values){
                            if(index==null){
                                index=key;
                            }
                            select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                        }
                        var span=$('<span data-selectIndex="'+ index +'">'+ Pro.values[index] +'</span>');
                        td.append(span);
                        td.append(select);
                        break;
                    case 'number_mulDic':
                        var span=$('<span></span>')
                        var div=$('<div class="mulDic_div"><input type="text" class="mulDic_input"><button class="mulDic_btn"><img src="images/chart/icon_bigmapfold.png"></button></div>');
                        var ul_div=$('<div class="mulDic_ul"></div>');
                        var ul=$('<ul></ul>');
                        var p=$('<p class="mulDic_p" style="background: #e9eff4;cursor: pointer; padding: 4px 5px; text-align: center">完成</p>')
                        ul_div.append(ul)
                        ul_div.append(p)
                        div.append(ul_div);
                        td.append(span);
                        td.append(div);
                        break;
                }
                tr.append(td);
            }
            $('#systemTableList tbody').append(tr);
        }
        //目录管理
        if(storage.flag=='catalogueFlag'){
            $('#systemTableList').find('tr').removeClass('action');
            $('.changeListData, .deleteListData').removeClass('active');
            $('._deleteTr,._addTr').removeClass('active');
            storage.surveyOpType = '0';
            storage.notA = true;
            storage.notC = false;
            storage.notD = false;
            var tr=$('<tr class="_addTr" data-id="'+ -1 +'"></tr>');
            for(var k in storage.survey.columnPro){
                var td=$('<td></td>');
                var Pro=storage.survey.columnPro[k];
                switch (Pro.type){
                    case 'number':
                        var span=$('<span></span>');
                        var input=$('<input type="number" value="">');
                        td.append(span);
                        td.append(input);
                        break;
                    case 'number_dic':
                        var span=$('<span></span>');
                        if(k==2){
                            var select=$('<select class="TABLE"></select>');
                        }else{
                            var select=$('<select></select>');
                        }
                        for(var key in Pro.values){
                            select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                        }
                        td.append(span);
                        td.append(select);
                        break;
                }
                tr.append(td);
            }
            $('#systemTableList tbody').append(tr);
        }

    })



    //左边li选中
    $('body').on('click','.system-left-bar .catalogue li',function(){
        $('.system-left-bar .catalogue li').removeClass('active');
        $(this).addClass('active');
    })
    //目录管理
    var CatalogueOp;
    var li_active=0;
    //目录管理_新增
    $('.addCatalogue').click(function(){
        CatalogueOp=0;
        var last=$('.system-left-bar .catalogue li:last').find('span').attr('categoryID');
        if(last=='-1'){
            return false
        }
        $('.system-left-bar .catalogue li').removeClass('active');
        var li=$('<li class="active"><span categoryID="-1"></span><input type="text"class="change" ></li>');
        $('.catalogue').append(li);
        $('.system-left-bar .catalogue li.active').find('span').hide().next().show();
        li.find('input').focus();
    })
    //目录管理_修改
    var input_val;
    $('.changeCatalogue').click(function(){
        CatalogueOp=1;
        var li=$('.system-left-bar .catalogue li.active');
        input_val=li.find('input').val();
        li.find('span').hide();
        li.find('input').show().focus();
    })
    //失去焦点
    $('body').on('blur','.system-left-bar .catalogue li input',function(){
        var span=$(this).prev();
        var _val=$(this).val();
        if(_val=='' && CatalogueOp==1){
            alert('不能为空');
            $(this).val(input_val);
            $(this).hide();
            span.show();
            return false;
        }
        span.text(_val);
        $(this).hide();
        span.show();
        if(_val=='' && CatalogueOp==0){
            $(this).parent().remove();
        }else{
            $(this).parent().parent().find('li').each(function(i,v){
                if(v.className=='active'){
                    li_active=i;
                }
            })
            var id=span.attr('categoryID');
            var name=span.text();
            sendRequest.CategoryOp(id,name);
        }
    })
    //目录管理_删除
    $('.deleteCatalogue').click(function(){
        CatalogueOp=2;
        li_active='';
        var li=$('.system-left-bar .catalogue li.active');
        var id=li.find('span').attr('categoryID');
        var name=li.find('span').text();
        if(name==''){
            return false;
        }else {
            sendRequest.CategoryOp(id,name);
        }
    })
    //获取表格
    var _categoryID=1; //全局_categoryID
    $('body').on('click','.system-left-bar .catalogue li',function(){
        $('.tableList .createData').show();
        storage.flag = 'catalogueFlag'
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
        var categoryID=$(this).find('span').attr('categoryID')
        _categoryID=categoryID;
        sendRequest.GetSurveyByCategory(categoryID);
    })
    //点击单元格
    $('body').on('click', '#systemTableList td', function() {
        var _infor = $(this).parents('._deleteTr').length > 0 ? true : false
        if (storage.notD) return;
        if (storage.notC && _infor) {
            $(this).parent().addClass('_changeTr')
            $(this).find('input, select,.mulDic_div').show()
            $(this).find('input[type="text"]').focus()
            $(this).find('span').hide()
        } else if(storage.notA && !_infor) {
            $(this).find('input, select,.mulDic_div').show()
            $(this).find('input[type="text"]').focus()
            $(this).find('span').hide()
        }else {
            $('#systemTableList').find('tr').removeClass('action')
            $(this).parents('tr').addClass('action')
        }
    })

    $('body').on('blur', '#systemTableList td>input', function() {
        var replaceNew = $(this).val()
        $(this).val(replaceNew)
        $(this).prev().html(replaceNew)
        $(this).hide()
        $(this).prev().show()
    })

    $('body').on('change', '#systemTableList td>select', function() {
        var replaceNew=$(this).val()
        var dataSelectindex=$(this).find("option:selected").attr("data-selectindex");
        $(this).prev().html(replaceNew).attr("data-selectindex",dataSelectindex);
        $(this).hide()
        $(this).prev().show()
    })

    // 1.11.4 字段列表
    $('body').on('change', '#systemTableList td>select[class="TABLE"]', function() {
        var $this=$(this);
        var reportName=$(this).find("option:selected").attr("data-selectindex");
        sendRequest.GetFieldByReport(reportName,function(values){
            $this.parent().nextAll().each(function(i,v){
                var select=$(v).find('select');
                var span=$(v).find('span');
                select.html('');
                var f=true;
                for(var i in values){
                    if(f){
                        span.attr('data-selectindex',i);
                        span.text(values[i]);
                        f=false;
                    }
                    var op=$('<option data-selectindex="'+ i +'">'+ values[i] +'</option>');
                    select.append(op);
                }
            })
        });
    })

    //1.11.6 生成
    $('.tableList .createData').click(function(){
        sendRequest.GenerateSurvey();
    })

    // -----------------------底图管理-------------------------------

    //左边li选中
    $('body').on('click','.system-left-bar .base-map li',function(){
        $('.system-left-bar .base-map li').removeClass('active');
        $(this).addClass('active');
    })
    //底图管理
    var MapGroupOp;
    var li1_active=0;
    //底图管理_新增
    $('.addBaseMap').click(function(){
        MapGroupOp=0;
        var last=$('.system-left-bar .base-map li:last').find('span').attr('MapGroupID');
        if(last=='-1'){
            return false
        }
        $('.system-left-bar .base-map li').removeClass('active');
        var li=$('<li class="active"><span MapGroupID="-1"></span><input type="text" class="change" ></li>');
        $('.base-map').append(li);
        $('.system-left-bar .base-map li.active').find('span').hide().next().show();
        li.find('input').focus();
    })
    //底图管理_修改
    $('.changeBaseMap').click(function(){
        MapGroupOp=1;
        var li=$('.system-left-bar .base-map li.active');
        li.find('span').hide();
        li.find('input').show().focus();
    })
    //失去焦点
    $('body').on('blur','.system-left-bar .base-map li input',function(){
        var span=$(this).prev();
        var _val=$(this).val();
        span.text(_val);
        $(this).hide();
        span.show();
        if(_val=='' && MapGroupOp==0){
            $(this).parent().remove();
        }else{
            $(this).parent().parent().find('li').each(function(i,v){
                if(v.className=='active'){
                    li1_active=i;
                }
            })
            var id=span.attr('MapGroupID');
            var name=span.text();
            sendRequest.MapGroupOp(id,name);
        }
    })
    //底图管理_删除
    $('.deleteBaseMap').click(function(){
        MapGroupOp=2;
        li1_active='';
        var li=$('.system-left-bar .base-map li.active');
        var id=li.find('span').attr('MapGroupID');
        var name=li.find('span').text();
        if(name==''){
            return false;
        }else {
            sendRequest.MapGroupOp(id,name);
        }
    })
    //获取表格
    var _MapGroupID=1; //全局_MapGroupID
    sendRequest.GetMapByGroup(_MapGroupID);
    $('body').on('click','.system-left-bar .base-map li',function(){
        $('.tableList .createData').hide();
        storage.flag = 'baseFlag'
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
        var MapGroupID=$(this).find('span').attr('MapGroupID')
        _MapGroupID=MapGroupID;
        sendRequest.GetMapByGroup(MapGroupID);
    })
    // 1.12.4 字段列表
    $('body').on('change', '#systemTableList td>select[class="origin"]', function() {
        var $this=$(this);
        var tableName=$(this).find("option:selected").attr("data-selectindex");
        sendRequest.GetAttributeField(tableName,function(values){
            var _td=$this.parent().next();
            _td.find('ul').html('');
            _td.find('span').html('').attr('data-arr','');
            _td.find('.mulDic_input').val('');
            for(var l in values){
                var li=$('<li><label><input type="checkbox" data-id="'+ l +'" value="'+ values[l] +'">'+ values[l] +'</label></li>');
                _td.find('ul').append(li);
            }
        });
    })
    //-----下拉多选框------
    var mulDic_btn=true;
    $('body').on('click','#systemTableList .mulDic_btn',function(){
        if(mulDic_btn){
            $(this).next().css('display','block');
            mulDic_btn=false;
        }else {
            $(this).next().css('display','none');
            mulDic_btn=true
        }
    })
    $('body').on('click','.mulDic_ul input',function(){
        var _input=$(this).parent().parent().parent().parent().parent().find('.mulDic_input');
        var _span=$(this).parents('td').find('span');
        var arr=[];
        _input.val('');
        _span.text('');
        var _val=''
        $(this).parent().parent().parent().find('input').each(function(i,v){
            if(v.checked==true){
                _val+=v.value+' ';
                arr.push(v.getAttribute('data-id'))
            }
        })
        _span.attr('data-arr',arr)
        _input.val(_val)
        _span.text(_val)
    })
    $('body').on('click', '.mulDic_p', function() {
        $(this).parents('td').find('span').show();
        $(this).parent().hide()
        $(this).parent().parent().hide()
        mulDic_btn=true;
        return false;
    })
})