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
        survey:{}
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
                        var span=$('<span>'+ storage.survey.data[j][k].value +'</span>')
                        var select=$('<select></select>');
                        for(var key in Pro.values){
                            if(Pro.values[key]==storage.survey.data[j][k].value){
                                select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                            }else{
                                select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
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
    $('body').on('click','.system-left-bar li span',function(){
        var categoryID=$(this).attr('categoryID')
        sendRequest.GetSurveyByCategory(categoryID);
    })
})