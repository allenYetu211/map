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
        surveyOpType: ''
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
                sendRequest.GetCategory();
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
        GetFieldByReport: function(reportName,callback) {
            _API._G('SurveyManage.asmx/GetFieldByReport', {
                reportName:reportName
            }, function(data){
                console.log(data)
                callback(data.values);
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
                console.log(data)
            })
        }
    }
    sendRequest.GetCategory();
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
        console.log(storage.survey)
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

                        if(k!=2){
                            var select=$('<select></select>');
                            for(var key in Pro.values){
                                if(Pro.values[key]==storage.survey.data[j][k].value){
                                    select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                                }else{
                                    select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                                }
                            }
                        }else {
                            var select=$('<select class="TABLE"></select>');
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
        var flag=true;
        function IsNull(){
            var spans=$('#systemTableList span');
            spans.each(function(i,v){
                if(v.innerText==''){
                    alert('不能为空')
                    flag=false;
                    return false;
                }
            })
        }
        IsNull();

        function MsgTr1(v){
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
            // _obj['F_USERID']=v.getAttribute('data-id');
            surveyArr.push(_obj);
            console.log(_obj)
        }

        //--添--
        if(storage.notA&&flag){
            var surveyArr=[];
            $('._addTr').each(function(i,v){
                MsgTr1(v);
            })
            sendRequest.SurveyOp(surveyArr);
        }
        //--修--
        if(storage.notC&&flag){
            var surveyArr=[];
            $('#systemTableList ._deleteTr').each(function(i,v){
                MsgTr1(v);
            })
            sendRequest.SurveyOp(surveyArr);
        }
        // --删--
        if(storage.notD){
            var surveyArr=[];
            $('._deleteTr').each(function(i,v){
                if(v.className=='_deleteTr active'){
                    MsgTr1(v);
                }
            })
            sendRequest.SurveyOp(surveyArr);
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
            $('#systemTableList').find('tr').removeClass('action')
            $('.changeListData, .deleteListData').removeClass('active')
            $('._deleteTr,._addTr').removeClass('active')
            storage.surveyOpType = '0'
            storage.notA = true
            storage.notC = false
            storage.notD = false
            var tr=$('<tr class="_addTr" data-id="'+ -1 +'"></tr>');
            for(var k in storage.survey.columnPro){
                var td=$('<td></td>');
                var Pro=storage.survey.columnPro[k];
                switch (Pro.type){
                    case 'number':
                        var span=$('<span></span>')
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
    })



    //左边li选中
    $('body').on('click','.system-left-bar li',function(){
        $('.system-left-bar li').removeClass('active');
        $(this).addClass('active');
    })
    //目录管理
    var CatalogueOp;
    var li_active=0;
    //目录管理_新增
    $('.addCatalogue').click(function(){
        CatalogueOp=0;
        var last=$('.system-left-bar li:last').find('span').attr('categoryID');
        if(last=='-1'){
            return false
        }
        $('.system-left-bar li').removeClass('active');
        var li=$('<li class="active"><span categoryID="-1"></span><input type="text"class="change" ></li>');
        $('.catalogue').append(li);
        $('.system-left-bar li.active').find('span').hide().next().show();
        li.find('input').focus();
    })
    //目录管理_修改
    $('.changeCatalogue').click(function(){
        CatalogueOp=1;
        var li=$('.system-left-bar li.active');
        li.find('span').hide();
        li.find('input').show().focus();
    })
    //失去焦点
    $('body').on('blur','.system-left-bar li input',function(){
        var span=$(this).prev();
        var _val=$(this).val();
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
        var li=$('.system-left-bar li.active');
        var id=li.find('span').attr('categoryID');
        var name=li.find('span').text();
        if(name==''){
            return false;
        }else {
            sendRequest.CategoryOp(id,name);
        }
    })
    //获取表格
    var _categoryID;
    $('body').on('click','.system-left-bar li span',function(){
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
        var categoryID=$(this).attr('categoryID')
        _categoryID=categoryID;
        sendRequest.GetSurveyByCategory(categoryID);
    })
    //点击单元格
    $('body').on('click', '#systemTableList td', function() {
        var _infor = $(this).parents('._deleteTr').length > 0 ? true : false
        if (storage.notD) return;
        if (storage.notC && _infor) {
            $(this).find('input, select').show()
            $(this).find('input[type="text"]').focus()
            $(this).find('span').hide()
        } else if(storage.notA && !_infor) {
            $(this).find('input, select').show()
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
                for(var i in values){
                    var op=$('<option data-selectindex="'+ i +'">'+ values[i] +'</option>');
                    select.append(op);
                }
            })
        });
    })
})