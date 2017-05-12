/**
 * Created by donggua on 2017/5/5.
 */
define('User_Manage', ['jquery','local', 'api'], function(jq, l, _API) {
    if (l._Lh !== 'User_Manage.html') {
        return
    }

    /**
     *  数据存储仓库
     * */

    var storage = {
        userGroup:{},
        role:{}
    }

    /**
     *  ajax 开始
     * */
    var sendRequest = {
        // 1.10.1	获取用户组列表接口
        GetUserGroup: function(a) {
            _API._G('UserManage.asmx/GetUserGroup', '', function(data){
                storage.userGroup=data.userGroup;
                console.log("storage.userGroup:",storage.userGroup)
                switch(a)
                {
                    case 'user':
                        RenderUser();
                        break;
                    case 'users':
                        RenderUserGroup()
                        break;
                }
            })
        },
        // 1.10.6 获取角色列表接口
        GetRole: function(a) {
            _API._G('UserManage.asmx/GetRole', '', function(data){
                storage.role=data.role;
                switch(a)
                {
                    case 'role':
                        RenderRole();
                        break;
                    case 'roleTable':
                        RenderRoleTable();
                        break;
                }
            })
        }
    }

    /**
     *  ajax 结束
     * */

    /**
     * 渲染开始
     * */

    //渲染 1.10.1 获取用户组列表接口
    function RenderUserGroup(){
        $('#userTableList').html('');
        var tb=$('<table></table>')
        var tr1=$('<tr style="background: #e9eff4"></tr>');
        for(var i in storage.userGroup.column){
            var th=$('<th data-egField="'+ storage.userGroup.column[i].egField +'">'+ storage.userGroup.column[i].chField +'</th>')
            tr1.append(th)
        }
        tb.append(tr1);

        for(var j in storage.userGroup.data){
            var tr=$('<tr data-id="'+ storage.userGroup.userGroupID[j] +'"></tr>');
            for(var k in storage.userGroup.data[j]){
                var td=$('<td><span>'+ storage.userGroup.data[j][k].value +'</span></td>');
                var Pro=storage.userGroup.columnPro[k];
                switch (Pro.type){
                    case 'string':
                        var input=$('<input type="text" value="'+ storage.userGroup.data[j][k].value +'">');
                        td.append(input);
                        break;

                    case 'number':
                        var input=$('<input type="number" value="'+ storage.userGroup.data[j][k].value +'">');
                        td.append(input);
                        break;

                    case 'number_dic':
                        var select=$('<select></select>');
                        for(var key in Pro.values){
                            if(Pro.values[key]==storage.userGroup.data[j][k].value){
                                select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                            }else{
                                select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                            }
                        }
                        td.append(select);
                        break;

                    case 'number_mulDic':
                        var div=$('<div class="mulDic_div"><input type="text" class="mulDic_input"><button class="mulDic_btn"><img src="images/chart/icon_bigmapfold.png"></button></div>');
                        var ul=$('<ul class="mulDic_ul"></ul>');
                        for(var l in Pro.values){
                            if(Pro.values[key]==storage.userGroup.data[j][k].value){
                                var li=$('<li><label><input type="checkbox" checked data-id="'+ l +'">'+ Pro.values[l] +'</label></li>');
                            }else{
                                var li=$('<li><label><input type="checkbox" data-id="'+ l +'">'+ Pro.values[l] +'</label></li>');
                            }
                            ul.append(li);
                        }
                        div.append(ul);
                        td.append(div);
                        break;
                }

                tr.append(td);
            }
            tb.append(tr);
        }

        $('#userTableList').append(tb);
    }
    //渲染1.10.3 用户管理下的用户组
    function RenderUser(){
        $('._user ul').html('');
        for(var i in storage.userGroup.data) {
            var li = $('<li data-id="'+ storage.userGroup.userGroupID[i] +'">'+ storage.userGroup.data[i][0].value +'</li>');
            $('._user ul').append(li);
        }
    }
    //渲染1.10.6	获取角色
    function RenderRole(){
        $('._role ul').html('');
        for(var i in storage.role.data) {
            var li = $('<li data-id="'+ storage.role.roleID[i] +'">'+ storage.role.data[i][0].value +'</li>');
            $('._role ul').append(li);
        }
    }
    //渲染1.10.6	获取角色列表接口
    function RenderRoleTable(){
        $('#userTableList').html('');
        var tb=$('<table></table>')
        var tr1=$('<tr style="background: #e9eff4"></tr>');
        for(var i in storage.role.column){
            var th=$('<th data-egField="'+ storage.role.column[i].egField +'">'+ storage.role.column[i].chField +'</th>')
            tr1.append(th)
        }
        tb.append(tr1);
        for(var j in storage.role.data){
            var tr=$('<tr data-id="'+ storage.role.roleID[j] +'"></tr>');
            for(var k in storage.role.data[j]){
                var td=$('<td>'+ storage.role.data[j][k].value +'</td>');
                tr.append(td);
            }
            tb.append(tr);
        }
        $('#userTableList').append(tb);
    }

    /**
     * 渲染结束
     * */

    /**
     * DOM操作
     * */

    //------用户管理-----
    $('.user-left-bar ._user h4').click(function(){
        if(!($(this).find('img').hasClass('active'))){
            $(this).find('img').addClass('active');
            $(this).next().slideDown();
            sendRequest.GetUserGroup('user');
        }else{
            $(this).find('img').removeClass('active');
            $(this).next().slideUp();
        }
    })
    //-----用户组管理-----
    $('.user-left-bar ._users span').click(function(){
        sendRequest.GetUserGroup('users');
    })

    //-------角色管理------
    $('.user-left-bar ._role h4').click(function(){
        if(!($(this).find('img').hasClass('active'))){
            $(this).find('img').addClass('active');
            $(this).next().slideDown();
            sendRequest.GetRole('role');
        }else{
            $(this).find('img').removeClass('active');
            $(this).next().slideUp();
        }
    })
    $('.user-left-bar ._role span').click(function(e){
        e.stopPropagation();
        sendRequest.GetRole('roleTable');
    })

    //-----添加-----
    $('.table-List .addListData').click(function(){
        alert(1);
    })

})