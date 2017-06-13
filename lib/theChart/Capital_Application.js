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
        application:[],
        applicationTotal:'',
        approval:[],
        approvalTotal:'',
        showDataCount: '',
        newDataCount: '',
        Counts: ''
    }

    console.log(storage.userID)

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
        GetAppDetail: function(userID,id,type) {
            _API._G('AppManage.asmx/GetAppDetail', {
                userID:userID,
                id:id,
                type:type,
                start: storage.showDataCount * (storage.newDataCount - 1),
                limit: storage.showDataCount * storage.newDataCount
            }, function(data){
                console.log(data);
            })
        },
    }
    /**
     *  ajax 结束
     * */

    // 初始化
    sendRequest.GetAppliAppro(storage.userID);

    /**
     * 渲染开始
     * */
    function renderApplication(){
        $('.application').html('');
        var h4=$('<h4>我的申请/审批<button>'+storage.applicationTotal+'</button><img src="images/chart/icon_bigmapfold.png"></h4>');
        var ul=$('<ul></ul>');
        for(var i in storage.application){
            var li=$('<li data-id="'+ storage.application[i].id +'" data-type="'+ storage.applicationTotal +'"><span>'+ storage.application[i].name +'</span><button>'+ storage.application[i].count +'</button><div class="dot"></li>');
            ul.append(li);
        }
        $('.application').append(h4,ul);
    }
    function renderApproval(){
        $('.approval').html('');
        var h4=$('<h4>待审批<button>'+storage.approvalTotal+'</button><img src="images/chart/icon_bigmapfold.png"></h4>');
        var ul=$('<ul></ul>');
        for(var i in storage.approval){
            var li=$('<li data-id="'+ storage.approval[i].id +'" data-type="'+ storage.approvalTotal +'"><span>'+ storage.approval[i].name +'</span><button>'+ storage.approval[i].count +'</button><div class="dot"></li>');
            ul.append(li);
        }
        $('.approval').append(h4,ul);
    }

    /**
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
        var type=$(this).attr('data-type');
        sendRequest.GetAppDetail();
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
        storage.newDataCount++
        if (storage.newDataCount >= storage.Counts) {
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
            sendRequest.GetAppDetail()
        }

    }




})