define('local', ['jquery', 'translatePopup', 'api'], function(jq, tl, _API) {

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
      var infor = _local.replace(/.*[themeMap_3||com]\/(.*)/, '$1')
      return infor
    }
  }


  var _sql = {
    sqlBuilder: '',
    loadBuilter: function() {
      var filters = [{
        id: '0'
      }];
      this.sqlBuilder = new SqlBuilder('sql-builder')
      this.sqlBuilder.init(filters)
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
    _requertCount: 0
  }

  var sendRequest = {
    GetTableField: function() {
      _API._G('DataShow.asmx/GetTableField', {
        reportID: storage.reportID
      }, function(data) {
        storage.tableField = data.tableField
        embellish.fieldList()
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
            console.log('_val', _val)
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
          // if ($('.select_cf').length == storage._requertCount) {
        if (typeof self.sqlBuilder !== 'function') {
          self.sqlBuilder = new SqlBuilder('sql-builder')
          self.sqlBuilder.init(storage.fieldInfoData)
        }
        self.sqlBuilder.setFilters(storage.fieldInfoData)
          // }

      })
    },

    GetSearchResult: function(sql) {
      _API._G('DataShow.asmx/GetSearchResult', {
        reportID: storage.reportID,
        fields: storage.fields.join(','),
        queryCondition: sql,
        summaryCondition: '',
        start: 0,
        limit: 20
      }, function(data) {
        $('.FieldDataloading').hide()
        storage.serchResultData = data.searchResult
        embellish.showFieldData()
          // $('.showFieldData').html('')
      })
    }
  }

  var embellish = {
    fieldList: function() {
      var ct = ''
      storage.tableField.forEach(function(_val, _in) {
        ct += '<li data-index = ' + _in + '  class="field-itmes" > ' + _val.chField + '</li>'
      })
      $('.tableField ul').html('').append(ct)
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
      // var sql = sqlBuilder.getSql()
    var sql = _sql.getSql()
    sendRequest.GetSearchResult(sql)
  })

  $('._reset').on('click', function() {
    // var sql = sqlBuilder.reset()
    var sql = _sql.reset()
    storage.arrayposts = []
    $('.selcetInfo').html('')
    $('.showFieldDataTab').html('')
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

  if (L.getItem('___surveyCode') == '') {
    if (!(L.host() == '' || L.host() == 'index.html')) {
      var _local = window.location.href
      var infor = _local.replace(/(.*[themeMap_3||com||\w])\/.*/, '$1')
      window.location.href = infor + '/index.html'
    }
  }

  return _L = {
    _Ls: L.setItem,
    _Lg: L.getItem,
    _Lh: L.host(),
    _sql: _sql
  }
})