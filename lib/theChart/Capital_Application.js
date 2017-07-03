/**
 * Created by donggua on 2017/6/7
 */
define('Capital_Application', ['jquery','local', 'api'], function(jq, l, _API) {
    if (l._Lh !== 'Capital_Application.html') {
        return
    }

    /**
     *  数据存储仓库
     * */

    var storage = {
       	userID:l._Lg('___userID'),
        userID:239,
        application:[],
        applicationTotal:'',
        approval:[],
        approvalTotal:'',
        showDataCount: '',
        newDataCount: '',
        Counts: '',
        
        appID:'',
        column:'',
        data:'',
        isSubmit:'',
        
        id:'',
        type:'',
        
        reportID:'',
        code:'',
        status:'',
        opinion:'',
        changeFlag:false
        
    }
	
    //console.log(storage.userID)
	
    /**
     *  ajax 开始
     * */
    var sendRequest = {
        // 1.11.1 获取分类目录接口
        GetAppliAppro: function(userID) {
            _API._G('AppManage.asmx/GetAppliAppro', {
               userID:userID
            }, function(data){
                storage.application=data.application;
                storage.applicationTotal=data.applicationTotal;
                storage.approval=data.approval;
                storage.approvalTotal=data.approvalTotal;
                renderApplication();
                renderApproval();
            })
        },
        // 1.11.2 获取申请/审批详情
        GetAppDetail: function(userID,id,type,content) {
            _API._G('AppManage.asmx/GetAppDetail', {
                userID:userID,
                id:id,
                type:type,
                content:content,
                start: storage.showDataCount * (storage.newDataCount - 1),
                limit: storage.showDataCount * storage.newDataCount
            }, function(data){
                storage.appID = data.appDetail.appID;
                storage.column = data.appDetail.column;
                storage.data = data.appDetail.data;
                storage.isSubmit = data.appDetail.isSubmit;
                pending()
                renderTable()  
                add()
                //console.log(data.appDetail.appID)
            })
        },
        GetApplicationNum:function(id){
        	_API._G('AppManage.asmx/GetApplicationNum', {
                id:id,
            }, function(data){
              	storage.code =  data.applicationNum;
            })
        },
        ApplicationApproval:function(userID,appID,status,opinion){
        	_API._G('AppManage.asmx/ApplicationApproval', {
                userID:userID,
                appID:appID,
                status:status,
                opinion:opinion
          }, function(data){
              	if(data.success){
                    isSuccess('成功')
                    sendRequest.GetAppliAppro(storage.userID);
                    renderApproval()
                }else {
                    isSuccess(data.msg)
                }
            })
        },
        LaunchApplication:function(userID,id){
        	_API._G('AppManage.asmx/LaunchApplication', {
                userID:userID,
               	id:id
           	}, function(data){
              	if(data.success){
                    isSuccess('成功')
                    sendRequest.GetAppliAppro(storage.userID);
                    renderApplication()
                    sendRequest.GetAppDetail(storage.userID,1,0,'');
                }else {
                    isSuccess(data.msg)
                }
            })
        },
    }
    /**
     *  ajax 结束
     * */

    // 初始化
    sendRequest.GetAppliAppro(storage.userID);
	sendRequest.GetAppDetail(storage.userID,1,0,'');
	
	//显示和隐藏角色样式
	
	setTimeout(function(){
		if(storage.applicationTotal != 0){
			$('div.application').css('display','block');
			$('div.approval').css('display','none');
			$('body').find('a:contains(审批)').addClass('.font_color');
		}
		if(storage.approvalTotal !=0){
			$('div.approval').css('display','block');
			$('div.application').css('display','none');
			approval();
			$('#fa').hide();
		}
	},100)
	
	
    /**
     * 渲染开始
     * */
    //储存成功
    function isSuccess(v){
        $('.al-popup-prompt .al-prompt-informations').text(v)
        $('.al-popup-prompt').show();
//      setTimeout(function(){
//          $('.al-popup-prompt').hide(400);
//      },1000)
    }

    //我的申请渲染
    function renderApplication(){
        $('.application').html('');
        var h4=$('<h4>我的申请/审批<button>'+storage.applicationTotal+'</button><img src="images/chart/icon_bigmapfold.png"></h4>');
        var ul=$('<ul></ul>');
        for(var i in storage.application){
            var li=$('<li data-id="'+ storage.application[i].id + '"data-type="'+ 0 +'" data-reportID="'+storage.application[i].reportID+'"><span>'+ storage.application[i].name +'</span><button>'+ storage.application[i].count +'</button><div class="dot"></li>');
            ul.append(li);
        }
        $('.application').append(h4,ul);
    }
    //待审批渲染
    function renderApproval(){
        $('.approval').html('');
        var h4=$('<h4>待审批<button>'+storage.approvalTotal+'</button><img src="images/chart/icon_bigmapfold.png"></h4>');
        var ul=$('<ul></ul>');
        for(var i in storage.approval){
            var li=$('<li data-id="'+ storage.approval[i].id +'" data-type="'+ 1 +'" data-reportID="'+storage.application[i].reportID+'"><span>'+ storage.approval[i].name +'</span><button>'+ storage.approval[i].count +'</button><div class="dot"></li>');
            ul.append(li);
        }
        $('.approval').append(h4,ul);
    }
	//我的申请/审批（右侧）
	function renderTable(){
		$('#capitalTableList table').html('');
		var tr = $('<tr></tr>');
		for(var i in storage.column){
			var th = $("<th>"+ storage.column[i] +"</th>");
			tr.append(th)
		}
		$('#capitalTableList table').append(tr)
		for(var i  in storage.data){
			var tr = $("<tr class='tr' data-appId='"+ storage.appID[i] +"'></tr>");
			for(var j in storage.data[i]){
				var td = $('<td>'+ storage.data[i][j].value +'</td>')
				tr.append(td)
			}
			$('#capitalTableList table').append(tr)
		}	
	} 
	function add(){
		var th = $("<th>详情</th><th>审批</th>");
		var td = $('<td><a  href="javascript:;">详情</a></td><td><a href="javascript:;">审批</a></td>')
		$('#capitalTableList table').find('tr').eq(0).append(th);
		$('#capitalTableList table tr.tr').append(td);
	}
	
	//待审批（右侧）
	function pending(){
		$('#capitalTableList table').html('');
		var tr = $('<tr></tr>');
		for(var i in storage.column){
			var th = $("<th>"+ storage.column[i] +"</th>");
			tr.append(th)
		}
		$('#capitalTableList table').append(tr)
		for(var i  in storage.data){
			var tr = $("<tr data-appId='"+ storage.appID[i] +"'></tr>");
			for(var j in storage.data[i]){
				var td = $("<td><a href='javascript:;>'"+ storage.data[i][j].value +"</a></td>")
				tr.append(td)
			}
			$('#capitalTableList table').append(tr)
		}	
	}

    /**
     * 
     * 渲染结束
     * */

    /**
     * DOM操作
     * */
    $('body').on('click','.capital-left-bar h4',function(){
        if(!($(this).find('img').hasClass('active'))){
            $(this).find('img').addClass('active');
            $(this).next().slideUp();
        }else{
            $(this).find('img').removeClass('active');
            $(this).next().slideDown();
        }
    })
    $('body').on('click','.capital-left-bar li',function(){
        $('.capital-left-bar li').removeClass('active');
        $(this).addClass('active');
        $('.capital-left-bar li .dot').hide();
        $(this).find('.dot').show();

        storage.showDataCount = $('.numberCount ').find('input').val()
        storage.newDataCount = $('.vi-pages .selectIn').find('input').val()
        var id=$(this).attr('data-id');
        storage.id = id;
        var type=$(this).attr('data-type');
        storage.type = type;
        var userID = storage.userID;
        var content = '';
        sendRequest.GetAppDetail(userID,id,type,content);
        setTimeout(function(){
        	if(type == 0){
        		$('#capitalTableList .tr a:contains(审批)').addClass('font_color')
        	}
        },200)
        var num = $(this).find('button').html();
        $('div.isShow span').html(num)
        storage.changeFlag = true;
        storage.Counts = Math.ceil($(this).find('button').html()/20);
    })
    //查询
    document.onkeydown=function(event){
        var e = event || window.event;
        var li = $('.capital-left-bar li.active');
		var id = li.attr('data-id');
		var type = li.attr('data-type');
		var userID = storage.userID;
		var content = $('input.inp').val();
        if(e && e.keyCode==13){
           sendRequest.GetAppDetail(userID,id,type,content);   
        }
    }
     /*
	 * 点击发起出现表格插件
	 */
	setTimeout(function(){
		$('#launchApplication')[0].contentWindow.ins_displaySheet(false,false,true);
	},3000)
	$('#fa').click(function(){
		var li = $('.capital-left-bar li.active');
		var id = li.attr('data-id');
		storage.reportID = li.attr('data-reportid');
		if(storage.changeFlag){
			$('div.tableControl').css('display','block');
			$('#launchApplication')[0].contentWindow.ins_sheetPanel(storage.reportID,'15',false)
	    	setTimeout(function() {
	      		$('#launchApplication')[0].contentWindow.ins_loadvalue(storage.reportID,-1,storage.code)
	    	}, 2000)
	    	$('.tableHeader').html('发起申请<span><img src="images/chart/icon_close@2x.png"/></span>')
	    	sendRequest.GetApplicationNum(id)
	    	$('div.btn_wrap').css('display','block')
		}else{
			$('div.tableControl').css('display','none');
			isSuccess('请选择申请表')
		}
	})
	/*
	 *点击详情出现的表格插件
	 * */
	$('body').on('click','a:contains(详情)',function(){
		$("div.tableControl").css('display','block');
		var code = $(this).parent().parent().children(0).html()
		var li = $('.capital-left-bar li.active');
		var id = li.attr('data-id');
		storage.reportID = li.attr('data-reportid');
		$('#launchApplication')[0].contentWindow.ins_sheetPanel(storage.reportID, '15')
    	setTimeout(function() {
      		$('#launchApplication')[0].contentWindow.ins_loadvalue(storage.reportID,-1,code)
    	}, 2000)
    	$('.tableHeader').html('查看详情<span><img src="images/chart/icon_close@2x.png"/></span>')
    	
    	$('div.btn_wrap').css('display','none')
	})
	//点击的事件函数
	function fun(){
		/*
	 	* 点击X关闭
	 	* */
		$('h1.tableHeader').on("click","span",function(){
			$('div.tableControl').css('display','none');
		})
			
	
		$("#cancel").click(function(){
			$('div.tableControl').css('display','none');
		})
		$('h1.tableHeader').find('span').click(function(){
			$('div.infoTableControl').css('display','none');
		})
		//审批关闭
		$("div.bsl_close").click(function(){
			$("#approval").css('display','none');
		})
		//同意与否的样式切换
		$('div.bsl_choice div').eq(0).addClass('choice');
		$('div.bsl_choice div').eq(1).click(function(){
			$(this).addClass('choice').siblings().removeClass('choice');
		})
		$('div.bsl_choice div').eq(0).click(function(){
			$(this).addClass('choice').siblings().removeClass('choice');
		})
		//表格控件取消按钮
		$('.cancel').click(function(){
			$("#approval").css('display','none');
		})
	}
	fun();
	
	//表格控件提交按钮
	$('#git').click(function(){
		var li = $('.capital-left-bar li.active');
    	var id = li.attr('data-id');
    	sendRequest.LaunchApplication(storage.userID,id)
		$("div.tableControl").css('display','none');
	})
	
	
	//点击审批
	function approval(){
		$('body').on('click','a:contains(审批)',function(){
			$("#approval").css('display','block');
			storage.appID = $(this).parent().parent().attr('data-appId');
		})
	}
	
	//审批提交
	$('.confirm').click(function(){
		var idea = $('.choice').attr("data-idea");
		var opinion = $('textarea').val();
		sendRequest.ApplicationApproval(storage.userID,storage.appID,idea,opinion)
		console.log(storage.userID,storage.appID,idea,opinion)
		$("#approval").css('display','none');
		$('textarea').val('');
	})
    
    
    
    
    
    
    // 分页控件
    //storage.Counts 一共几页
    //storage.newDataCount 当前第几页
    //showDataCount 每页显示多少条数据
    $('.vi-pages .next-all').on('click', function() {
        storage.newDataCount = storage.Counts
        $('.selectIn ').find('input').val(storage.Counts)
        pageSwitch.switch()
    })


    $('.vi-pages .next').on('click', function() {
//      storage.newDataCount++
		storage.newDataCount = $('.selectIn ').find('input').val();
		storage.newDataCount ++;
//      if (storage.newDataCount >= storage.Counts) {
//          storage.newDataCount = storage.Counts
//      }
//      $('.selectIn ').find('input').val(storage.newDataCount)
	    if(storage.newDataCount >= storage.Counts){
        	storage.newDataCount = storage.Counts
        }
        $('.selectIn ').find('input').val(storage.newDataCount)
        pageSwitch.switch()
        
    })



    $('.vi-pages .prev-all').on('click', function() {
        storage.newDataCount = 1
        $('.selectIn ').find('input').val(1)
        pageSwitch.switch()
    })


    $('.vi-pages .prev').on('click', function() {
        storage.newDataCount--
        if (storage.newDataCount <= 1) {
            storage.newDataCount = 1
        }
        $('.selectIn ').find('input').val(storage.newDataCount)
        pageSwitch.switch()
    })



    /**
     * 处理页面切换
     */

    var pageSwitch = {
        switch: function() {
            storage.showDataCount = $('.vi-pages .numberCount ').find('input').val()
            sendRequest.GetAppDetail(storage.userID,storage.id,storage.type,'')
        }
    }
    
    
   



})