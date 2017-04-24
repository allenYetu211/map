define("info", ['map', "jquery", "userservice" , 'chartInformations'], function(map, j, us, ch) {
    // dom操作
    var generate = $('#left-sidebar .mission .generate');
    var inventory = $('#left-sidebar .mission .inventory');

    // 全选
    $('#left-sidebar .selectAll').click(function(){
       $(this).parent().parent().parent().find('input').prop("checked", true);
    });
    // 取消
    $('#left-sidebar .unSelect').click(function(){
        $(this).parent().parent().parent().find('input').prop("checked", false);
    });

    generate.click(function(){
        alert(1);
    })

    /**
     *  数据存储仓库
     * */

    var storage = {
        v_category:''
    }


    /**
     * 获取数据
     */

    var sendRequest = {
        // 获取任务单元农户
        GetCategory: function() {
            ch.api.getCetCatgory('GetCategory', '', function(data){
                storage.v_category=data.category;
                Render();
            })
        },
        GetSurveyByCategory: function(categoryID) {
            ch.api.getCetCatgory('GetSurveyTable', parseInt(categoryID), function(data){
                console.log(data)
            })
        }
    }
    sendRequest.GetCategory();

    /**
     * 渲染页面
     */
    function Render(){
        console.log(storage.v_category)
        for(var i in storage.v_category){
            var option=$('<option></option>>')
            option.html(storage.v_category[i].categoryName);
            option.attr('value',storage.v_category[i].categoryID);
            $('#left-sidebar .task .select1').append(option);
        }
    }

    $('#left-sidebar .task .select1').change(function(){
        sendRequest.GetSurveyByCategory($(this).val());
    });


})
