/**
 * Created by donggua on 2017/5/5.
 */
define('User_Manage', ['jquery', 'api'], function(jq, _API) {

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
                // console.log(data)
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
        //1.10.6 获取角色列表接口
        GetRole: function(a) {
            _API._G('UserManage.asmx/GetRole', '', function(data){
                storage.role=data.role;
                console.log(data)
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
        var tr1=$('<tr></tr>');
        for(var i in storage.userGroup.column){
            var th=$('<th data-egField="'+ storage.userGroup.column[i].egField +'">'+ storage.userGroup.column[i].chField +'</th>')
            tr1.append(th)
        }
        tb.append(tr1);
        for(var j in storage.userGroup.data){
            var tr=$('<tr data-id="'+ storage.userGroup.userGroupID[j] +'"></tr>');
            for(var k in storage.userGroup.data[j]){
                var td=$('<td>'+ storage.userGroup.data[j][k].value +'</td>');
                tr.append(td);
            }
            tb.append(tr);
        }
        $('#userTableList').append(tb);
    }
    //渲染1.10.3 获取用户管理下的用户组接口
    function RenderUser(){
        $('ul._user').html('');
        for(var i in storage.userGroup.data) {
            var li = $('<li data-id="'+ storage.userGroup.userGroupID[i] +'">'+ storage.userGroup.data[i][0].value +'</li>');
            $('ul._user').append(li);
        }
    }
    //渲染1.10.6	获取角色
    function RenderRole(){
        $('ul._role').html('');
        for(var i in storage.role.data) {
            var li = $('<li data-id="'+ storage.role.roleID[i] +'">'+ storage.role.data[i][0].value +'</li>');
            $('ul._role').append(li);
        }
    }
    //渲染1.10.6	获取角色列表接口
    function RenderRoleTable(){
        $('#userTableList').html('');
        var tb=$('<table></table>')
        var tr1=$('<tr></tr>');
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
    $('#user-left h4._user').toggle(function(){
        $(this).find('img').addClass('active');
        $('#user-left ul._user').slideDown();
    },function(){
        $(this).find('img').removeClass('active');
        $('#user-left ul._user').slideUp();
    })
    $('#user-left h4._user').click(function(){
        sendRequest.GetUserGroup('user');
    })

    //-----用户组管理-----
    $('#user-left span._users').click(function(){
        sendRequest.GetUserGroup('users');
    })

    //-------角色管理------
    $('#user-left h4._role').toggle(function(){
        $(this).find('img').addClass('active');
        $('#user-left ul._role').slideDown();
    },function(){
        $(this).find('img').removeClass('active');
        $('#user-left ul._role').slideUp();
    })
    $('#user-left h4._role').click(function(){
        sendRequest.GetRole('role');
    })
    $('#user-left span._role').click(function(e){
        e.stopPropagation();
        sendRequest.GetRole('roleTable');
    })

    //-----添加-----
    $('.table-List .addListData').click(function(){
        alert(1);
    })

})