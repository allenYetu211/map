define("info", ['map', "jquery", "userservice", 'local', 'api', 'common'], function(map, j, us, l, _API, common) {

  if (l._Lh !== 'Task_Assignment-S.html') {
    return
  }

  require(["markercluster"], function(M) {
    M.MARKER.init('', {
      call_click: function() {
        console.log(1);
      }
    });
    // 选中某个点
    // M.MARKER.selectMarker('0201602');
  });
  $('body').on('click', '.survey2 li input', function() {
      var self = $(this)
      if ($(this).prop('checked')) {
        // require(["markercluster"], function(r) {
        //   r.MARKER.selMarker(self.data('code'));
        // });
        console.log(self.data('code'))
        console.log($('.select1').val())
        require(["markercluster"], function(r) {
          console.log(r)
          r.MARKER.selectMarker(self.data('code'), $('.select1').val());
        });
        // require(["markercluster"], function(r) {
        //   r.MARKER.selMarker("330283");
        // });
      }
    })
    // dom操作
  var generate = $('#left-sidebar .mission .generate');
  var inventory = $('#left-sidebar .mission .inventory');
  var flag = 0;
  // 全选
  $('#left-sidebar .selectAll').click(function() {
    $(this).parent().parent().parent().find('input').prop("checked", true);
  });
  // 取消
  $('#left-sidebar .unSelect').click(function() {
    $(this).parent().parent().parent().find('input').prop("checked", false);
  });
  //弹出框
  function isSuccess(v){
        $('.al-popup-prompt .al-prompt-informations').text(v)
        $('.al-popup-prompt').show();
    }

  /**
   *  数据存储仓库
   * */

  var storage = {
    phase: [],
    category: '',
    survey: '',
    surveyTable: {},
    surveyData: [],
    task: {},
    // 记录任务清单输入
    sureTask: '',
    searchlist: '',
    index: ''
  }

  /**
   * 获取数据
   */

  var sendRequest = {
    callClick: function(e) {
      // 地图点选部分
      _API._G('DataManage.asmx/GetSurveyInfo', {
        reportID: storage.reportid,
        categoriesID: storage.categoriesid,
        surveyCode: e.target.options.title
      }, function(data) {
        console.log(data)
        if (data.errcode) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
          return
        }

        if (data.surveyInfo.length == 0) {
          var newAry = []
          newAry.push('<span>无点选内容，请配置<span>')
        } else {
          var newAry = data.surveyInfo.map(function(_val, index) {
            var ct = ''
            if (index == 0) {
              ct = _val
            } else {
              ct = '<span>' + _val + '</span>'
            }
            return ct
          })
        }

        // newAry.push('<hr/>')
        // data.term.forEach(function(_val) {
        //   var cm = '<button class="locatOpenExcel" data-serverycode="' + e.target.options.title + '" data-term= "' + _val.id + '"> ' + _val.name + '</button>'
        //   newAry.push(cm)
        // })

        require(["markercluster"], function(MM) {
          MM.MARKER.openPop(e.target.getLatLng(), newAry);
        });
      })
    },

    GetTerm: function() {
      _API._G('DataShow.asmx/GetTerm', {}, function(data) {
        storage.phase = data.terms;
        storage.index = data.terms.length - 1;
        RenderPhase();
        setTimeout(function() {
          $('#inforIframe')[0].contentWindow.ins_displaySheet(false, false, false)
        }, 2000)
      })
    },
    // 1.6.2 获取分类目录接口
    GetCategory: function() {
      _API._G('TaskManage.asmx/GetCategory', '', function(data) {
        // console.log(data)
        storage.category = data.category;
        RenderCategory();
        sendRequest.GetSurveyByCategory(1);
      })
    },
    //1.6.3 获取分类目录下的调查对象接口
    GetSurveyByCategory: function(categoryID) {
      _API._G('TaskManage.asmx/GetSurveyByCategory', {
        categoryID: categoryID
      }, function(data) {
        console.log(data)
        storage.survey = data.survey;
        RenderSurvey();

        if (!data.success) {
          $('.survey1 .content').html('')
          return
        }
        sendRequest.GetSurveyTable(($('#left-sidebar .task .select1').val()), ($('#left-sidebar .task .select2').val()));
        sendRequest.GetSurveyData(($('#left-sidebar .task .select1').val()), ($('#left-sidebar .task .select2').val()));
      })
    },
    //1.6.4 获取调查报表接口
    GetSurveyTable: function(categoryID, surveyID) {
      _API._G('TaskManage.asmx/GetSurveyTable', {
        "categoryID": categoryID,
        "surveyID": surveyID
      }, function(data) {
        storage.surveyTable = data.surveyTable;
        RenderSurveyTable();
      })
    },
    //1.6.5 获取调查数据接口
    GetSurveyData: function(categoryID, surveyID) {
      _API._G('TaskManage.asmx/GetSurveyData', {
        "categoryID": categoryID,
        "surveyID": surveyID
      }, function(data) {
        storage.surveyData = data.surveyData;
        console.log(storage.surveyData)
        RenderSurveyData();
      })
    },
    //1.6.6 获取下一级调查数据接口
    GetNextSurveyData: function(categoryID, surveyID, id, callback) {
      _API._G('TaskManage.asmx/GetNextSurveyData', {
        "categoryID": categoryID,
        "surveyID": surveyID,
        "id": id
      }, function(data) {
        storage.surveyData = data.surveyData;
        callback();
      })
    },
    // 1.6.7任务生成接口
    GenerateTask: function(termID, categoryID, surveyID, _surveyTable, _surveyData) {
      _API._G('TaskManage.asmx/GenerateTask', {
        "termID": termID,
        "categoryID": categoryID,
        "surveyID": surveyID,
        "surveyTable": JSON.stringify(_surveyTable),
        "surveyData": JSON.stringify(_surveyData)
      }, function(data) {
        if (data.success == true) {
          // setTimeout(function() {
          $('#progress-bar').hide();
            isSuccess('任务生成成功')
          // $('#generate-success h3').text('任务生成成功');
          // $('#generate-success').show();
          // }, 100)
        } else {
          // setTimeout(function() {
          $('#progress-bar').hide();
          isSuccess('任务生成失败')
          // $('#generate-success h3').text('任务生成失败');
          // $('#generate-success').show();
          // }, 100)
        }
      })
    },
    //1.6.8	获取生成任务列表接口
    GetGenerateTask: function(content) {
      _API._G('TaskManage.asmx/GetGenerateTask', { "content": content }, function(data) {
        if (data.success) {
          storage.task = data.task;
          RenderGetGenerateTask();
        }
      })
    },
    //1.6.9 删除任务接口
    DeleteTask: function(arr) {
      var _obj = {}
      _obj['taskID'] = arr
      _API._G('TaskManage.asmx/DeleteTask', { "taskID": JSON.stringify(_obj) }, function(data) {
        if (data.success == true) {
          sendRequest.GetGenerateTask(sureTask);
        }
      })
    }
  }

  //初始化
  // sendRequest.GetCategory();

  /**
   * 渲染页面
   */
  function ChangePhase(index) {
    $('#left-sidebar .phase li').removeClass('active');
    $('#left-sidebar .phase li:eq(' + index + ')').addClass('active');
    sendRequest.GetCategory();
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
    $('#left-sidebar .task .select1').html('');
    for (var i in storage.category) {
      var option = $('<option></option>>');
      option.html(storage.category[i].categoryName);
      option.attr('value', storage.category[i].categoryID);
      $('#left-sidebar .task .select1').append(option);
    }
  }

  function RenderSurvey() {
    $('#left-sidebar .task .select2').html('');
    for (var i in storage.survey) {
      var option = $('<option></option>>');
      option.html(storage.survey[i].surveyName);
      option.attr('value', storage.survey[i].surveyID);
      $('#left-sidebar .task .select2').append(option);
    }
  }

  function RenderSurveyTable() {
    $('.survey1 .content').html('');
    for (var i in storage.surveyTable) {
      var item = $('<div class="item"></div>');
      var title = $('<p class="item-title">' + i + '</p>');
      item.html(title);
      for (var j in storage.surveyTable[i]) {
        if (storage.surveyTable[i][j].isSelect == 'ture') {
          var p = $('<p><label><input type="checkbox" checked data-id=' + storage.surveyTable[i][j].reportID + '>' + storage.surveyTable[i][j].reportName + '</label><img src="./images/chart/icon_data_info.png" alt=""></p>');


        } else {
          var p = $('<p><label><input type="checkbox" data-id=' + storage.surveyTable[i][j].reportID + '>' + storage.surveyTable[i][j].reportName + '</label><img src="./images/chart/icon_data_info.png" alt=""></p>');
        }
        item.append(p);
      }
      $('.survey1 .content').append(item);
    }
  }
  // 渲染1.6.5 获取调查数据接口
  // function RenderSurveyData() {
  //   console.log('storage.surveyData:',storage.surveyData)
  //   $('.survey2 .content').html('');
  //   var city_ul = recursionSurveyData('-1');
  //   $('.survey2 .content').append(city_ul);
  // }
  // 递归1.6.5 获取调查数据接口
  // function recursionSurveyData(_id) {
  //   var ul = $('<ul></ul>');
  //   for (var i in storage.surveyData) {
  //     if (storage.surveyData[i].pId == _id) {
  //       if (storage.surveyData[i].ischild) {
  //         var li = $('<li dataCode="' + storage.surveyData[i].dataCode + '">' + storage.surveyData[i].dataName + '</li>');
  //         var id = storage.surveyData[i].id;
  //         var _ul=recursionSurveyData(id);
  //         li.append(_ul);
  //       } else {
  //         if (storage.surveyData[i].isSelect == true) {
  //           var li = $('<li><label><input type="checkbox" checked data-Code="' + storage.surveyData[i].dataCode + '" data-Name="' + storage.surveyData[i].dataName + '">' + storage.surveyData[i].dataName + '</label></li>')
  //           //   require(["markercluster"], function(r) {
  //           //   r.MARKER.selectMarker(storage.surveyData[i].dataCode);
  //           // });
  //         } else {
  //           var li = $('<li><label><input type="checkbox" data-Code="' + storage.surveyData[i].dataCode + '" data-Name="' + storage.surveyData[i].dataName + '">' + storage.surveyData[i].dataName + '</label></li>')
  //         }
  //       }
  //     }
  //     ul.append(li);
  //   }
  //   return ul;
  // }

  // 渲染1.6.5 获取调查数据接口
  function RenderSurveyData() {
    $('.survey2 .content').html('');
    var city_ul = $('<ul></ul>')
    for (var i in storage.surveyData) {
      if (storage.surveyData[i].ischild) {
        var li = $('<li class="hasChild" on_off="start" data-Code="' + storage.surveyData[i].dataCode + '" data-Id="' + storage.surveyData[i].id + '"><span>+</span>' + storage.surveyData[i].dataName + '</li>');
      } else {
        if (storage.surveyData[i].isSelect) {
          var li = $('<li><label><input type="checkbox" checked data-Code="' + storage.surveyData[i].dataCode + '" data-Name="' + storage.surveyData[i].dataName + '">' + storage.surveyData[i].dataName + '</label></li>')
        } else {
          var li = $('<li><label><input type="checkbox" data-Code="' + storage.surveyData[i].dataCode + '" data-Name="' + storage.surveyData[i].dataName + '">' + storage.surveyData[i].dataName + '</label></li>')
        }
      }
      city_ul.append(li);
    }
    $('.survey2 .content').append(city_ul);
  }

  function RenderSurveyDataChild() {
    var ul = $('<ul></ul>');
    for (var i in storage.surveyData) {
      if (storage.surveyData[i].ischild) {
        var li = $('<li class="hasChild" on_off="start" data-Code="' + storage.surveyData[i].dataCode + '" data-Id="' + storage.surveyData[i].id + '"><span>+</span>' + storage.surveyData[i].dataName + '</li>');
      } else {
        if (storage.surveyData[i].isSelect) {
          var li = $('<li><label><input type="checkbox" checked data-Code="' + storage.surveyData[i].dataCode + '" data-Name="' + storage.surveyData[i].dataName + '">' + storage.surveyData[i].dataName + '</label></li>');
          require(["markercluster"], function(r) {
            r.MARKER.selectMarker(storage.surveyData[i].dataCode);
          });
        } else {
          var li = $('<li><label><input type="checkbox" data-Code="' + storage.surveyData[i].dataCode + '" data-Name="' + storage.surveyData[i].dataName + '">' + storage.surveyData[i].dataName + '</label></li>')
        }
      }
      ul.append(li);
    }
    return ul;
  }

  // 渲染任务清单表格
  function RenderGetGenerateTask() {
    $('#GetTask .content').html('');
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
        var td = $('<td>' + storage.task.data[j][k].value + '</td>');
        tr.append(td);
      }
      tb.append(tr);
    }
    $('#GetTask .content').append(tb);
  }



  // 进度条
  var progress_flag = true;
  var value = 0;

  function Progress() {
    $('#progress-bar').show();
    var Interval = setInterval(function() {
      value += 2;
      if (value >= 98) {
        clearInterval(Interval);
      }
      $('#progress-bar .progress-bar').css("width", value + "%").text(value + "%");
    }, 200);
  }

  /*
   *用户操作
   * */

  $('#left-sidebar .phase .prev-btn').click(function() {
    if (flag > 0) {
      flag--;
      ChangePhase(flag);
    }
  });
  $('#left-sidebar .phase .next-btn').click(function() {
    if (flag < storage.index) {
      flag++;
      ChangePhase(flag);
    }
  });
  $('#left-sidebar .task .select1').change(function() {
    sendRequest.GetSurveyByCategory($(this).val());
  });
  $('#left-sidebar .task .select2').change(function() {
    // if ($(this).children().length === 0) return
    sendRequest.GetSurveyTable(($('#left-sidebar .task .select1').val()), ($('#left-sidebar .task .select2').val()));
    sendRequest.GetSurveyData(($('#left-sidebar .task .select1').val()), ($('#left-sidebar .task .select2').val()));
    require(["markercluster"], function(r) {
      r.MARKER.init($('#left-sidebar .task .select2').val(), {
        call_click: function(e) {
          sendRequest.callClick(e)
        }
      });
    });
  });

  // 调查对象li
  $('body').on('selectstart', '.survey2 .content li', function() {
    return false;
  })

  $('body').on('click', '.survey2 .content li', function(event) {
    event.stopPropagation();
    var _this = $(this);
    if (_this.hasClass('hasChild') && _this.attr('on_off') === 'start') {
      sendRequest.GetNextSurveyData(($('#left-sidebar .task .select1').val()), ($('#left-sidebar .task .select2').val()), $(this).attr('data-Id'), function() {
        console.log(storage.surveyData)
        var _ul = RenderSurveyDataChild();
        _this.append(_ul);
        _this.children('span').html('-');
        _this.attr('on_off', 'on');
      });
    } else {
      if (_this.hasClass('hasChild') && _this.attr('on_off') === 'on') {
        _this.children('ul').hide();
        _this.children('span').html('+');
        _this.attr('on_off', 'off');
      } else {
        _this.children('ul').show();
        _this.children('span').html('-');
        _this.attr('on_off', 'on');
      }
    }
  })



  // 任务生成
  $('#left-sidebar .mission .generate').click(function() {
    // termID,categoryID,surveyID,surveyTable,surveyData
    if (progress_flag) {
      progress_flag = false;
      var termID = $('#left-sidebar .phase li.active').data('id');
      var categoryID = $('#left-sidebar .task .select1').val();
      var surveyID = $('#left-sidebar .task .select2').val();
      var _surveyTable = {}
      var _surveyData = {}
      var surveyTable = [];
      $('#left-sidebar .survey1 input[type=checkbox]').each(function(i, el) {
        if (el.checked) {
          surveyTable.push(el.dataset.id);
        }
      });
      var surveyData = [];
      $('#left-sidebar .survey2 input[type=checkbox]').each(function(i, el) {
        if (el.checked) {
          var surveyObj = {};
          surveyObj.dataName = el.dataset.name;
          surveyObj.dataCode = el.dataset.code;
          surveyData.push(surveyObj);
        }
      });
      _surveyTable['surveyTable'] = surveyTable;
      _surveyData['surveyData'] = surveyData;

      if (surveyTable.length === 0 || surveyData.length === 0) {
        progress_flag = true;
        $('.al-popup-prompt').show().find('.al-prompt-informations').html('请勾选')
          // alert('请勾选')
      } else {
        console.log(termID, categoryID, surveyID)
        sendRequest.GenerateTask(termID, categoryID, surveyID, _surveyTable, _surveyData);
        // 进度条
        Progress();
      }

    }
  });

  // $('.content').on('change', 'input', function () {
  //   console.log()
  //   if( $(this).prop('checked')) {

  //   }
  // })

  // 任务生成成功-取消
  $('#generate-success img').click(function() {
    $('#generate-success').hide();
    value = 0;
    $('#progress-bar .progress-bar').css("width", value + "%").text(value + "%");
    progress_flag = true;
  })

  // 查看任务
  $('.survey1 .content').delegate('img', 'click', function() {
      var reportID = $(this).parent().find('input').attr('data-id');
      var title = $(this).parent().text();
      $('#task-table').find('h3 span').text(title);
      $('#task-table').show();
      // $('#inforIframe')[0].contentWindow.ins_displaySheet()
      $('#inforIframe')[0].contentWindow.ins_sheetPanel(reportID, 15, false)
    })
    //关闭查看任务
  $('#task-table h3 img').click(function() {
    $('#task-table').hide();
  })

  //点击任务清单
  $('#left-sidebar .mission .inventory').click(function() {
      $('#GetTask').show();
      sureTask = '';
      sendRequest.GetGenerateTask(sureTask);
    })
    //关闭任务清单
  $('#GetTask h3 img').click(function() {
      $('#GetTask').hide();
    })
    //任务清单搜索|回车搜索
  $('#GetTask-search .selectSearchbar').click(function() {
      sureTask = $('#GetTask-search input').val();
      sendRequest.GetGenerateTask(sureTask);
    })
  document.onkeydown=function(event){
    var e = event || window.event;
    if(e && e.keyCode==13){
      sureTask = $('#GetTask-search input').val();
      sendRequest.GetGenerateTask(sureTask);
    }
  }
    // 任务清单清楚搜索
  $('#GetTask-search .close').click(function() {
      $('#GetTask-search .searchbar').val('');
      sureTask = '';
      sendRequest.GetGenerateTask(sureTask);
    })
    //任务清单行
  $('#GetTask .content').delegate('tr', 'click', function() {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        $(this).addClass('active');
      }
    })
    //任务清单删除
  $('#GetTask .delete').click(function() {
    $('#GetTask .make-sure').show();
  })
  $('#GetTask .make-sure .cancel').click(function() {
    $('#GetTask .make-sure').hide();
  })
  $('#GetTask .make-sure .sure').click(function() {
    $('#GetTask .make-sure').hide();
    var arr = [];
    $('#GetTask .content tr').each(function(i, v) {
      if (v.className == 'active') {
        arr.push(parseInt(v.getAttribute('data-taskid')));
      }
    })
    sendRequest.DeleteTask(arr);
  })
  sendRequest.GetTerm()

  $('.survey1-img').click(function() {
    $('.survey1 .content').show();
    $('.survey2 .content').hide();
    $('.survey2-img').show();
    $(this).hide();
  })
  $('.survey2-img').click(function() {
    $('.survey2 .content').show();
    $('.survey1 .content').hide();
    $('.survey1-img').show();
    $(this).hide();
  })

})