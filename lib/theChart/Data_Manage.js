define('dataAdmin', ['jquery', 'map', 'mapIntroduce', 'local', 'api', 'common'], function(jq, map, mi, l, _API, common) {
  if (l._Lh !== 'Data_Manage.html') {
    return
  }
  // require(["markercluster"], function(r) {
  //     // r.MARKER.init("", { defCenter:[29, 100], defZoom:4});
  //     r.MARKER.init("", "");
  //     console.log(r)`
  // });

  // mi.load()
  /**
   * 操作Dom
   * */

  // ch.st(function(data) {
  //         console.log(data)
  //     })


  // require(["markercluster"], function(M) {
  //   M.MARKER.init('', {
  //       call_click: function() {
  //         console.log(1);
  //       }
  //     })
  //     // 选中某个点
  //     // M.MARKER.selectMarker('0201602');
  // });


  // 执行拖拽部分
  $('._j_translate').on('click', function() {
    $(this)._translate_($(this).parents('._a_translate'))
  })

  $('.dataView-Pages').on('scroll', function(e) {
    $('._j_translate').css({
      top: e.currentTarget.scrollTop
    })
  })

  $('body').on('click', '.tree-branch', function() {
    $(this).next().slideToggle().end().toggleClass('open')
  })

  $('.module-md div.md-m').on('click', function() {
    $('.module-md div').removeClass('active')
    $(this).addClass('active')
    $('.module-features').removeClass('open')
    $('#dataView').hide()
    $('#map, .search , #map-control, .CatalogPopup').show()
  })

  $('.module-md div.md-d').on('click', function() {
    $('.module-md div').removeClass('active')
    $(this).addClass('active')
    $('.module-features').addClass('open')
    $('#dataView').show()
    $('#map, .search, #map-control, .CatalogPopup').hide()
  })

  $('#manageIframe > span').on('click', function() {
    $(this).parents('#manageIframe').removeClass('open')
  })

  $('body').on('click', '.tree-p-branch li', function() {
    $('#manageIframe h5').html($(this).html())

    $('.tree-p-branch li').removeClass('active')
    $(this).addClass('active')

    storage.showDataCount = $('.numberCount ').find('input').val()
    storage.newDataCount = $('.vi-pages .selectIn').find('input').val()
    storage.reportid = $(this).data('reportid')
    var s_level = $(this).data('surveylevel')
    storage.categoriesid = $(this).data('categoriesid')
    if (!storage.reportidArr.includes($(this).data('reportid'))) {
      storage.reportidArr.push($(this).data('reportid'))
    }
    l._sql.getReportID($(this).data('reportid'))
    sendRequest.GetReportData()
    require(["markercluster"], function(M) {
      M.MARKER.init(s_level, {
        call_click: function(e) {
          console.log(e);
          sendRequest.GetSurveyInfo(e)
        }
      });
      // 选中某个点
      M.MARKER.selectMarker(storage.reportid, "1");
    });

    // $('#map, .search').hide()
    // $('#dataView').show()
    // $('.module-md div').removeClass('active')
    // $('.md-d').addClass('active')
    // $('.module-features').addClass('open')

  })
  $('body').on('click', '.dataView-Pages td', function() {
    if ($(this).parents('tr').hasClass('active')) {
      $(this).parents('tr').removeClass('active')
    } else {
      $('.dataView-Pages tr').removeClass('active')
      $(this).parents('tr').addClass('active')
      storage.serveryCode = $(this).parents('tr').data('code')
      storage.category = $(this).parents('tr').data('category')
      storage.term = $(this).parents('tr').data('term')
    }
  })

  $('.dataInfo').on('click', function() {
    if (storage.term == null && storage.serveryCode == null) {
      return
    }
    $('#manageIframe').addClass('open')
    $('#manageIframeFile')[0].contentWindow.ins_sheetPanel(storage.reportid, 15, false)
    setTimeout(function() {
      $('#manageIframeFile')[0].contentWindow.ins_loadvalue(storage.reportid, storage.term, storage.serveryCode)
    }, 2000)
  })

  $('.dataMap').on('click', function() {
    if (storage.serveryCode == null) {
      return
    }
    console.log(storage.serveryCode)
    require(["markercluster"], function(r) {
      r.MARKER.selectMarker(storage.serveryCode, storage.category);
    });

    $('.md-m').addClass('active')
    $('.md-d').removeClass('active')
    $('#dataView').hide()
    $('#map, .search, #map-control, .CatalogPopup').show()
    $('.module-features').removeClass('open')
  })

  $('.dataInfo').on('click', function() {
    if (storage.term == null && storage.serveryCode == null) {
      return
    }
    $('#manageIframe').addClass('open')
    $('#manageIframeFile')[0].contentWindow.ins_sheetPanel(storage.reportid, 15, false)
    setTimeout(function() {
      $('#manageIframeFile')[0].contentWindow.ins_loadvalue(storage.reportid, storage.term, storage.serveryCode)
    }, 2000)
  })

  // $('._closePop').on('click', function() {
  //   $('.SelectPopup').hide()
  //   $('#field').val('')
  // })


  $('.selectPop').on('click', function() {
    // var filters = [{
    //     id: '0'
    // }];
    // sqlBuilder = new SqlBuilder('sql-builder')
    // sqlBuilder.init(filters)
    // l._sql.loadBuilter()
    // if (!storage.reportidArr.includes(storage.reportid)) {
    l._categoriesID('categoriesID', storage.categoriesid)
    l._sql.manageBuilter()
      // }
    $('.SelectPopup').show()
  })

  // $('.ImportData').on('click', function() {

  // })

  $('#TemplateUp').on('change', function() {
    sendRequest.ImportData()
  });

  $('.TemplateDownload').on('click', function() {
    sendRequest.TemplateDownload()
  })

  $('.outputExcle').on('click', function() {
    // sendRequest.ExportReportData()
    var _host = 'http://122.224.94.108:8003/zjym/download/exportExcel'

    var reportID = '?reportID=' + storage.reportid

    var categoriesid = '&categoriesID=' + storage.categoriesid

    var goHost = _host + reportID + categoriesid

    window.location.href = goHost
  })

  // 翻页按钮

  $('.vi-pages .next-all').on('click', function() {
    storage.newDataCount = storage.Counts
    $('.vi-pages  .selectIn ').find('input').val(storage.Counts)
    pageSwitch.switch()
  })


  $('.vi-pages .next').on('click', function() {
    storage.newDataCount++
      if (storage.newDataCount >= storage.Counts) {
        storage.newDataCount = storage.Counts
      }
    $('.vi-pages  .selectIn ').find('input').val(storage.newDataCount)
    pageSwitch.switch()
  })


  $('.vi-pages .prev-all').on('click', function() {
    storage.newDataCount = 1
    $('.vi-pages  .selectIn ').find('input').val(1)
    pageSwitch.switch()
  })


  $('.vi-pages .prev').on('click', function() {
    storage.newDataCount--
      if (storage.newDataCount <= 1) {
        storage.newDataCount = 1
      }
    $('.vi-pages  .selectIn ').find('input').val(storage.newDataCount)
    pageSwitch.switch()
  })

  $('.vi-pages .selectIn input').on('keyup', function(e) {
    if (e.keyCode == 13) {
      storage.newDataCount = $(this).val()
      pageSwitch.switch()
    }
  })

  $('.vi-pages .numberCount input').on('keyup', function(e) {
    if (e.keyCode == 13) {
      pageSwitch.switch()
    }
  })



  /**
   * 处理页面切换
   */

  var pageSwitch = {

    switch: function() {
      storage.showDataCount = $('.vi-pages .numberCount ').find('input').val()
      sendRequest.GetReportData()
    }

  }


  /**
   *  数据存储仓库
   * */

  var storage = {
    manage: '',
    dataView: '',
    reportid: '',
    categoriesid: '',
    showDataCount: '',
    newDataCount: '',
    Counts: '',
    reportidArr: [],
    serveryCode: null,
    term: null,
    surveyLevel: l._Lg('___surveyLevel'),
    surveyCode: l._Lg('___surveyCode')
  }

  /**
   * 获取数据
   */

  var sendRequest = {
    GetMapInfo: function() {
      _API._G('DataShow.asmx/GetMapInfo', {
        userID: l._Lg('___userID')
      }, function(data) {
        console.log(data)
        storage.mapURL = data.mapInfo.tileService
        storage.mapCenter = data.mapInfo.center
        storage.mapMinScale = data.mapInfo.minScale
        console.log('data=>', data)
        setTimeout(function() {
          common.mapHelper.addTileLayer({
            id: data.mapInfo.id,
            serviceUrl: data.mapInfo.tileService,
            tilePath: data.mapInfo.tilePath,
            center: data.mapInfo.center,
            zoom: data.mapInfo.minScale,
            zindex: 101
          })
        }, 20000)
      })
    },
    GetSurveyTable: function() {
      _API._G('DataManage.asmx/GetSurveyTable', {}, function(data) {
        storage.manage = data.surveyTable
        embellish.dAdminTree()
        sendRequest.GetMapInfo()
        setTimeout(function() {
          $('#manageIframeFile')[0].contentWindow.ins_displaySheet(false,false, true)
        }, 5000)
      })
    },

    // 翻页功能
    GetReportData: function() {
      _API._G('DataManage.asmx/GetReportData', {
        reportID: storage.reportid,
        categoriesID: storage.categoriesid,
        start: storage.showDataCount * (storage.newDataCount - 1),
        limit: storage.showDataCount * storage.newDataCount
      }, function(data) {
        storage.dataView = data.searchResult
        embellish.dataView()
      })
    },

    ExportReportData: function() {
      _API._G('DataManage.asmx/ExportReportData', {
        reportID: storage.reportid,
        categoriesID: storage.categoriesid
      }, function(data) {
        console.log(data)
      })
    },

    TemplateDownload: function() {
      _API._G('DataManage.asmx/TemplateDownload', {
        reportID: storage.reportid
      }, function(data) {
        window.location.href = data.path
      })
    },

    ImportData: function() {
      var files = $('#TemplateUp').prop('files')
      var fromInfor = new FormData()
      fromInfor.append('fileContent', $('#TemplateUp')[0].files[0])
      fromInfor.append('reportID', storage.reportid)
      _API._S('DataManage.asmx/ImportData', fromInfor, function(data) {
        $('#TemplateUp').val('')
        if (data.errcode) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
          return
        }
        if (data.success) {
          sendRequest.GetReportData()
        } else {
          // storage.errorInformation = data.errorLog
          embellish.errorInformation(data.errorLog)
          $('.errorPopup').show()
        }
      })
    },
    GetSurveyInfo: function(e) {
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

        newAry.push('<hr/>')
        data.term.forEach(function(_val) {
          var cm = '<button class="locatOpenExcel" data-serverycode="'+e.target.options.title + '" data-term= "' + _val.id + '"> ' + _val.name + '</button>'
          newAry.push(cm)
        })

        require(["markercluster"], function(MM) {
          MM.MARKER.openPop(e.target.getLatLng(), newAry);
        });
      })
    }
  }

  /**
   * 渲染页面
   */

  $('body').on('click', '.locatOpenExcel', function() {
    $('#manageIframe').addClass('open')
    var serveryCode = $(this).data('serverycode')
    var term = $(this).data('term')
    $('#manageIframeFile')[0].contentWindow.ins_sheetPanel(storage.reportid, 15, false)
    setTimeout(function() {
      $('#manageIframeFile')[0].contentWindow.ins_loadvalue(storage.reportid, term, serveryCode)
    }, 2000)
  })

  $('.errorCloser').on('click', function() {
    $(this).parents('.errorPopup').hide()
  })

  var embellish = {
    errorInformation: function(erlog) {
      $('.errorInformation').html('')
      var ct = '<table  align="center"><tr class="_column">'
      erlog.column.forEach(function(_val) {
        ct += '<th>' + _val + '</th>'
      })
      ct += '</tr> '

      erlog.data.forEach(function(_vals) {
        ct += '<tr>'
        _vals.forEach(function(_vs) {

          ct += '<td>' + _vs.value + '</td>'
        })

        ct += '</tr>'
      })

      ct += '<table>'

      $('.errorInformation').append(ct)
    },

    dAdminTree: function() {

      var sm = storage.manage

      for (var key in sm) {
        var ct = '<div class="tree-parents"> <div class="tree-radius"> <p>' + key + '</p> <div class="tree-bg">'

        for (var lat in sm[key]) {

          var _u = '<div class="tree-p-branch">'
          _u += '<p class="tree-branch">' + lat + '</p> <ul>'

          sm[key][lat].forEach(function(_val, _in) {
            _u += '<li data-surveylevel= ' + _val.surveyLevel + ' data-reportid=" ' + _val.reportID + '" data-categoriesid=" ' + _val.categoriesID + '">' + _val.reportName + '</li>'
          })
          _u += '</ul> </div>'
          ct += _u

        };
        ct += '</div></div></div>'

        $('.dAdminTree').append(ct)
      };

    },


    dataView: function() {
      $('.isShow span').html('').append(storage.dataView.total)
      var _b = storage.dataView.total / storage.showDataCount
      storage.Counts = _b < 1 ? 1 : Math.ceil(_b)

      $('.selectIn span').html('').append(storage.Counts)
        // storage.dataView
      $('.dataView-Pages').html('')
      var ct = '<table  align="center"><tr class="_column _j_translate _Tr-translate">'

      storage.dataView.column.forEach(function(_val) {
        ct += '<th>' + _val + '</th>'
      })
      ct += '</tr> '

      storage.dataView.data.forEach(function(_vals, index) {
        ct += '<tr data-term = " ' + storage.dataView.term[index] + '"  data-code="' + storage.dataView.code[index] + '" + data-category="'+storage.dataView.category[index]+'">'
        _vals.forEach(function(_vs) {

          ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
        })

        ct += '</tr>'
      })

      ct += '<table>'

      $('.dataView-Pages').append(ct)
    }

  }


  /**
   * 返回接口
   * */

  // return {

  // }

  /**
   * 页面初始化
   */

  sendRequest.GetSurveyTable()
})