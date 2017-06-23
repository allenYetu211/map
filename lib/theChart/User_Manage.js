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
        user:{},
        userFlag:'',
        fun:[],
        data:''
    }

    /**
     *  ajax 开始
     * */
    var sendRequest = {
        // 1.10.1 获取用户组列表接口
        GetUserGroup: function(a) {
            _API._G('UserManage.asmx/GetUserGroup', '', function(data){
                storage.userGroup=data.userGroup;
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
            _API._G('UserManage.asmx/UserGroupOp', {
                userGroups:JSON.stringify(_obj),
                opType:parseInt(storage.UserGroupOpType)
            }, function(data){
                // storage.userGroup=data.userGroup;
                
                if(data.success){
                    sendRequest.GetUserGroup('user')
                    sendRequest.GetUserGroup('users')
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                    RenderUserTable()
    				sendRequest.GetUserGroup('users');
	        		storage.notA = false
	        		storage.notC = false
	        		storage.notD = false
	        		$('.changeListData, .deleteListData').removeClass('active')
	        		storage.userFlag='userGroup';
                }
            })
        },
        // 1.10.4 用户组下的用户接口
        GetUserByGroupID: function(userGroupID) {
            _API._G('UserManage.asmx/GetUserByGroupID', {
                userGroupID:userGroupID
            }, function(data){
                storage.user=data.user;
                RenderUserTable();
            })
        },
        //1.10.5 用户操作接口
        UserOp: function(userArr) {
            var _obj = {}
            _obj['users']=userArr;
            _API._G('UserManage.asmx/UserOp', {
                users:JSON.stringify(_obj),
                opType:parseInt(storage.UserGroupOpType)
            }, function(data){
                if(data.success){
                    sendRequest.GetUserByGroupID(recordID);
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                    
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
        },
        //1.10.7 角色操作接口
        RoleOp: function(roleArr) {
            var _obj = {}
            _obj['roles']=roleArr;
            _API._G('UserManage.asmx/RoleOp', {
                roles:JSON.stringify(_obj),
                opType:parseInt(storage.UserGroupOpType)
            }, function(data){
                if(data.success){
                    sendRequest.GetRole('role');
                    sendRequest.GetRole('roleTable');
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                }
            })
        },
        // 1.10.8 根据角色获取功能权限接口
        GetFuncByRoleID: function(roleID) {
            _API._G('UserManage.asmx/GetFuncByRoleID', {
                roleID:roleID
            }, function(data){
                storage.fun=data.function;
                FuncByRole();
            })
        },
        // 1.10.9 保存功能权限接口
        SaveFunction: function(arr) {
            var _obj={};
            _obj['function']=arr;
            _API._G('UserManage.asmx/SaveFunction', {
                roleID:roleID,
                function:JSON.stringify(_obj)
            }, function(data){
                if(data.success){
                    isSuccess('成功')
                }else {
                    isSuccess(data.msg)
                    
                }
            })
        },
        GetDistrict:function(column,code){
        	_API._G('UserManage.asmx/GetDistrict', {
                column:column,
                code:code
            }, function(data){
                if(column == 'F_PROVINCE'){
                	//市
                	var city = $('#userTableList table tr td:eq(3)');
					var span=$('<span></span>');
	            	var select=$('<select></select>');
	            	for(var key in data.values){
	                	select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ data.values[key] +'</option>'));
	            	}
	           		city.append(span);
	            	city.append(select);
                }else if(column == 'F_CITY'){
                	//区
                	var county = $('#userTableList table tr td:eq(4)');
					var span=$('<span></span>');
	            	var select=$('<select></select>');
	            	for(var key in data.values){
	                	select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ data.values[key] +'</option>'));
	            	}
	           		county.append(span);
	            	county.append(select);
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
            var tr=$('<tr class="_deleteTr" data-id="'+ storage.role.roleID[j] +'"></tr>');
            for(var k in storage.role.data[j]){
                var td=$('<td></td>');
                var Pro=storage.role.columnPro[k];
                switch (Pro.type){
                    case 'string':
                        var span=$('<span>'+ storage.role.data[j][k].value +'</span>')
                        var input=$('<input type="text" value="'+ storage.role.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number':
                        var span=$('<span>'+ storage.role.data[j][k].value +'</span>')
                        var input=$('<input type="number" value="'+ storage.role.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number_dic':
                        var span=$('<span>'+ storage.role.data[j][k].value +'</span>')
                        var select=$('<select></select>');
                        for(var key in Pro.values){
                            if(Pro.values[key]==storage.role.data[j][k].value){
                                select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                            }else{
                                select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                            }
                        }
                        td.append(span);
                        td.append(select);
                        break;

                    case 'number_mulDic':
                        var span=$('<span>'+ storage.user.data[j][k].value +'</span>')
                        var div=$('<div class="mulDic_div"><input type="text" class="mulDic_input"><button class="mulDic_btn"><img src="images/chart/icon_bigmapfold.png"></button></div>');
                        var ul_div=$('<div class="mulDic_ul"></div>');
                        var ul=$('<ul></ul>');
                        var p=$('<p class="mulDic_p" style="background: #e9eff4;cursor: pointer; padding: 4px 5px; text-align: center">完成</p>')
                        var arr=[];
                        for(var l in Pro.values){
                            if((storage.user.data[j][k].value.indexOf(Pro.values[l]))!==-1){
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
    // 1.10.4 渲染用户列表
    function RenderUserTable(){
        $('#userTableList').html('');
        var tb=$('<table></table>')
        var tr1=$('<tr style="background: #e9eff4"></tr>');
        for(var i in storage.user.column){
            var th=$('<th data-egField="'+ storage.user.column[i].egField +'">'+ storage.user.column[i].chField +'</th>')
            tr1.append(th)
        }
        tb.append(tr1);
        for(var j in storage.user.data){
            var tr=$('<tr class="_deleteTr" data-id="'+ storage.user.userID[j] +'"></tr>');
            for(var k in storage.user.data[j]){
                var td=$('<td></td>');
                var Pro=storage.user.columnPro[k];
                switch (Pro.type){
                    case 'string':
                        var span=$('<span>'+ storage.user.data[j][k].value +'</span>')
                        var input=$('<input type="text" value="'+ storage.user.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number':
                        var span=$('<span>'+ storage.user.data[j][k].value +'</span>')
                        var input=$('<input type="number" value="'+ storage.user.data[j][k].value +'">');
                        td.append(span);
                        td.append(input);
                        break;

                    case 'number_dic':
                        var span=$('<span>'+ storage.user.data[j][k].value +'</span>')
                        var select=$('<select></select>');
                        for(var key in Pro.values){
                            if(Pro.values[key]==storage.user.data[j][k].value){
                                select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                            }else{
                                select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                            }
                        }
                        td.append(span);
                        td.append(select);
                        break;

                    case 'number_mulDic':
                        var span=$('<span>'+ storage.user.data[j][k].value +'</span>')
                        var div=$('<div class="mulDic_div"><input type="text" class="mulDic_input"><button class="mulDic_btn"><img src="images/chart/icon_bigmapfold.png"></button></div>');
                        var ul_div=$('<div class="mulDic_ul"></div>');
                        var ul=$('<ul></ul>');
                        var p=$('<p class="mulDic_p" style="background: #e9eff4;cursor: pointer; padding: 4px 5px; text-align: center">完成</p>')
                        var arr=[];
                        for(var l in Pro.values){
                            if((storage.user.data[j][k].value.indexOf(Pro.values[l]))!==-1){
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
    //存储成功
    function isSuccess(v){
        $('.al-popup-prompt .al-prompt-informations').text(v)
        $('.al-popup-prompt').show(400);
//      setTimeout(function(){
//          $('.al-popup-prompt').hide(400);
//      },1000)
    }
    //渲染1.10.8角色获取功能权限

    var count = 0
    function FuncByRole(){
        $('#userTableList').html('');
        var ul=recursionFuncByRole(-1);
        $('#userTableList').append(ul);

    }

    function recursionFuncByRole(id){
        var ul = $('<ul></ul>');
        count ++
        for(var i in storage.fun){
            if(storage.fun[i].pId==id){
                if(storage.fun[i].isChild){
                    var li=$('<li class="parentNode"></li>');
                    if(storage.fun[i].isSelect){
                        var label=$('<label style="color: #0088EB">'+ storage.fun[i].name +'<input type="checkbox" checked id="'+ storage.fun[i].id +'" isChild="'+ storage.fun[i].isChild +'" isSelect="'+ storage.fun[i].isSelect +'" name="'+ storage.fun[i].name +'" pId="'+ storage.fun[i].pId +'"></label>')
                        li.append(label)
                    }else{
                        var label=$('<label style="color: #0088EB">'+ storage.fun[i].name +'<input type="checkbox" id="'+ storage.fun[i].id +'" isChild="'+ storage.fun[i].isChild +'" isSelect="'+ storage.fun[i].isSelect +'" name="'+ storage.fun[i].name +'" pId="'+ storage.fun[i].pId +'"></label>')
                        li.append(label)
                    }
                    var _id=storage.fun[i].id;
                    var nextFn=recursionFuncByRole(_id);
                    li.append(nextFn);
                }else {
                    if(storage.fun[i].isSelect){
                        var li=$('<li><label>'+ storage.fun[i].name +'<input type="checkbox" checked id="'+ storage.fun[i].id +'" isChild="'+ storage.fun[i].isChild +'" isSelect="'+ storage.fun[i].isSelect +'" name="'+ storage.fun[i].name +'" pId="'+ storage.fun[i].pId +'"></label></li>')
                    }else{
                        var li=$('<li><label>'+ storage.fun[i].name +'<input type="checkbox" id="'+ storage.fun[i].id +'" isChild="'+ storage.fun[i].isChild +'" isSelect="'+ storage.fun[i].isSelect +'" name="'+ storage.fun[i].name +'" pId="'+ storage.fun[i].pId +'"></label></li>')
                    }
                }
            }
            ul.append(li);
        }
        return ul;
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
    //判断是否相同
    //判断是否名称相同
    function same(){
    	var arr = [];
    	var tr_len =  storage.userGroup.data.length;
    	for(var i=0;i<tr_len;i++){
    		for(var j=0;j<1;j++){
    			var con = storage.userGroup.data[i][0].value;
    			arr.push(con)
    		}
    	}
    	var td_new = $('._addTr td').eq(0).find('span').html();
    	var u = arr.indexOf(td_new);
    	if(u != -1){
    		td_new == ''
    		RenderUserTable()
    		sendRequest.GetUserGroup('users');
	        storage.notA = false
	        storage.notC = false
	        storage.notD = false
	        $('.changeListData, .deleteListData').removeClass('active')
	        storage.userFlag='userGroup';
    	}	
    }
    //三级联动 省
	$('body').on('click','#userTableList table tr td:eq(2)',function(){
		$('#userTableList table tr td:eq(3)').html('');
		$('#userTableList table tr td:eq(4)').html('')
		var column = $("#userTableList table tr:eq(0) th:eq(2)").attr('data-egfield');
		var code = '';
		var span = $(this).find('span');
		if(span.html() != ''){
			code = span.attr('data-selectindex');
			sendRequest.GetDistrict(column,code);
		}
	})
    //三级联动  市
    $('body').on('click','#userTableList table tr td:eq(3)',function(){
    	$('#userTableList table tr td:eq(4)').html('')
		var column = $("#userTableList table tr:eq(0) th:eq(3)").attr('data-egfield');
		var code = '';
		var span = $(this).find('span');
		if(span.html() != ''){
			code = span.attr('data-selectindex');
			sendRequest.GetDistrict(column,code);
		}
	})
    

    /**
     * 存储
     */
    $('.serverListData').on('click', function() {
        var flag=true;
//      function IsNull(){
//          var spans=$('#userTableList span');
//          spans.each(function(i,v){
//              if(v.innerText==''){
//                  alert('不能为空')
//                  flag=false;
//                  return false;
//              }
//          })
//      }
//      IsNull();
		function IsNull(){
			if($('tr._addTr td').eq(0).find('span').html() == ''){
				flag = false
				return false
			}
		}
		IsNull();

        // console.log(storage.userFlag)
        // console.log('A',storage.notA)
        // console.log('C',storage.notC)
        // console.log('D',storage.notD)

        function MsgTr(v){
            var _obj={}
            _obj['F_NAME']=$($(v).children().get(0)).find('span').text();
            _obj['F_ROLEID']=$($(v).children().get(1)).find('span').attr('data-arr').split(',');
            _obj['F_USERGROUPID']=v.getAttribute('data-id');
            userGroupsArr.push(_obj);
        }
        if(storage.userFlag=='userGroup'){
            //--添--
            if(storage.notA&&flag){
                var userGroupsArr=[];
                $('._addTr').each(function(i,v){
                    MsgTr(v);
                })
                sendRequest.UserGroupOp(userGroupsArr);
            }
            //--修--
            if(storage.notC&&flag){
                var userGroupsArr=[];
                $('#userTableList ._deleteTr').each(function(i,v){
                    MsgTr(v);
                })
                sendRequest.UserGroupOp(userGroupsArr);
            }
            // --删--
            if(storage.notD){
                var userGroupsArr=[];
                $('._deleteTr').each(function(i,v){
                    if(v.className=='_deleteTr active'){
                        MsgTr(v);
                    }
                })
                sendRequest.UserGroupOp(userGroupsArr);
            }
        }


        function MsgTr1(v){
            var _obj={}
            for(var i in storage.user.column){
                switch (storage.user.columnPro[i].type){
                    case 'string':
                        _obj[storage.user.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                    case 'number':
                        _obj[storage.user.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                    case 'number_dic':
                        _obj[storage.user.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-selectindex');
                        break;
                    case 'number_mulDic':
                        _obj[storage.user.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-arr').split(',');
                        break;
                }
            }
            _obj['F_USERID']=v.getAttribute('data-id');
            userArr.push(_obj);
        }
        if(storage.userFlag=='user'){
            IsNull();
            //--添--
            if(storage.notA&&flag){
                var userArr=[];
                $('._addTr').each(function(i,v){
                    MsgTr1(v);
                })
                sendRequest.UserOp(userArr);
            }
            //--修--
            if(storage.notC&&flag){
                var userArr=[];
                $('#userTableList ._deleteTr').each(function(i,v){
                    MsgTr1(v);
                })
                sendRequest.UserOp(userArr);
            }
            // --删--
            if(storage.notD){
                var userArr=[];
                $('._deleteTr').each(function(i,v){
                    if(v.className=='_deleteTr active'){
                        MsgTr1(v);
                    }
                })
                sendRequest.UserOp(userArr);
            }
        }

        function MsgTr2(v){
            var _obj={}
            for(var i in storage.role.column){
                switch (storage.role.columnPro[i].type){
                    case 'string':
                        _obj[storage.role.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                    case 'number':
                        _obj[storage.role.column[i].egField]=$($(v).children().get(i)).find('span').text();
                        break;
                    case 'number_dic':
                        _obj[storage.role.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-selectindex');
                        break;
                    case 'number_mulDic':
                        _obj[storage.role.column[i].egField]=$($(v).children().get(i)).find('span').attr('data-arr').split(',');
                        break;
                }
            }
            _obj['F_ROLEID']=v.getAttribute('data-id');
            roleArr.push(_obj);
        }
        if(storage.userFlag=='role'){
            IsNull();
            //--添--
            if(storage.notA&&flag){
                var roleArr=[];
                $('._addTr').each(function(i,v){
                    MsgTr2(v);
                })
                sendRequest.RoleOp(roleArr);
            }
            //--修--
            if(storage.notC&&flag){
                var roleArr=[];
                $('#userTableList ._deleteTr').each(function(i,v){
                    MsgTr2(v);
                })
                sendRequest.RoleOp(roleArr);
            }
            // --删--
            if(storage.notD){
                var roleArr=[];
                $('._deleteTr').each(function(i,v){
                    if(v.className=='_deleteTr active'){
                        MsgTr2(v);
                    }
                })
                sendRequest.RoleOp(roleArr);
            }
        }

        if(storage.userFlag=='roleInput'){
            var arr=[];
            $('#userTableList>ul input').each(function(i,v){
                var obj={};
                obj['id']=v.getAttribute('id');
                if((v.getAttribute('isSelect'))==='true'){
                    obj['isSelect']=true;
                }else {
                    obj['isSelect']=false;
                }
                arr.push(obj);
            })
            sendRequest.SaveFunction(arr)
        }
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
        same()  
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
        storage.notA = false
        storage.notD = false
    })

    /**
     * 新增
     */
    //省
    
    $('.addListData').on('click', function() {
        if(storage.userFlag==='userGroup'){
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
        }
        if(storage.userFlag==='user'){
            $('#userTableList').find('tr').removeClass('action')
            $('.changeListData, .deleteListData').removeClass('active')
            $('._deleteTr,._addTr').removeClass('active')
            storage.UserGroupOpType = '0'
            storage.notA = true
            storage.notC = false
            storage.notD = false
            var tr=$('<tr class="_addTr" data-id="'+ -1 +'"></tr>');
            for(var k in storage.user.columnPro){
                var td=$('<td></td>');
                var Pro=storage.user.columnPro[k];
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
                        var span=$('<span></span>')
                        var select=$('<select></select>');
                        for(var key in Pro.values){
                            // if(Pro.values[key]==storage.user.data[j][k].value){
                            //     select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                            // }else{
                            //     select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                            // }
                            select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
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
        }

        if(storage.userFlag==='role'){
            $('#userTableList').find('tr').removeClass('action')
            $('.changeListData, .deleteListData').removeClass('active')
            $('._deleteTr,._addTr').removeClass('active')
            storage.UserGroupOpType = '0'
            storage.notA = true
            storage.notC = false
            storage.notD = false
            var tr=$('<tr class="_addTr" data-id="'+ -1 +'"></tr>');
            for(var k in storage.role.columnPro){
                var td=$('<td></td>');
                var Pro=storage.role.columnPro[k];
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
                        var span=$('<span></span>')
                        var select=$('<select></select>');
                        for(var key in Pro.values){
                            // if(Pro.values[key]==storage.user.data[j][k].value){
                            //     select.append($('<option data-selectIndex="'+ key +'" selected="selected">'+ Pro.values[key] +'</option>'));
                            // }else{
                            //     select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
                            // }
                            select.append($('<option data-selectIndex="'+ key +'">'+ Pro.values[key] +'</option>'));
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
        }

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
        $('.addListData').show();
		$('.changeListData').show();
		$('.deleteListData').show();
    })
    //-----用户组管理-----
    $('.user-left-bar ._users').click(function(){
        $('.addListData').show();
		$('.changeListData').show();
		$('.deleteListData').show();
    })
    $('.user-left-bar ._users span').click(function(){
        sendRequest.GetUserGroup('users');
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
        storage.userFlag='userGroup';
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
        storage.userFlag='role'
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
    })
	$('body').on('click','.user-left-bar ._role ul li',function(){
		$('.addListData').hide();
		$('.changeListData').hide();
		$('.deleteListData').hide();
		
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
        } else if(storage.notA && !_infor) {
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
        $(this).val(replaceNew)
        $(this).prev().html(replaceNew)
        $(this).hide()
        $(this).prev().show()
    })
    $('body').on('change', '#userTableList td>select', function() {
        var replaceNew=$(this).val()
        var dataSelectindex=$(this).find("option:selected").attr("data-selectindex");
        $(this).prev().html(replaceNew).attr("data-selectindex",dataSelectindex);
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
    var recordID;
    $('body').on('click','.user-left-bar ._user li',function(){
        var userGroupID=$(this).attr('data-id');
        recordID=userGroupID;
        sendRequest.GetUserByGroupID(userGroupID);
        storage.userFlag='user';
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
    })
    //sendRequest.GetUserByGroupID(15);
    //点击角色
    var roleID;
    $('body').on('click','.user-left-bar ._role li',function(){
        var roleGroupID=$(this).attr('data-id');
        roleID=roleGroupID;
        sendRequest.GetFuncByRoleID(roleGroupID);
        storage.userFlag='roleInput';
        storage.notA = false
        storage.notC = false
        storage.notD = false
        $('.changeListData, .deleteListData').removeClass('active')
    })
    //角色列表多选框
    // $('body').on('click','#userTableList>ul input',function(){
    //     if($(this).prop('checked')){
    //         $(this).attr('isSelect',true)
    //     }else{
    //         $(this).attr('isSelect',false)
    //     }
    // })
    $('body').on('click','#userTableList>ul input',function(){
        // 判断是否选中
        if($(this).prop('checked')){
            // 选中$(this)
            $(this).attr('isSelect',true)
            // 判断是否根节点
            if($(this).attr('pId')=='-1'){
                $(this).parent().parent().find('input').each(function(i,v){
                    $(v).attr('isSelect',true).prop('checked',true)
                })
            }else{
                // 判断是否叶子节点
                if($(this).attr('isChild')=='false'){
                    // 是叶子节点
                    $(this).parents('.parentNode').each(function(i,v){
                        $($(v).children().get(0)).find('input').attr('isSelect',true).prop('checked',true);
                    })
                }else{
                    // 不是叶子节点
                    $(this).parents('.parentNode').each(function(i,v){
                        $($(v).children().get(0)).find('input').attr('isSelect',true).prop('checked',true);
                    })
                    $(this).parent().parent().find('input').each(function(i,v){
                        $(v).attr('isSelect',true).prop('checked',true)
                    })
                }
            }
        }else{
            // 取消选中
            $(this).attr('isSelect',false)
            // 判断是否根节点
            if($(this).attr('pId')=='-1'){
                $(this).parent().parent().find('input').each(function(i,v){
                    $(v).attr('isSelect',false).prop('checked',false)
                })
            }else{
                // 判断是否叶子节点
                if($(this).attr('isChild')=='false'){
                    // 是叶子节点
                    $(this).parents('.parentNode').each(function(i,v){
                        $($(v).children().get(0)).find('input').attr('isSelect',false).prop('checked',false);
                    })
                }else{
                    // 不是叶子节点
                    $(this).parents('.parentNode').each(function(i,v){
                        $($(v).children().get(0)).find('input').attr('isSelect',false).prop('checked',false);
                    })
                    $(this).parent().parent().find('input').each(function(i,v){
                        $(v).attr('isSelect',false).prop('checked',false)
                    })
                }
            }
        }
    })
    //左边列表选中状态
    $('body').on('click','.user-left-bar li',function(){
        $('.user-left-bar li').each(function(i,v){
            v.className='';
        })
        $(this).addClass('active');
    })
})