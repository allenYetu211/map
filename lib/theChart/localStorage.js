define('local', ['jquery', 'translatePopup', 'api', 'common'], function(jq, tl, _API, common) {

  // 存储用户code --->>> ___surveyCode
  // 存储用户id --->>> ___userID




  var L = {
    setItem: function(name, data) {
      window.localStorage.setItem(name, data)
    },

    getItem: function(name) {
      return window.localStorage.getItem(name)
    },

    host: function() {
      var _local = window.location.href
      var infor = _local.replace(/.*[themeMap_3||com||\/]\/(.*)/, '$1')
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
    SQL: ''
  }

  var sendRequest = {
    GetTableField: function() {
      _API._G('DataShow.asmx/GetTableField', {
        reportID: storage.reportID
      }, function(data) {
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

    GetFieldInfo: function(_vs, _in) {
      var self = this
      _API._G('DataShow.asmx/GetFieldInfo', {
        egFields: _vs.join(',')
      }, function(data) {
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
        if (typeof _sql.sqlBuilder !== 'object') {
          _sql.sqlBuilder = new SqlBuilder('sql-builder')
          _sql.sqlBuilder.init(storage.fieldInfoData)
        } else {
          _sql.sqlBuilder.setFilters(storage.fieldInfoData)
        }
      })
    },

    GetSearchResult: function() {
      obj = ''
      if (storage.OBJ !== '') {
        obj = storage.OBJ
      }
      _API._G('DataShow.asmx/GetSearchResult', {
        reportID: storage.reportID,
        fields: storage.fields.join(','),
        queryCondition: storage.SQL,
        summaryCondition: obj,
        start: (storage._pageShowCount - 1) * storage._persentCount,
        limit: storage._pageShowCount * storage._persentCount,
      }, function(data) {
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

    searchlist: function() {
      $('.filedCondition').html('')
      storage.searchlist.result.forEach(function(_val) {

        var ct = ''

        for (var key in _val) {
          ct = '<div>按&nbsp;<span> ' + key + ' </span>&nbsp;搜索'
          _val[key].forEach(function(_val_) {
            ct += '<p class="_valName"data-level="' + _val_.level + '" data-maxScale="' + _val_.maxScale + '" data-minScale="' + _val_.minScale + '" data-centerX="' + _val_.center[0] + '" data-centerY="' + _val_.center[1] + '" data-code="' + _val_.code + '" data-serarchID="' + _val_.searchID + '"> ' + _val_.name + '</p>'
          })
          ct += '</div>'

        }

        $('.filedCondition').append(ct)

      })
    },
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

  $('.addFiled button').on('click', function() {
    sendRequest.GetTableField()
    $('.tableField').show()
  })

  $('._tableFieldclose span').on('click', function() {
    $('.tableField').hide()
  })

  $('._j_stcloser').on('click', function() {
    $('.statisticsPane').hide()
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
    sendRequest.GetSearchResult()
      // $('.si_page')
  })
  $('._statistics').on('click', function() {
    $('.statisticsPane').show()
  })

  $('._reset').on('click', function() {
    // var sql = sqlBuilder.reset()
    var sql = _sql.reset()
    storage.arrayposts = []
    $('.selcetInfo').html('')
    $('.showFieldDataTab').html('')
  })

  $('._downloadTable').on('click', function() {
    var _host = 'http://122.224.94.108:8003/zjym/download/searchExportExcel'

    var reportID = '?reportID=' + storage.reportID

    var fields = '&fields=' + storage.fields.join(',')

    var queryCondition = '&queryCondition=' + _sql.getSql()

    var summaryCondition = '&summaryCondition=null'

    if (storage.summaryCondition !== null) {
      summaryCondition = '&summaryCondition=' + storage.summaryCondition
    }

    var goHost = _host + reportID + fields + queryCondition + summaryCondition

    window.location.href = goHost
  })

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
    if (!(L.host() == '' || L.host() == 'index.html' || L.localhost().includes('index.html'))) {
      var _local = window.location.href
      var infor = _local.replace(/(.*[themeMap_3||com||\w])\/.*/, '$1')
      window.location.href = infor + '/index.html'
    }
  }

  if (L.host() == 'Task_Assignment-F.html' || L.host() == 'Task_Assignment-S.html') {
    /***-----Selecte -----****/
    $('.searchbar-Emptied').on('click', function() {
      common.mapHelper.removeMarker()
      $('.searchbar').val('')
      $('.filedCondition').hide()
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
        arr.push($(this).data('centerx'))
        arr.push($(this).data('centery'))
        common.mapHelper.addMarker(arr)
        common.mapHelper.__setView(arr, $(this).data('minscale'))
        common.map.panTo(arr);
        $('.filedCondition').hide()
      })
      /***----End---****/
  }

  return _L = {
    _Ls: L.setItem,
    _Lg: L.getItem,
    _Lh: L.host(),
    _Lhs: L.localhost(),
    _sql: _sql,
    _getTabel: sendRequest.GetTableField
  }
})