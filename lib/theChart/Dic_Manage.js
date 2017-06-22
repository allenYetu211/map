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
        dicTable:[],
        dicData:{},
        notD: false,
        notA: false,
        notC: false,
        dicOpType:'',
        errorLog:{}
       
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
                RenderDicTable();
            })
        },
        // 1.13.2 字典表操作
        DicTableOp: function(dicChName,dicEgName,dicID,op) {
            _API._G('DicManage.asmx/DicTableOp', {
                dicChName:dicChName,
                dicEgName:dicEgName,
                dicID:dicID,
                opType:DictionaryOp
            }, function(data){
                console.log(data)
                if(data.success && op=='A'){
                    isSuccess('成功');
                    sendRequest.GetDicTable('');
                } else if(data.success && op=='C'){
                    isSuccess('成功');
                    sendRequest.GetDicTable(_searchVal);
                } else {
                    isSuccess(data.msg)
                }
            })
        },
        // 1.13.3 获取字典表数据
        GetDicData: function() {
            _API._G('DicManage.asmx/GetDicData', {
                dicID:_dicID
            }, function(data){
                console.log(data)
                storage.dicData=data.dicData;
                RenderDicDataTable()
            })
        },
        // 1.13.4 字典表数据操作
        DicDataOp: function(dicArr) {
            var _obj={};
            _obj['dicData']=dicArr;
            _API._G('DicManage.asmx/DicDataOp', {
                dicID:_dicID,
                dicData:JSON.stringify(_obj),
                opType:storage.dicOpType
            }, function(data){
                if(data.success){
                    isSuccess('成功');
                    sendRequest.GetDicData();
                }else {
                    isSuccess(data.msg)
                    sendRequest.GetDicData();
                }
            })
        },
        // 1.13.5 导入字典表数据
        ImportDicData: function() {
            var files = $('#file').prop('files');
            var fromInfor = new FormData();
            fromInfor.append("fileContent",$('#file')[0].files[0]);
            fromInfor.append('dicID',_dicID);
            console.log(fromInfor)
            _API._S('DicManage.asmx/ImportDicData', fromInfor, function(data){
                console.log(data)
                if(data.success){
                    isSuccess('成功');
                    sendRequest.GetDicData();
                }else {
                    storage.errorLog=data.errorLog;
                    RenderErrorLog();
                }
            })
        }
    }
    /**
     *  ajax 结束
     * */
    sendRequest.GetDicTable('');


    /**
     * 渲染开始
     * */
    //渲染 1.13.1
    function RenderDicTable(){
        $('.Dictionary').html('');
        for(var i in storage.dicTable){
            if(flagAC){
                if(i==li_active){
                    var li=$('<li class="active"></li>');
                }else{
                    var li=$('<li></li>');
                }
            }else {
                if(i==storage.dicTable.length-1){
                    var li=$('<li class="active"></li>');
                }else{
                    var li=$('<li></li>');
                }
            }

            var span=$('<span dicID="'+ storage.dicTable[i].dicID +'" dicEgName="'+ storage.dicTable[i].dicEgName +'">'+ storage.dicTable[i].dicChName +'</span>');
            li.append(span);
            $('.Dictionary').append(li);
        }
        flagAC=true;
    }
    //渲染表格
    function RenderDicDataTable(){
        $('#dicTableList').html('');
        var tb=$('<table></table>')
        var tr1=$('<tr style="background: #e9eff4"></tr>');
        for(var i in storage.dicData.column){
            var th=$('<th data-egField="'+ storage.dicData.column[i].egField +'">'+ storage.dicData.column[i].chField +'</th>')
            tr1.append(th)
        }
        tb.append(tr1);
        for(var j in storage.dicData.data){
            var tr=$('<tr class="_deleteTr" data-id="'+ storage.dicData.rowNum[j] +'"></tr>');
            for(var k in storage.dicData.data[j]){
                var td=$('<td></td>');
                var Pro=storage.dicData.columnPro[k];
                switch (Pro.type){
                    case 'number':
                        var span=$('<span>'+ storage.dicData.data[j][k].value +'</span>')
                        var input=$('<input type="number" value="'+ storage.dicData.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;
                    case 'string':
                        var span=$('<span>'+ storage.dicData.data[j][k].value +'</span>')
                        var input=$('<input type="text" value="'+ storage.dicData.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;
                }
                tr.append(td);
            }
            tb.append(tr);
        }
        $('#dicTableList').append(tb);
    }
    //导入错误提示
    function RenderErrorLog(){
        $('.errorLogBox').show();
        $('.errorLogBox .content').html('');
        var tb=$('<table></table>')
        var tr1=$('<tr style="font-weight: bold"></tr>');
        for(var i in storage.errorLog.column){
            var th=$('<th>'+ storage.errorLog.column[i] +'</th>')
            tr1.append(th)
        }
        tb.append(tr1);
        for(var j in storage.errorLog.data){
            var tr=$('<tr></tr>');
            for(var k in storage.errorLog.data[j]){
                var td=$('<td>'+ storage.errorLog.data[j][k].value +'</td>');
                tr.append(td);
            }
            tb.append(tr);
        }
        $('.errorLogBox .content').append(tb);
    }

    //存储成功
    function isSuccess(v){
        $('.show-success h3').text(v)
        $('.show-success').show(400);
        setTimeout(function(){
            $('.show-success').hide(400);
        },1000)
    }
    /**
     * 渲染结束
     * */

    /**
     * DOM操作
     * */

    //删除id

    $('body').on('click', '._deleteTr', function() {
        if (!storage.notD) return
        $(this).toggleClass('active')
    })

    /**
     * 存储
     */
    $('.serverListData').on('click', function() {
        // console.log(storage.dicOpType)
        // console.log('A',storage.notA)
        // console.log('C',storage.notC)
        // console.log('D',storage.notD)
        var flag=true;
        function IsNull(){
            var spans=$('#dicTableList span');
            spans.each(function(i,v){
                if(v.innerText==''){
                    alert('不能为空');
                    flag=false;
                    return false;
                }
            })
        }
        IsNull();

        //底图管理
        function MsgTr1(v){
            var _obj={};
            for(var i in storage.dicData.column){
                switch (storage.dicData.columnPro[i].type){
                    case 'string':
                        _obj[storage.dicData.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                    case 'number':
                        _obj[storage.dicData.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                }
            }
            _obj['ROWID']=v.getAttribute('data-id');
            dicArr.push(_obj);
        }

        //--添--
        if(storage.notA&&flag){
            var dicArr=[];
            $('._addTr').each(function(i,v){
                MsgTr1(v);
            });
            sendRequest.DicDataOp(dicArr);
        }
        //--修--
        if(storage.notC&&flag){
            var dicArr=[];
            $('#dicTableList ._deleteTr').each(function(i,v){
                MsgTr1(v);
            });
            sendRequest.DicDataOp(dicArr);
        }
        // --删--
        if(storage.notD){
            var dicArr=[];
            $('._deleteTr').each(function(i,v){
                if(v.className=='_deleteTr active'){
                    MsgTr1(v);
                }
            });
            sendRequest.DicDataOp(dicArr);
        }
        if(flag){
            storage.notA = false;
            storage.notC = false;
            storage.notD = false;
            $('.changeListData, .deleteListData').removeClass('active')
        }
    });

    /**
     * 删除
     */
    $('.deleteListData').on('click', function() {
        $('#dicTableList').find('tr').removeClass('action');
        $(this).toggleClass('active');
        $('.addListData, .changeListData').removeClass('active');
        storage.dicOpType = '2';
        storage.notD = !storage.notD;
        storage.notA = false
        storage.notC = false
    });

    /**
     * 修改
     */
    $('.changeListData').on('click', function() {
        $('#dicTableList').find('tr').removeClass('action');
        $(this).toggleClass('active');
        $('.addListData, .deleteListData').removeClass('active');
        $('._deleteTr,._addTr').removeClass('active');
        storage.dicOpType = '1';
        storage.notC = !storage.notC;
        storage.notA = false;
        storage.notD = false
    })

    /**
     * 新增
     */
    $('.addListData').on('click', function() {
        $('#dicTableList').find('tr').removeClass('action');
        $('.changeListData, .deleteListData').removeClass('active');
        $('._deleteTr,._addTr').removeClass('active');
        storage.dicOpType = '0';
        storage.notA = true;
        storage.notC = false;
        storage.notD = false;
        var tr=$('<tr class="_addTr" data-id="'+ -1 +'"></tr>');
        for(var k in storage.dicData.columnPro){
            var td=$('<td></td>');
            var Pro=storage.dicData.columnPro[k];
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
            }
            tr.append(td);
        }
        $('#dicTableList tbody').append(tr);
    })

    //搜索按钮
    var _searchVal='';
    $('.SearchBtn').click(function(){
        var v=$(this).prev().prev().val();
        console.log(v)
        _searchVal=v;
        li_active=0;
        sendRequest.GetDicTable(v);
    });
    //左边li选中
    $('body').on('click','.system-left-bar .Dictionary li',function(){
        $('.system-left-bar .Dictionary li').removeClass('active');
        $(this).addClass('active');
        $('.system-left-bar .Dictionary li')
    });
    //字典管理
    var DictionaryOp;
    var li_active=0;
    var flagAC=true;
    //字典管理_新增
    $('.addDictionary').click(function(){
        DictionaryOp=0;
        $('.dicA').show();
    });
    $('.dicA .confirm').click(function(){
        flagAC=false;
        var dicChName=$('.dicA .inputCN').val();
        var dicEgName=$('.dicA .inputEN').val();
        if(dicChName.length!=0 && dicEgName.length!=0){
            sendRequest.DicTableOp(dicChName,'TB_DIC_'+dicEgName,-1,'A');
            $('.dicA input').val('');
            $('.dicA').hide();
        }else {
            alert('不能为空');
        }
    });
    $('.dicA .cancel').click(function(){
        $('.dicA input').val('');
        $('.dicA').hide();
    });

    //字典管理_修改
    $('.changeDictionary').click(function(){
        DictionaryOp=1;
        $('.dicC').show();
        var span=$('.system-left-bar .Dictionary li.active').find('span');
        $('.dicC .inputCN').val(span.text());
        $('.dicC span').text(span.attr('dicEgName'));
    });
    $('.dicC .confirm').click(function(){
        var dicChName=$('.dicC .inputCN').val();
        var dicEgName=$('.dicA span').text();
        var dicID=$('.system-left-bar .Dictionary li.active').find('span').attr('dicID');
        if(dicChName.length!=0){
            sendRequest.DicTableOp(dicChName,'TB_DIC_'+dicEgName,dicID,'C');
            $('.dicC input').val('');
            $('.dicC').hide();
        }else {
            alert('不能为空');
        }
        $('.system-left-bar .Dictionary li').each(function(i,v){
            if(v.className=='active'){
                li_active=i;
            }
        })
    });
    $('.dicC .cancel').click(function(){
        $('.dicC input').val('');
        $('.dicC').hide();
    });

    //字典管理_删除
    $('.deleteDictionary').click(function(){
        DictionaryOp=2;
        li_active='';
        var li=$('.system-left-bar .Dictionary li.active');
        var dicID=li.find('span').attr('dicID');
        var dicEgName=li.find('span').attr('dicEgName');
        var dicChName=li.find('span').text();
        if(dicChName==''){
            return false;
        }else {
            sendRequest.DicTableOp(dicChName,dicEgName,dicID,'C');
        }
    });

    //1.13.3 表格
    var _dicID='';
    $('body').on('click','.system-left-bar .Dictionary li span',function(){
        storage.notA = false;
        storage.notC = false;
        storage.notD = false;
        $('.changeListData, .deleteListData').removeClass('active');
        var dicID=$(this).attr('dicID');
        _dicID=dicID;
        sendRequest.GetDicData();
    })

    //点击单元格
    $('body').on('click', '#dicTableList td', function() {
        var _infor = $(this).parents('._deleteTr').length > 0 ? true : false
        if (storage.notD) return;
        if (storage.notC && _infor) {
            $(this).find('input').show();
            $(this).find('input[type="text"]').focus();
            $(this).find('span').hide()
        } else if(storage.notA && !_infor) {
            $(this).find('input, select,.mulDic_div').show();
            $(this).find('input[type="text"]').focus();
            $(this).find('span').hide()
        }else {
            $('#dicTableList').find('tr').removeClass('action');
            $(this).parents('tr').addClass('action')
        }
    })

    $('body').on('blur', '#dicTableList td>input', function() {
        var replaceNew = $(this).val();
        $(this).val(replaceNew);
        $(this).prev().html(replaceNew);
        $(this).hide();
        $(this).prev().show()
    });
    //导入
//  $('.export').click(function(){
//  	$(".errorLogBox").show();
//      //sendRequest.ImportDicData();
//  });
//   $(".errorLogBox .confirm").click(function(){
//      sendRequest.ImportDicData();
//      
//  })
    $('.errorLogBox .closeBox').click(function(){
        $('.errorLogBox').hide();
    });

    //-------拖拽-------
    $(document).ready(function(){
        $(".errorLogBox").mousedown(function(e){ //e鼠标事件
            $(this).css("cursor","move");//改变鼠标指针的形状

            var offset = $(this).offset();//DIV在页面的位置
            var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离
            var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离
            $(document).bind("mousemove",function(ev){ //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
                $(".errorLogBox").stop();//加上这个之后

                var _x = ev.pageX - x;//获得X轴方向移动的值
                var _y = ev.pageY - y;//获得Y轴方向移动的值

                $(".errorLogBox").animate({left:_x+"px",top:_y+"px"},10);
            });
        });

        $(document).mouseup(function(){
            $(".errorLogBox").css("cursor","default");
            $(this).unbind("mousemove");
        });
    });
	//搜索框点击清空
    $('.dicSearch-close').click(function () {
    	$(this).siblings("input").val("");
    	sendRequest.GetDicTable('');
	})
    //上传
    $('input.file').change(function(){
		sendRequest.ImportDicData();
		$('#file').val('')
	});
})