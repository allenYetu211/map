define("info_direction", ['map', "jquery", "userservice", 'local', 'api'], function(map, j, us, l, _API) {

  if (l._Lh !== 'Task_Assignment-F.html') {
    return
  }
  //全局变量
  var flag = 0;
  var TempArr = [];
  // dom操作


  /**
   *  数据存储仓库
   * */

  var storage = {
    phase: [],
    category: [],
    task: {},
    Investigator: {},
    taskID: '',
    allocationList: {}
  }

  /**
   * -----ajax获取数据开始-----
   */
  //1.7.1	获取调查期接口
  // ch.st(function(data) {
  //     storage.phase = data.terms;
  //     RenderPhase();
  // });
  var sendRequest = {
      GetTerm: function() {
        _API._G('DataShow.asmx/GetTerm', {}, function(data) {
          storage.phase = data.terms;
          RenderPhase();
        })
      },
      // 1.7.2 获取分类目录接口
      GetCategory: function() {
        _API._G('TaskManage.asmx/GetCategory', '', function(data) {
          storage.category = data.category;
          RenderCategory();
          init();
        })
      },
      //1.7.3 获取任务列表接口
      GetTask: function(termID, categoryID, status) {
        _API._G('TaskManage.asmx/GetTask', {
          termID: termID,
          categoryID: categoryID,
          status: status
        }, function(data) {
          storage.task = data.task;
          console.log(storage.task)
          RenderGetTask();
        })
      },
      //1.7.4 获取调查人员列表接口
      GetInvestigator: function(taskID) {
        _API._G('TaskManage.asmx/GetInvestigator', {
          "taskID": taskID
        }, function(data) {
          storage.Investigator = data;
          RenderInvestigator();
          console.log(data);
        })
      },
      //1.7.5 任务分配接口
      AssignTask: function(taskID, taskInv) {
        var _taskID = parseInt(taskID);
        var _obj = {};
        _obj['taskInv'] = taskInv;
        _API._G('TaskManage.asmx/AssignTask', {
          "taskID": _taskID,
          "taskInv": JSON.stringify(_obj)
        }, function(data) {
          if (data.success == true) {
            $('.al-popup-prompt').show().find('.al-prompt-informations').html('任务分配成功')
            init();
          }
        })
      },
      //1.7.6 获取分配任务列表接口
      GetAssignTask: function(content) {
        _API._G('TaskManage.asmx/GetAssignTask', {
          "content": content
        }, function(data) {
          storage.allocationList = data.task;
          RenderAllocationList();
        })
      }
    }
    /**
     * -----ajax获取数据结束-----
     */

  //初始化
  // sendRequest.GetCategory();
  sendRequest.GetTerm();

  function init() {
    var termID = flag + 1;
    var categoryID = $('#left-sidebar .classify .select1').val();
    var status = $('#left-sidebar .tab-page li[class="active"]').attr('data-status');
    sendRequest.GetTask(termID, categoryID, status);
  }
  /**
   * ---------------渲染页面开始----------------
   */
  function ChangePhase(index) {
    $('#left-sidebar .phase li').removeClass('active');
    $('#left-sidebar .phase li:eq(' + index + ')').addClass('active');
    sendRequest.GetCategory();
    // $('#left-sidebar .phase-content').hide();
    // $('#left-sidebar .phase-content:eq(' + index + ')').show();
  }

  function RenderPhase() {
    for (var i in storage.phase) {
      var li = $('<li class="button_d" data-id="' + storage.phase[i].termID + '">');
      var h2 = $('<h2>' + storage.phase[i].termID + '</h2>');
      var h4 = $('<h4>' + storage.phase[i].termName + '</h4>');
      li.append(h2);
      li.append(h4);
      $('#left-sidebar .phase ul').append(li);
    }
    ChangePhase(flag);
  }

  function RenderCategory() {
    $('#left-sidebar .classify .select1').html('');
    for (var i in storage.category) {
      var option = $('<option></option>>');
      option.html(storage.category[i].categoryName);
      option.attr('value', storage.category[i].categoryID);
      $('#left-sidebar .classify .select1').append(option);
    }
  }

  function RenderGetTask() {
    $('#left-sidebar ._table').html('');
    var tb = $('<table></table>');
    var tr1 = $('<tr></tr>');
    for (var i in storage.task.column) {
      var th = $('<th>' + storage.task.column[i] + '</th>');
      tr1.append(th);
    }
    tb.append(tr1);

    for (var j in storage.task.data) {
      var tr = $('<tr data-taskID=' + storage.task.taskID[j] + '></tr>');
      for (var k in storage.task.data[j]) {
        var td = $('<td >' + storage.task.data[j][k].value + '</td>');
        td.css('wordBreak', "break-all");
        td.css('wordWrap', "break-word");
        tr.append(td);
      }
      tb.append(tr);
    }
    $('#left-sidebar ._table').append(tb);
  }
  // 渲染调查人员列表
  function RenderInvestigator() {
    $('#GetInvestigator ul').html("");
    var ulLeft = $('#GetInvestigator .Inv-left ul');
    var ulRight = $('#GetInvestigator .Inv-right ul');
    // TempArr=[];
    for (var i in storage.Investigator.inv) {
      var li = $('<li data-id="' + storage.Investigator.inv[i].id + '">' + storage.Investigator.inv[i].name + '</li>');
      ulLeft.append(li);
      //ulLeft数据存入TempArr
      // TempArr[i]=storage.Investigator.inv[i].name;
    }
    for (var i in storage.Investigator.taskInv) {
      var li = $('<li data-id="' + storage.Investigator.taskInv[i].id + '">' + storage.Investigator.taskInv[i].name + '</li>');
      ulRight.append(li)
    }
  }

  function RenderAllocationList() {
    $('#GetAssignTask .content').html('');
    var tb = $('<table></table>');
    var tr1 = $('<tr></tr>');
    for (var i in storage.allocationList.column) {
      var th = $('<th>' + storage.allocationList.column[i] + '</th>');
      tr1.append(th);
    }
    tb.append(tr1);
    for (var j in storage.allocationList.data) {
      var tr = $('<tr data-taskID=' + storage.allocationList.data[j] + '></tr>');
      for (var k in storage.allocationList.data[j]) {
        var td = $('<td>' + storage.allocationList.data[j][k].value + '</td>');
        tr.append(td);
      }
      tb.append(tr);
    }
    $('#GetAssignTask .content').append(tb);
  }


  /**
   * ---------------渲染页面结束----------------
   */



  /*
   *-------------用户操作--------------
   * */
  $('#left-sidebar .phase .prev-btn').click(function() {
    if (flag > 0) {
      flag--;
      ChangePhase(flag);
    }
    // init();
  });
  $('#left-sidebar .phase .next-btn').click(function() {
    if (flag < 2) {
      flag++;
      ChangePhase(flag);
    }
    // init();
  });
  //分类目录下拉框
  $('#left-sidebar .classify .select1').change(function() {
    init();
  });
  //Tab页切换
  $('#left-sidebar .tab-page li').each(function(i, v) {
    v.onclick = function() {
      $('#left-sidebar .tab-page li').removeClass('active');
      this.className = 'active';
      init();
    }
  });
  //点击分配状态
  $('#left-sidebar .tab-page ._table').delegate('tr td:last-child', 'click', function() {
      storage.taskID = this.parentNode.getAttribute('data-taskid');
      $('#GetInvestigator-search .searchbar').val('');
      $('#GetInvestigator').show();
      sendRequest.GetInvestigator(storage.taskID);
    })
    //X关闭任务分配
  $('#GetInvestigator h3 img').click(function() {
      $('#GetInvestigator').hide();
      $('#GetInvestigator .success').hide();
    })
    // 点击调查人员列表
  $('#GetInvestigator .Inv-left ul').delegate('li', 'click', function() {
      $('#GetInvestigator .Inv-left ul li').show()
      $('#GetInvestigator .Inv-right ul').append(this);
    })
    // 点击已选择人员
  $('#GetInvestigator .Inv-right ul').delegate('li', 'click', function() {
      $('#GetInvestigator .Inv-left ul').append(this);
    })
    //任务分配确定
  $('#GetInvestigator .table-btn .sure').click(function() {
      var taskInv = [];
      $('#GetInvestigator .Inv-right ul li').each(function(i, v) {
        taskInv.push(parseInt(v.getAttribute('data-id')));
      });
      sendRequest.AssignTask(storage.taskID, taskInv);
    })
    //取消-任务分配
  $('#GetInvestigator .table-btn .cancel').click(function() {
      $('#GetInvestigator').hide();
      $('#GetInvestigator .success').hide()
    })
    //关闭任务成功
  $('#GetInvestigator .success img').click(function() {
      $('#GetInvestigator .success').hide()
    })
    //-------任务分配搜索-------
  $('#GetInvestigator-search .selectSearchbar').click(function() {
    filterSelect()
  })

  function filterSelect() {
    TempArr = [];
    var input_val = $('#GetInvestigator-search .searchbar').val();
    var _val = $('#GetInvestigator .Inv-left li');
    _val.each(function(j, v) {
      TempArr[j] = v.innerText;
      v.style.background = ''
    })
    for (i = 0; i < TempArr.length; i++) {
      //若找到以txt的内容开头的，添option
      if (TempArr[i].substring(0, input_val.length).indexOf(input_val) == 0 && input_val.length !== 0) {
        // _val.val('+ TempArr[i] +').css('background','red')
        _val.each(function(j, v) {
            if (v.innerText !== TempArr[i]) {
              // console.log(v)
              $(this).hide()
                // v.style.background='rgba(0, 136, 235, 0.2)'
            }
          })
          // alert(TempArr[i])
      }
    }
  }

  $('#GetInvestigator-search .searchbar').on('keyup', function(e) {
    if (e.keyCode === 13) {
      filterSelect()
    }
  })

  $('#GetAssignTask-search .searchbar').on('keyup', function(e) {
      if (e.keyCode === 13) {
        var content = $('#GetAssignTask-search input').val();
        sendRequest.GetAssignTask(content);
      }
    })
    //任务分配搜索叉
  $('#GetInvestigator-search .searchbar-Emptied').click(function() {
      $('#GetInvestigator-search .searchbar').val('');
      $('#GetInvestigator .content li').show()
    })
    // 打开分配清单
  $('#left-sidebar .tab-page .allocation-list').click(function() {
      $('#GetAssignTask').show();
      sendRequest.GetAssignTask('')
    })
    //任务清单搜索
  $('#GetAssignTask-search .selectSearchbar').click(function() {
      var content = $('#GetAssignTask-search input').val();
      sendRequest.GetAssignTask(content);
    })
    //任务清单搜索叉
  $('#GetAssignTask-search .searchbar-Emptied').click(function() {
      $('#GetAssignTask-search .searchbar').val('');
      sendRequest.GetAssignTask('')
    })
    //关闭任务清单
  $('#GetAssignTask h3 img').click(function() {
    $('#GetAssignTask').hide()
  })
})