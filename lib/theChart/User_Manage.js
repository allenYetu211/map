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
        role:{},
        notD: false,
        notA: false,
        notC: false,
        UserGroupOpType: '',   //操作类型（0：新增、 1：修改、 2：删除） 新增时userGroupID传-1
        user:{}
    }

    /**
     *  ajax 开始
     * */
    var sendRequest = {
        // 1.10.1 获取用户组列表接口
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
        //1.10.2 用户组操作接口
        UserGroupOp: function(userGroupsArr) {
            var _obj = {}
            _obj['userGroups']=userGroupsArr;
            console.log({
                userGroups:JSON.stringify(_obj),
                opType:parseInt(storage.UserGroupOpType)
            })
            _API._G('UserManage.asmx/UserGroupOp', {
                userGroups:JSON.stringify(_obj),
                opType:parseInt(storage.UserGroupOpType)
            }, function(data){
                // storage.userGroup=data.userGroup;
                console.log(data)
                if(data.success){
                    sendRequest.GetUserGroup('user')
                    sendRequest.GetUserGroup('users')
                }
            })
        },
        // 1.10.4 用户组下的用户接口
        GetUserByGroupID: function(userGroupID) {
            _API._G('UserManage.asmx/GetUserByGroupID', {
                userGroupID:userGroupID
            }, function(data){
                storage.user=data.user;
                console.log(data)
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
            var tr=$('<tr class="_deleteTr" data-id="'+ storage.userGroup.userGroupID[j] +'"></tr>');
            for(var k in storage.userGroup.data[j]){
                var td=$('<td></td>');
                var Pro=storage.userGroup.columnPro[k];
                switch (Pro.type){
                    case 'string':
                        var span=$('<span>'+ storage.userGroup.data[j][k].value +'</span>')
                        var input=$('<input type="text" value="'+ storage.userGroup.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number':
                        var span=$('<span>'+ storage.userGroup.data[j][k].value +'</span>')
                        var input=$('<input type="number" value="'+ storage.userGroup.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number_dic':
                        var span=$('<span>'+ storage.userGroup.data[j][k].value +'</span>')
                        var select=$('<select></select>');
                        for(var key in Pro.values){
                            if(Pro.values[key]==storage.userGroup.data[j][k].value){
                                select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                            }else{
                                select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                            }
                        }
                        td.append(span);
                        td.append(select);
                        break;

                    case 'number_mulDic':
                        var span=$('<span>'+ storage.userGroup.data[j][k].value +'</span>')
                        var div=$('<div class="mulDic_div"><input type="text" class="mulDic_input"><button class="mulDic_btn"><img src="images/chart/icon_bigmapfold.png"></button></div>');
                        var ul_div=$('<div class="mulDic_ul"></div>');
                        var ul=$('<ul></ul>');
                        var p=$('<p class="mulDic_p" style="background: #e9eff4;cursor: pointer; padding: 4px 5px; text-align: center">完成</p>')
                        var arr=[];
                        for(var l in Pro.values){
                            if((storage.userGroup.data[j][k].value.indexOf(Pro.values[l]))!==-1){
                                var li=$('<li><label><input type="checkbox" checked data-id="'+ l +'" value="'+ Pro.values[l] +'">'+ Pro.values[l] +'</label></li>');
                                arr.push(l)
                            }else{
                                var li=$('<li><label><input type="checkbox" data-id="'+ l +'" value="'+ Pro.values[l] +'">'+ Pro.values[l] +'</label></li>');
                            }
                            ul.append(li);
                        }

                        span.attr('data-arr',arr)
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
    /**
     * 删除id
     */
    $('body').on('click', '._deleteTr', function() {
        if (!storage.notD) return
        $(this).toggleClass('active')
    })

    $('body').on('click', '._addTr', function() {
        if (!storage.notD) return
        $(this).toggleClass('active')
    })

    /**
     * 存储
     */
    $('.serverListData').on('click', function() {
        console.log('A:',storage.notA)
        console.log('C:',storage.notC)
        console.log('D:',storage.notD)
        // storage.userGroupsArr=[];
        //--添--
        if(storage.notA){
            var userGroupsArr=[];
            $('._addTr').each(function(i,v){
                    var _obj={}
                    _obj['F_NAME']=$($(v).children().get(0)).find('span').text();
                    _obj['F_ROLEID']=$($(v).children().get(1)).find('span').attr('data-arr').split(',');
                    _obj['F_USERGROUPID']=v.getAttribute('data-id');
                    userGroupsArr.push(_obj);
            })
            sendRequest.UserGroupOp(userGroupsArr);
        }
        //--修--
        if(storage.notC){
            var userGroupsArr=[];
            $('#userTableList ._deleteTr').each(function(i,v){
                var _obj={}
                _obj['F_NAME']=$($(v).children().get(0)).find('span').text();
                _obj['F_ROLEID']=$($(v).children().get(1)).find('span').attr('data-arr').split(',');
                _obj['F_USERGROUPID']=v.getAttribute('data-id');
                userGroupsArr.push(_obj);
            })
            sendRequest.UserGroupOp(userGroupsArr);
        }
        // --删--
        if(storage.notD){
            var userGroupsArr=[];
            $('._deleteTr').each(function(i,v){
                if(v.className=='_deleteTr active'){
                    var _obj={}
                    _obj['F_NAME']=$($(v).children().get(0)).find('span').text();
                    _obj['F_ROLEID']=$($(v).children().get(1)).find('span').attr('data-arr').split(',');
                    _obj['F_USERGROUPID']=v.getAttribute('data-id');
                    userGroupsArr.push(_obj);
                }
            })
            sendRequest.UserGroupOp(userGroupsArr);
        }
        // if (storage.UserGroupOpType == '2') {
        //     $('._addTr.active').remove()
        //     sendRequest.UserGroupOp();
        //     return;
        // }
        // // 存储 检查是否填写完整
        // var falg = false
        // // if (storage.UserGroupOpType == '0') {
        // $('tr').find('span').each(function(_inx) {
        //     if ($(this).html() == '') {
        //         $(this).parents('td').addClass('_null')
        //         falg = true
        //     }
        //     if (_inx == $('tr').find('span').length - 1) {
        //         if (falg) {
        //             $('.al-popup-prompt').show().find('.al-prompt-informations').html('不能为空')
        //         } else {
        //             sendRequest.FieldOp()
        //
        //         }
        //     }
        //
        // })
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
    })
    /**
     * 删除
     */
    $('.deleteListData').on('click', function() {
        $('#userTableList').find('tr').removeClass('action')
        $(this).toggleClass('active')
        $('.addListData, .changeListData').removeClass('active')
        storage.UserGroupOpType = '2'
        storage.notD = !storage.notD
        storage.notA = false
        storage.notC = false
    })

    /**
     * 修改
     */
    $('.changeListData').on('click', function() {
        $('#userTableList').find('tr').removeClass('action')
        $(this).toggleClass('active')
        $('.addListData, .deleteListData').removeClass('active')
        $('._deleteTr,._addTr').removeClass('active')
        storage.UserGroupOpType = '1'
        storage.notC = !storage.notC
        storage.notA = true
        storage.notD = false
    })

    /**
     * 新增
     */
    $('.addListData').on('click', function() {
        $('#userTableList').find('tr').removeClass('action')
        $('.changeListData, .deleteListData').removeClass('active')
        $('._deleteTr,._addTr').removeClass('active')
        storage.UserGroupOpType = '0'
        storage.notA = true
        storage.notC = false
        storage.notD = false
        // var _dataid = $('#userTableList').find('tr:last').data('id') == undefined ? -1 : $('#userTableList').find('tr:last').data('id')
        var tr=$('<tr class="_addTr" data-id="'+ -1 +'"></tr>');
        for(var k in storage.userGroup.columnPro){
            var td=$('<td></td>');
            var Pro=storage.userGroup.columnPro[k];
            switch (Pro.type){
                case 'string':
                    var span=$('<span></span>')
                    var input=$('<input type="text" value="">');
                    td.append(span);
                    td.append(input);
                    break;
                case 'number':
                    var span=$('<span></span>')
                    var input=$('<input type="number" value="">');
                    td.append(span);
                    td.append(input);
                    break;
                case 'number_dic':
                    var span=$('<span>'+ storage.userGroup.data[j][k].value +'</span>')
                    var select=$('<select></select>');
                    for(var key in Pro.values){
                        if(Pro.values[key]==storage.userGroup.data[j][k].value){
                            select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                        }else{
                            select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                        }
                    }
                    td.append(span);
                    td.append(select);
                    break;
                case 'number_mulDic':
                    var span=$('<span></span>')
                    var div=$('<div class="mulDic_div"><input type="text" class="mulDic_input"><button class="mulDic_btn"><img src="images/chart/icon_bigmapfold.png"></button></div>');
                    var ul_div=$('<div class="mulDic_ul"></div>');
                    var ul=$('<ul></ul>');
                    var p=$('<p class="mulDic_p" style="background: #e9eff4;cursor: pointer; padding: 4px 5px; text-align: center">完成</p>')
                    var arr=[];
                    for(var l in Pro.values){
                            var li=$('<li><label><input type="checkbox" data-id="'+ l +'" value="'+ Pro.values[l] +'">'+ Pro.values[l] +'</label></li>');
                            arr.push(l)
                        ul.append(li);
                    }
                    span.attr('data-arr',arr)
                    ul_div.append(ul)
                    ul_div.append(p)
                    div.append(ul_div);
                    td.append(span);
                    td.append(div);
                    break;
            }
            tr.append(td);
        }
        $('#userTableList tbody').append(tr);
    })

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
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.handle button').removeClass('active');
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

    //-----下拉多选框------
    var mulDic_btn=true;
    $('body').on('click','#userTableList .mulDic_btn',function(){
        if(mulDic_btn){
            $(this).next().css('display','block');
            mulDic_btn=false;
        }else {
            $(this).next().css('display','none');
            mulDic_btn=true
        }
    })
    $('body').on('click','.mulDic_ul input',function(){
        var _input=$(this).parent().parent().parent().parent().parent().find('.mulDic_input')
        var _span=$(this).parents('td').find('span')
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

    $('body').on('click', '#userTableList td', function() {
        var _infor = $(this).parents('._deleteTr').length > 0 ? true : false
        if (storage.notD) return
        if (storage.notC && _infor) {
            $(this).find('input, select ,.mulDic_div').show()
            $(this).find('input[type="text"]').focus()
            $(this).find('span').hide()
            $(this).find('span')
        } else if(storage.notA && !_infor) {
            console.log('A')
            $(this).find('input, select ,.mulDic_div').show()
            $(this).find('input[type="text"]').focus()
            $(this).find('span').hide()
        }else {
            $('#userTableList').find('tr').removeClass('action')
            $(this).parents('tr').addClass('action')
        }
    })

    $('body').on('blur', '#userTableList td>input', function() {
        var replaceNew = $(this).val()
        console.log(replaceNew)
        $(this).val(replaceNew)
        $(this).prev().html(replaceNew)
        $(this).hide()
        $(this).prev().show()
    })

    $('body').on('click', '.mulDic_p', function() {
        $(this).parents('td').find('span').show();
        $(this).parent().hide()
        $(this).parent().parent().hide()
        mulDic_btn=true;
        return false;
    })
    // 点击用户管理下的用户
    $('body').on('click','.user-left-bar ._user li',function(){
        var userGroupID=$(this).attr('data-id');
        console.log(userGroupID)
        sendRequest.GetUserByGroupID(userGroupID);
    })

})