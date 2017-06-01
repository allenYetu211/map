/**
 * Created by donggua on 2017/5/26.
 */
define('Dic_Manage', ['jquery','local', 'api'], function(jq, l, _API) {
    if (l._Lh !== 'Dic_Manage.html') {
        return
    }

    /**
     *  数据存储仓库
     * */

    var storage = {
        dicTable:[]
    }



    /**
     *  ajax 开始
     * */
    var sendRequest = {
        // 1.13.1 获取字典表列表
        GetDicTable: function(content) {
            _API._G('DicManage.asmx/GetDicTable', {
                content:content
            }, function(data){
                storage.dicTable=data.dicTable;
                console.log(data)
                RenderDicTable();
            })
        },
        // 1.13.2 字典表操作
        GetDicTable: function(content) {
            _API._G('DicManage.asmx/GetDicTable', {
                content:content
            }, function(data){
                storage.dicTable=data.dicTable;
                console.log(data)
                RenderDicTable();
            })
        },


    }
    /**
     *  ajax 结束
     * */
    sendRequest.GetDicTable('1');


    /**
     * 渲染开始
     * */
    //渲染 1.11.1
    var li_active=0;
    function RenderDicTable(){
        $('.Dictionary').html('');
        for(var i in storage.dicTable){
            if(i==li_active){
                var li=$('<li class="active"></li>');
            }else{
                var li=$('<li></li>');
            }
            var span=$('<span dicID="'+ storage.dicTable[i].dicID +'">'+ storage.dicTable[i].dicName +'</span>');
            var input=$('<input type="text" class="change" value="'+ storage.dicTable[i].dicName +'">');
            li.append(span);
            li.append(input);
            $('.Dictionary').append(li);
        }
    }

    /**
     * 渲染结束
     * */

    /**
     * DOM操作
     * */

    //搜索按钮
    $('.SearchBtn').click(function(){
        var v=$(this).prev().val();
        sendRequest.GetDicTable(v);
    })
    //左边li选中
    $('body').on('click','.system-left-bar .Dictionary li',function(){
        $('.system-left-bar .Dictionary li').removeClass('active');
        $(this).addClass('active');
    })
    //目录管理
    var DictionaryOp;
    var li_active=0;
    //目录管理_新增
    $('.addDictionary').click(function(){
        DictionaryOp=0;
        var last=$('.system-left-bar .Dictionary li:last').find('span').attr('categoryID');
        if(last=='-1'){
            return false
        }
        $('.system-left-bar .Dictionary li').removeClass('active');
        var li=$('<li class="active"><span categoryID="-1"></span><input type="text"class="change" ></li>');
        $('.Dictionary').append(li);
        $('.system-left-bar .Dictionary li.active').find('span').hide().next().show();
        li.find('input').focus();
    })
    //目录管理_修改
    $('.changeDictionary').click(function(){
        DictionaryOp=1;
        var li=$('.system-left-bar .Dictionary li.active');
        li.find('span').hide();
        li.find('input').show().focus();
    })
    //失去焦点
    $('body').on('blur','.system-left-bar .Dictionary li input',function(){
        var span=$(this).prev();
        var _val=$(this).val();
        span.text(_val);
        $(this).hide();
        span.show();
        if(_val=='' && DictionaryOp==0){
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
    $('.deleteDictionary').click(function(){
        DictionaryOp=2;
        li_active='';
        var li=$('.system-left-bar .Dictionary li.active');
        var id=li.find('span').attr('categoryID');
        var name=li.find('span').text();
        if(name==''){
            return false;
        }else {
            sendRequest.CategoryOp(id,name);
        }
    })
})