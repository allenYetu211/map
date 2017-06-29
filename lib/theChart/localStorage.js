define('local', ['jquery', 'translatePopup', 'api', 'common'], function(jq, tl, _API, common) {




  // 加载选项

  var L = {
    setItem: function(name, data) {
      window.localStorage.setItem(name, data)
    },

    getItem: function(name) {
      return window.localStorage.getItem(name)
    },

    host: function() {
      var _local = window.location.href
      var infor = _local.replace(/.*[themeMap_3||com||:\w]\/(.*)/, '$1')
      return infor
    },
    localhost: function() {
      return window.location.href
    }
  }


  var _sql = {
    sqlBuilder: '',
    loadBuilter: function(filters) {
      var _filters = filters || [{ id: '0' }]
      this.sqlBuilder = new SqlBuilder('sql-builder')
      this.sqlBuilder.init(_filters)
    },

    getSql: function() {
      return this.sqlBuilder.getSql()
    },

    reset: function() {
      return this.sqlBuilder.reset()
    },

    splFun: function(infodata) {
      if (typeof this.sqlBuilder == 'function') {
        this.sqlBuilder = new SqlBuilder('sql-builder')
        this.sqlBuilder.init(infodata)
      }
      this.sqlBuilder.setFilters(infodata)
    },
    getReportID: function(reportID) {
      storage.reportID = reportID
    },
    manageBuilter: function () {
      var _filters = [{ id: '0' }]
      this.sqlBuilder = new SqlBuilder('sql-builder')
      this.sqlBuilder.init(_filters)
      sendRequest.GetTableField()
    }
  }

  var storage = {
    reportID: '',
    tableField: '',
    arrayposts: [],
    fieldInfoData: [],
    fields: [],
    _requertCount: 0,
    searchlist: '',
    _describe: [],
    _number: [],
    _quality: [],
    fieldArr: [],
    uploadField: [],
    summaryCondition: null,
    _pageShowCount: '', // 每页显示条数
    _persentCount: '', // 当前显示条数
    _allrecordCount: '', // 记录条数
    OBJ: '',
    SQL: '',
    selectSate: false,
    categoriesID: null,
    sectionInit: true
  }

  var sendRequest = {
    GetTableField: function() {
      _API._G('DataShow.asmx/GetTableField', {
        reportID: storage.reportID
      }, function(data) {
        if (data.tableField.length == 0) {
          $('.select .cp-dataInfor').addClass('open')
          $('.masking-animation').hide()
          return
        }
        $('.select .cp-dataInfor').removeClass('open')
        storage.tableField = data.tableField
        embellish.fieldList()
        sendRequest.GetStatisticRule()
      })
    },
    GetStatisticRule: function() {
      _API._G('DataShow.asmx/GetStatisticRule', {}, function(data) {
        storage.rule = data
        embellish.statistic()
      })
    },

    GetFieldInfo: function(_vs) {
      var self = this
      $('.masking-animation ').show();
      // _sql.sqlBuilder = new SqlBuilder('sql-builder')
        // storage.fields = []
      _API._G('DataShow.asmx/GetFieldInfo', {
        egFields: _vs.join(',')
      }, function(data) {
        storage.fields = []
        storage.fieldInfoData = []
        storage._requertCount = 0
        var _fild = data.fieldInfo
        _fild.forEach(function(_val) {
          storage._requertCount++
            switch (_val.type) {
              case 'string':
                _val.input = 'textarea'
                _val.rows = 1
                _val.optgroup = 'text'
                break;

              case 'integer':
                _val.input = 'select'
                _val.placeholder = '-----'
                break;

              case 'double':
                _val.size = 5
                _val.data = 'com.example.PriceTag'
                _val.optgroup = 'number'
                _val.validation = {
                  "min": 0,
                  "step": 0.01
                }

                break;

              default:
                break;

            }
          _val.operators = ["equal", "not_equal", "is_null", "is_not_null"]
          storage.fieldInfoData.push(_val)
          storage.fields.push(_val.id)
        })

          _sql.sqlBuilder.setFilters(storage.fieldInfoData)
          // if (typeof _sql.sqlBuilder !== 'object') {
          //   _sql.sqlBuilder = new SqlBuilder('sql-builder')
          //   _sql.sqlBuilder.init(storage.fieldInfoData)
          // } else {
          //   _sql.sqlBuilder.setFilters(storage.fieldInfoData)
          // }
      })
      $('.masking-animation ').hide();
    },

    GetSearchResult: function() {
      obj = ''
      if (storage.OBJ !== '') {
        obj = storage.OBJ
      }
      var _persentCount = $('.si-pages .numberCount').find('input').val()
      _API._G('DataShow.asmx/GetSearchResult', {
        reportID: storage.reportID,
        fields: storage.fields.join(','),
        queryCondition: storage.SQL,
        summaryCondition: obj,
        start: (storage._pageShowCount - 1) * _persentCount,
        limit: storage._pageShowCount * _persentCount,
      }, function(data) {
        if (!data.success) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
        }

        $('.FieldDataloading').hide()
        storage.serchResultData = data.searchResult
        storage._allrecordCount = data.searchResult.total
        dispose.p()
        embellish.showFieldData()
        $('.statisticsPane').hide()
          // $('.showFieldData').html('')
      })
    },
    IndiatorSearch: function(_val) {
      _API._G('DataShow.asmx/IndiatorSearch', {
        content: _val
      }, function(translateData) {
        storage.searchlist = translateData;
        L.setItem('___selecte', '')
        embellish.searchlist()
      })
    }
  }

  var dispose = {
    p: function() {
      var _pCount = $('.si-pages .numberCount input').val()
      var _allPage = Math.ceil(storage._allrecordCount / _pCount)
      storage._allPageCount = _allPage
      $('.si-pages .isShow span').html(storage._allrecordCount)
      $('.si-pages .selectIn span').html(_allPage)
    }
  }

  $('.numberCount input').on('keyup', function(e) {
    if (e.keyCode == 13) {
      sendRequest.GetSearchResult()
    }
  })

  $('.si-pages .next-all').on('click', function() {
    storage._pageShowCount = storage._allPageCount
    $('.si-pages .selectIn ').find('input').val(storage._pageShowCount)
    sendRequest.GetSearchResult()
  })


  $('.si-pages .next').on('click', function() {
    storage._pageShowCount++
      if (storage._pageShowCount >= storage._allPageCount) {
        storage._pageShowCount = storage._allPageCount
      }

    $('.si-pages .selectIn ').find('input').val(storage._pageShowCount)
    sendRequest.GetSearchResult()
  })



  $('.si-pages .prev-all').on('click', function() {
    storage._pageShowCount = 1
    $('.si-pages .selectIn ').find('input').val(storage._pageShowCount)
    sendRequest.GetSearchResult()
  })


  $('.si-pages .prev').on('click', function() {
    storage._pageShowCount--
      if (storage._pageShowCount <= 1) {
        storage._pageShowCount = 1
      }
    $('.si-pages .selectIn ').find('input').val(storage._pageShowCount)
    sendRequest.GetSearchResult()
  })

  var embellish = {

    // fieldList: function() {
    //   var ct = ''
    //   storage.tableField.forEach(function(_val, _in) {
    //     ct += '<li data-index = ' + _in + '  class="field-itmes" > ' + _val.chField + '</li>'
    //   })
    //   $('.tableField ul').html('').append(ct)
    // },
    fieldList: function() {
      var arr = []
      storage._quality = []
      storage._describe = []
      storage._number = []
      storage.tableField.forEach(function(_val, _in) {
          if (_val.indicatorType == '品质指标') {
            storage._quality.push(_val)
          } else if (_val.indicatorType == '描述指标') {
            storage._describe.push(_val)
          } else {
            storage._number.push(_val)
          }
          console.log(_val.egField)
          arr.push(_val.egField)
        })
        // embellish.statistic()
      sendRequest.GetFieldInfo(arr)
    },
    statistic: function() {
      var ct = ''
      var def = ''
      var field = embellish.toolCreatOption(storage._number, storage._describe, true)
      var statistics = embellish.toolCreatOption(storage._quality, storage._describe, false)
      storage.rule.statisticRule.forEach(function(_val, _in) {
        if (_in == 0) {
          def = _val.id
        }
        ct += '<option data-id="' + _val.id + '">' + _val.name + '</option>'
      })
      $('._packet ul').html('').append(statistics)
      $('._sta_filed select').html('').append(field._c)
      $('._sta_way select').html('').append(ct)
      $('.addStatistics-filed').data('field', field.default)
      $('.addStatistics-filed').data('rule', def)
    },
    toolCreatOption: function(ta1, ta2, classify) {
      var target = ta1.concat(ta2)
      if (classify) {
        var ct = ''
        var def = ''
        target.forEach(function(_val, _in) {
          if (_in == 0) {
            def = _val.egField
          }
          ct += '<option data-eg="' + _val.egField + '">' + _val.chField + '</option>'
        })
        return {
          _c: ct,
          default: def
        }
      } else {
        var st = ''
        target.forEach(function(_val) {
          st +=
            '<li class="al-row"> ' +
            ' <input id="' + _val.egField + '" type="checkbox">' +
            ' <label data-eg="' + _val.egField + '" for="' + _val.egField + '"> ' + _val.chField + '</label>'
          '</li>'
        })
        return st
      }
    },

    showFieldData: function() {
      $('.showFieldDataTab').html('')
      var ct = '<table  align="center"><tr class="_column">'
      storage.serchResultData.column.forEach(function(_val) {
        ct += '<th>' + _val + '</th>'
      })
      ct += '</tr> '

      storage.serchResultData.data.forEach(function(_vals) {
        ct += '<tr>'
        _vals.forEach(function(_vs) {

          ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
        })

        ct += '</tr>'
      })

      ct += '<table>'

      $('.showFieldDataTab').append(ct).show()
    },

    // searchlist: function() {
    //   $('.filedCondition').html('')
    //   storage.searchlist.result.forEach(function(_val) {

    //     var ct = ''

    //     for (var key in _val) {
    //       ct = '<div>按&nbsp;<span> ' + key + ' </span>&nbsp;搜索'
    //       _val[key].forEach(function(_val_) {
    //         ct += '<p class="_valName"data-level="' + _val_.level + '" data-maxScale="' + _val_.maxScale + '" data-minScale="' + _val_.minScale + '" data-centerX="' + _val_.center[0] + '" data-centerY="' + _val_.center[1] + '" data-code="' + _val_.code + '" data-serarchID="' + _val_.searchID + '"> ' + _val_.name + '</p>'
    //       })
    //       ct += '</div>'

    //     }

    //     $('.filedCondition').append(ct)

    //   })
    // },
    searchlist: function() {
      $('.filedCondition').html('')
      storage.searchlist.result.forEach(function(_val) {

        var ct = ''

        for (var key in _val) {
          ct = '<div>按&nbsp;<span> ' + key + ' </span>&nbsp;搜索'
          _val[key].forEach(function(_val_) {
            ct += '<p class="_valName" data-maxScale="' + _val_.maxScale + '" data-minScale="' + _val_.minScale + '" data-centerX="' + _val_.center[0] + '" data-centerY="' + _val_.center[1] + '" data-code="' + _val_.code + '" data-serarchID="' + _val_.searchID + '"> ' + _val_.name + '</p>'
          })
          ct += '</div>'

        }

        $('.filedCondition').append(ct)

      })
    }
  }
  $('body').on('click', '._tbmLaber.reportID', function() {
    // storage.reportID = $(this).data('id')
    sendRequest.GetTableField()
  })
  // $('.addFiled button').on('click', function() {
  //   if (!$('#sql-builder').hasClass('ADDoptions')) {
  //     sendRequest.GetTableField()
  //     $('#sql-builder').addClass('ADDoptions')
  //   }
  //   $('.tableField').show()
  // })

  $('._tableFieldclose span').on('click', function() {
    $('.tableField').hide()
  })

  $('._j_stcloser').on('click', function() {
    $('#field').val('')
    storage.fieldArr = []
    $('.al-row input').prop('checked', false)
    $('.statisticsPane').hide()
  })

   $('._closePop').on('click', function() {
    $('.SelectPopup').hide()
    $('#field').val('')
    storage.fieldArr = []
  })

  $('body').on('click', '.statisticsPane-moreSelect input', function() {
    if ($(this).prop('checked')) {
      storage.fieldArr.push($(this).next().html())
      storage.uploadField.push($(this).next().data('eg'))
    } else {
      var removeindex = storage.fieldArr.indexOf($(this).next().html())
      var removeeg = storage.fieldArr.indexOf($(this).next().data('eg'))
      storage.fieldArr.splice(removeindex, 1)
      storage.uploadField.splice(removeeg, 1)
    }

    var inputArr = storage.fieldArr.join()
    $('#field').val(inputArr)

  })

  $('body').on('change', '._sta_filed select', function() {
    $(this).parents('.addStatistics-filed').data('field', $(this).find('option:selected').data('eg'))
  })

  $('body').on('change', '._sta_way select', function() {
    $(this).parents('.addStatistics-filed').data('rule', $(this).find('option:selected').data('id'))
  })

  $('._j_stsubmit').on('click', function() {
    var arr = []
    var temporary = null
    $('.addStatistics-filed').each(function(_val) {
      temporary = {}
      temporary['field'] = $(this).data('field')
      temporary['rule'] = $(this).data('rule')
      arr.push(temporary)
    })
    var _obj = {
      groupField: storage.uploadField.join(),
      statistic: arr
    }
    _obj = JSON.stringify(_obj)
    storage.summaryCondition = _obj
    storage.OBJ = _obj
    sendRequest.GetSearchResult()
  })



  $('._j_cliearOpens').on('click', function() {
    $(this).next().slideToggle()
  })

  $('body').on('click', '.field-itmes', function() {
    var filg = true
    var _tindex = $(this).data('index')
    var _color = ''

    if (storage.arrayposts.includes(_tindex)) {
      return
    }

    storage.arrayposts.push($(this).data('index'))


    switch (storage.tableField[$(this).data('index')].indicatorType) {
      case '描述指标':
        _color = '#7ED321'
        break;

      case '数量指标':
        _color = '#E93F00'
        break;

      default:
        _color = '#0088EB'
        break;
    }
    storage.egfield += $(this).data('egfield') + ','
    var select = '<div data-index="' + $(this).data('index') + '" style = "background-color: ' + _color + '" class="select_cf">' + $(this).text() + '</div>'
    var option = '<option value="' + $(this).text() + '"> ' + $(this).text() + '</option>'

    $('.selcetInfo').append(select)
    $('.selectOn_:last').find('._filed').append(option)
    $('.tableField').hide()

    storage.fieldInfoData = []
    storage.fields = []
    storage._requertCount = 0
    var filter = []
    $('.selcetInfo').find('div').each(function() {
      filter.push(storage.tableField[$(this).data('index')].egField)
    })
    sendRequest.GetFieldInfo(filter)


  })

  $('._getsql').on('click', function() {
    $('.FieldDataloading').show()
    $('._statistics, ._downloadTable').show()
    storage.SQL = _sql.getSql()
    storage._pageShowCount = $('.si-pages .selectIn').find('input').val()
    storage._persentCount = $('.si-pages .numberCount').find('input').val()
    storage.OBJ = ''
    sendRequest.GetSearchResult()
    storage.selectSate = true
      // $('.si_page')
  })
  $('._statistics').on('click', function() {
    $('.statisticsPane').show()
  })

  $('._reset').on('click', function() {
    // var sql = sqlBuilder.reset()
    var sql = _sql.reset()
    storage.arrayposts = []
    storage.SQL = ''
    $('.selcetInfo').html('')
    $('.showFieldDataTab').html('')
  })

  $('._downloadTable').on('click', function() {
    if ($(this).hasClass('_actives')) {
      _href()
    } else {
      _href(true)
    }
  })

  function _href(_bol) {
    var reportID = '?reportID=' + storage.reportID

    if (_bol) {
      var _host = 'http://122.224.94.108:8003/zjym/download/searchExportExcel'
      var queryCondition = '&queryCondition=' + _sql.getSql()
      var summaryCondition = '&summaryCondition=null'
      var fields = '&fields=' + storage.fields.join(',')
      if (storage.summaryCondition !== null) {
        summaryCondition = '&summaryCondition=' + storage.summaryCondition
      }
      var goHost = _host + reportID + fields + queryCondition + summaryCondition

    } else {
      var _host = 'http://122.224.94.108:8003/zjym/download/exportExcel'
      var categoriesID = '&categoriesID=' + storage.categoriesID
      var goHost = _host + reportID + categoriesID
    }

    window.location.href = goHost
  }

  $('._statistics').on('click', function() {

  })

  $('._j_translate').on('click', function() {
    $(this)._translate_($(this).parents('._a_translate'))
  })

  $('.userDropOut').on('click', function() {
    L.setItem('___surveyCode', '')
    L.setItem('____id', '')
    L.setItem('___surveyLevel', '')
    L.setItem('___userID', '')
    L.setItem('___userName', '')
    var _local = window.location.href

    var infor = _local.replace(/(.*[themeMap_3||com||\w])\/.*/, '$1')
    window.location.href = infor + '/index.html'
  })
  $('.al-popup-prompt, .al-closer-b').on('click', function() {
    $('.al-popup-prompt').hide()
  })

  $('.statistics-filed .addrule').on('click', function() {
    $('.statistics-filed').append($('.addStatistics-filed.al-row').eq(0).clone(true))
  })

  if (L.getItem('___surveyCode') == '') {
    if (!(L.host() == 'LocalStorage.html' || L.host() == '' || L.host() == 'index.html' || L.localhost().includes('index.html'))) {
      var _local = window.location.href
      var infor = _local.replace(/(.*[themeMap_3||com||\w])\/.*/, '$1')
      window.location.href = infor + '/index.html'
    }
  }

  if (L.host() == 'Task_Assignment-F.html' || L.host() == 'Task_Assignment-S.html' || L.host() == 'Data_Manage.html') {
    /***-----Selecte -----****/
    $('.searchbar-Emptied').on('click', function() {
      common.mapHelper.removeMarker()
      $('.searchbar').val('')
      $('.filedCondition').hide()
      L.setItem('___selecte', '')
      console.log('___selecte')
    })
    $('.selectSearchbar').on('click', function() {
      if ($('.searchbar').val().trim() == '') return
      sendRequest.IndiatorSearch($('.searchbar').val())
      $('.filedCondition').show()
    })

    $('.searchbar').on('keydown', function(e) {
      if (e.keyCode == 13) {
        if ($('.searchbar').val().trim() == '') return
        sendRequest.IndiatorSearch($('.searchbar').val())
        $('.filedCondition').show()
      }
      if (e.keyCode == 8) {
        if ($('.searchbar').val().length <= 1) {
          common.mapHelper.removeMarker()
            //   sendRequest.GetIndicators()
        }
      }
    })

    $('body').on('click', '._valName', function() {
        var arr = []
        $('.searchbar').val($(this).html())
        arr.push($(this).data('centerx'))
        arr.push($(this).data('centery'))
        common.mapHelper.addMarker(arr)
        common.mapHelper.__setView(arr, $(this).data('minscale'))
        common.map.panTo(arr);
        $('.filedCondition').hide()
          // console.log('_INFORMATION' in window)
          // if ('_INFORMATION' in window) {
          //   window._INFORMATION._info = $(this).data('code')
          // }
      })
      /***----End---****/
  }

  // 存储用户code --->>> ___surveyCode
  // 存储用户id --->>> ___userID

  $('.map1').on('click', function() {
    $('.map1').addClass('active')
    $('.map2').removeClass('active')
    $('.map1 img').attr('src', 'images/chart/mapmode1active.png')
    $('.map2 img').attr('src', 'images/chart/mapmode2.png')
    $('#top-sidebar, #left-sidebar, #right-sidebar, .popupMenuInformation, .formData , #controlPanel').removeClass('dark'),
      $('#top-sidebar .logo span, .single-text').css('color', '#333');
    $('.logo img, .formData img').attr('src', 'images/chart/logo@2x.png')
    $('.tableTab').attr('src', 'images/chart/index_table_light.png')
    $('.swTable').attr('src', 'images/chart/sw-light.png')
    $('.zhTable').attr('src', 'images/chart/zh-light.png')
    $('.showFieldData img').attr('src', 'images/chart/sw-light.png')
    $('#slide-pop, .filedCondition, #map-control, #GetAssignTask, #GetInvestigator, #task-table,.si-pages, .exhibition, ._a_translate').removeClass('dakr')
    common.mapHelper.vec()
  })

  $('.map2').on('click', function() {
    $('.map1').removeClass('active')
    $('.map2').addClass('active')
    $('#top-sidebar .logo span, .single-text').css('color', '#fff');
    $('.map1 img').attr('src', 'images/chart/mapmode1.png')
    $('.map2 img').attr('src', 'images/chart/mapmode2active.png')
    $('#top-sidebar,#left-sidebar, #right-sidebar, .popupMenuInformation, .formData, #controlPanel').addClass('dark'),
      $('.logo img, .formData img').attr('src', 'images/chart/logodark@2x.png')
    $('.tableTab').attr('src', 'images/chart/index_table_dark.png')
    $('.swTable').attr('src', 'images/chart/sw-dark.png')
    $('.zhTable').attr('src', 'images/chart/zh-dark.png')
    $('.showFieldData img').attr('src', 'images/chart/sw-dark.png')
    $('#slide-pop, .filedCondition, #map-control,#GetAssignTask, #GetInvestigator, #task-table,.si-pages, .exhibition, ._a_translate').addClass('dakr')
    common.mapHelper.img()

  })

  $('.clearmap').on('click', function() {
    require(["common"], function(common) {
      common.mapHelper.removeAllTileLayers();
    });

    $('.basemap').find('img').attr('src', 'images/chart/icon_layer@2xashen.png')
  })

  $('.distance').on('click', function() {
    common.mapHelper.Measure({ 'color': 'red' })
  })

  $('.area').on('click', function() {
    common.mapHelper.areaMeasure({ 'color': 'red' })
  })

  $('.zoomout').on('click', function() {
    common.mapHelper.enlarge()
  })

  $('.zoomin').on('click', function() {
    common.mapHelper.narrow()
  })

  $('.layer').on('click', function() {
    $('.CatalogPopup').toggleClass('open')
  })


  $('body').on('click', '._option', function(e) {
    e.stopPropagation()
    if ($(this).hasClass('open')) {
      $(this).removeClass('open')
      $(this).parents('.catalogParse').nextAll().hide()
    } else {
      $(this).addClass('open')
      if (!$(this).hasClass('saveData')) {
        _send.GetDataByCatalogID($(this).data('id'), $(this))
        $(this).addClass('saveData')
      } else {
        $(this).parents('.catalogParse').nextAll().show()
      }
    }
  })

  $('body').on('click', '.basemap', function() {
    var _id = $(this).data('id')
    if ($(this).hasClass('actives')) {
      $(this).removeClass('actives')
      $(this).find('._popMove').hide()
      $(this).find('img').attr('src', 'images/chart/icon_layer@2xashen.png')
      common.mapHelper.removeTileLayerById(_id)
    } else {
      $(this).find('img').attr('src', 'images/chart/icon_layer@2x.png')
      var _z = 100 + _id
      var newData = $(this).data('tp').replace(/\//g, '\\\\')
      $(this).addClass('actives')
      $(this).find('._popMove').show()
      common.mapHelper.addTileLayer({
        id: _id,
        serviceUrl: storage.mapURL,
        tilePath: newData,
        center: storage.mapCenter,
        zoom: storage.mapMinScale,
        zindex: _z
      })
    }
  })



  var _send = {

    GetMapInfo: function() {
      _API._G('DataShow.asmx/GetMapInfo', {
        userID: L.getItem('___userID')
      }, function(data) {
        storage.mapURL = data.mapInfo.tileService
        storage.mapCenter = data.mapInfo.center
        storage.mapMinScale = data.mapInfo.minScale
        _send.GetCatalog()
        setTimeout(function() {
          common.mapHelper.addTileLayer({
            id: data.mapInfo.id,
            serviceUrl: storage.mapURL,
            tilePath: data.mapInfo.tilePath,
            center: storage.mapCenter,
            zoom: storage.mapMinScale,
            zindex: 101
          })
        }, 2000)
      })
    },

    GetCatalog: function() {
      _API._G('DataShow.asmx/GetCatalog', {}, function(translateData) {
        storage.menuList = translateData
        draw.menuListParent()
      })
    },

    GetDataByCatalogID: function(_id, _t) {
      _API._G('DataShow.asmx/GetDataByCatalogID', {
        catalogID: _id
      }, function(translateData) {
        var _ct = '<div class="_childParents">'
        storage.menuListTrdata = translateData
        storage.menuListTrdata.datas.forEach(function(_val) {
          var _span = ''
          if (_val.type == 1) {
            _span = '<span class="clickChoice" data-tn="' + _val.tableName + '"  ><img src="images/chart/icon_mapnotchoice@2x.png" alt=""></span>'
          } else {
            _span = ''
          }
          _ct +=
            '<ul class="_translateTarget">' +
            '   <li class="js_ontp js_ontp_child" data-tn="' + _val.tableName + '" data-tp="' + _val.tilePath + '">' + _val.name +
            '     <div class="right-options"> ' + _span +
            '       <button class="indexTranslate _j_translateDowm"> ' +
            '         <img src="images/chart/icon_arrowsDown.png">' +
            '       </button>' +
            '       <button class="indexTranslate _j_tranlateTop"> ' +
            '         <img src="images/chart/icon_arrowsUp.png">' +
            '       </button>' +
            '       <span class="basemap" data-id ="' + _val.id + '" data-tp="' + _val.tilePath + '">' +
            '          <img src="images/chart/icon_layer@2xashen.png" alt="">' +
            '       </span> ' +
            '   </li>' +
            '</ul>'
        })
        _ct += '</div>'
        _t.parents('li').append(_ct)

        if (storage.sectionInit) {
          // 默认添加地图底图列表第一横切片数据
          var _on = $('._translateTarget .js_ontp_child').first().find('.basemap')
          _id = _on.data('id')
          _on.find('img').attr('src', 'images/chart/icon_layer@2x.png')
          var _z = 100 + _id
          var newData = _on.data('tp').replace(/\//g, '\\\\')
          _on.addClass('actives')
          _on.find('._popMove').show()
          setTimeout(function() {
            common.mapHelper.addTileLayer({
              id: _id,
              serviceUrl: storage.mapURL,
              tilePath: newData,
              center: storage.mapCenter,
              zoom: storage.mapMinScale,
              zindex: _z
            })
          }, 2000)
          storage.sectionInit = false
        }
      })

    }
  }

  var draw = {
    menuListParent: function() {
      storage.menuList.catalog.forEach(function(_val) {
        var _ct =
          '<li class="js_ontp">' +
          '   <div class="catalogParse" >' + _val.name +
          '       <div class="right-options">' +
          // '         <span><img src="images/chart/icon_bigmapsort@2x.png" alt=""></span>'+
          '         <span class="_option" data-id=" ' + _val.id + '">' +
          '           <img src="images/chart/icon_bigmapfold@2x.png" alt="">' +
          '         </span>' +
          '       </div>' +
          '   </div>' +
          '</li>'

        $('#CatalogPopup-ul').append(_ct)
      })
      if (storage.sectionInit) {
        // 初始化， 加载地图列表与第一列数据
        var _f = $('.js_ontp').first().find('._option')
        _f.addClass('open')
        _f.addClass('saveData')
        _send.GetDataByCatalogID(_f.data('id'), _f)
      }
    }
  }


  if (L.host() == 'Data_Manage.html' || L.host() == 'Data_Display.html' || L.host() == 'Task_Assignment-F.html' || L.host() == 'Task_Assignment-S.html') {
    _send.GetMapInfo()
  }

  function callbackSt(target, val) {
    storage[target] = val
  }
  var retunrObj = {
    _Ls: L.setItem,
    _Lg: L.getItem,
    _Lh: L.host(),
    _Lhs: L.localhost(),
    _sql: _sql,
    _getTabel: sendRequest.GetTableField,
    _categoriesID: callbackSt
  }
  return _L = retunrObj
})