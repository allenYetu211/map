define("mapIntroduce", ['map', "jquery", "userservice", "chartInformations", "sqlBuilder", "queryBuilder", 'local', 'api'], function(m, j, us, ch, sq, qb, l, _API) {

  console.log(l)
  if (l._Lh !== 'Data_Display.html') {
    return
  }
  // var sqlBuilder;

  // function loadBuilter() {
  //     var filters = [{
  //         id: '0'
  //     }];
  //     sqlBuilder = new SqlBuilder('sql-builder')
  //     sqlBuilder.init(filters)
  // };



  /**
   * 左右图标详情信息 Dom 操作 
   **/
  $('body').on('click', 'button.introduceButton', function(e) {
    e.stopPropagation()
    $('#left-sidebar, #right-sidebar').addClass('closed')
    storage.de_indiatorID = $(this).data('id')
    $('.reportShow').hide()
    sendRequest.GetShowDetails()
      // sendRequest.GetThemeAnalysis()
  })

  $('body').on('click', '._theme', function() {
    if ($(this).hasClass('active')) return
    $('.intro-r, .intro-l').html('')
    $('._theme, ._reportShow ').removeClass('active')
    $(this).addClass('active')
    storage.theme_indiatorID = $(this).data('id')
    sendRequest.GetThemeAnalysis()
  })

  // var array = []
  $('body').on('click', '.reportID', function() {
    // loadBuilter()
    l._sql.loadBuilter()
  })

  $('._tbmLaber').on('click', function() {
    $('.cp-pointer').removeClass('open')
    $('.cp-pointer').eq($(this).data('onin')).addClass('open')
    if (storage._initiframt) {
      $('#sheetFile')[0].contentWindow.ins_displaySheet(false,  false, false)
      storage._initiframt = false
    }
    if ($(this).hasClass('reportID')) {
      storage.reportID = $(this).data('id')
      l._sql.getReportID($(this).data('id'))
      if (!storage.reportidArr.includes($(this).data('id'))) {
        storage.reportidArr.push($(this).data('id'))
        $('#sql-builder').addClass('ADDoptions')
        l._getTabel()
      }
      //  if (!$('#sql-builder').hasClass('ADDoptions')) {
      //   $('#sql-builder').addClass('ADDoptions')
      //   l._getTabel()
      //   }
    }
  })

  /**
   * 保留
   */
  // $('body').on('click', '._reportShow', function() {
  // $('._theme, ._reportShow ').removeClass('active')
  // $(this).addClass('active')
  //     storage.reportID = $(this).data('inid')
  //     sendRequest.GetReportShow()
  // })
  $('body').on('click', '._reportShow-p p', function(e) {
    e.stopPropagation()
    var _into = $(this).data('inid')
    $('._theme, ._reportShow , ._reportShow-p p').removeClass('active')
    $(this).addClass('active')
    if (_into == '-1') {
      return
    }
    if (storage._surveyCode_ !== null) {
      var s_code = storage._surveyCode_
    } else {
      var s_code = l._Lg('___surveyCode')
    }

    $('#sheetFile')[0].contentWindow.ins_sheetPanel(_into, '15')
    setTimeout(function() {
      $('#sheetFile')[0].contentWindow.ins_loadvalue(_into, ch.tl.termID, s_code)
    }, 2000)

  })

  $('body').on('click', '._reportShow', function(e) {
    var _into = $(this).data('inid')
    $('._theme, ._reportShow ').removeClass('active')
    $(this).addClass('active')
    $('._theme, ._reportShow , ._reportShow-p p').removeClass('active')
    $(this).addClass('active')
    if (_into == '-1') {
      return
    }



    if (storage._surveyCode_ !== null) {
      var s_code = storage._surveyCode_
    } else {
      var s_code = l._Lg('___surveyCode')
    }

    $('#sheetFile')[0].contentWindow.ins_sheetPanel(_into, '15')
    $('#sheetFile')[0].contentWindow.ins_loadvalue(_into, ch.tl.termID, l._Lg('___surveyCode'))
  })


  $('.cp-oninter').on('click', function() {
    $('.cp-pointer').removeClass('open')
    $('.cp-pointer').eq($(this).data('onin')).addClass('open')
      //reportID 存储位置
    if ($(this).hasClass('reportID')) {
      storage.reportID = $(this).data('id')
    }
  })


  $('._close').on('click', function() {
    $('.intro-l, .intro-r').html('')
    $('.cp-oninter').find('ul , li').remove()
    $('#controlPanel').hide()
    $('#left-sidebar, #right-sidebar').removeClass('closed')
  })

  $('.dataInquire').on('click', function() {
    $('.showFieldData').show()
  })

  $('.conditionrReset').on('click', function() {
    $('.showFieldData').hide()
    $('.selcetInfo').html('')
    $('._filed').html('')

  })

  $('.filedCondition div').on('click', function() {
    $('.filedCondition div').removeClass('active')
    $(this).addClass('active')
  })


  $('body').on('click', '.base1', function() {
    $('.__infors').hide();
    $('.zh-dark').show();
  })

  $('body').on('click', '.base2', function() {
    $('.__infors').hide();
    $('.sw-dark').show();

  })

  $('.confirmInformation button').on('click', function() {
    storage.fieldInfoData = []
    storage.fields = []
    storage._requertCount = 0
    $('.selcetInfo').find('div').each(function(_in) {
      sendRequest.GetFieldInfo($(this).data('index'), _in)
    })
  })


  /**
   * 仓库
   **/

  var storage = {
    chartData: '',
    de_indiatorID: '',
    introduceDATA: '',
    theme_indiatorID: '',
    reportID: '',
    tableField: '',
    egfield: '',
    fieldInfoData: [],
    fields: [],
    serchResultData: '',
    _requertCount: 0,
    arrayposts: [],
    _initiframt: true,
    reportidArr: [],
    _surveyCode_: null
  }


  /**
   *  请求
   **/

  var sendRequest = {
    GetShowDetails: function() {
      _API._G('DataShow.asmx/GetShowDetails', {
        indiatorID: storage.de_indiatorID
      }, function(data) {
        // console.log('GetShowDetails', data)
          // if (data.showDetails.length === 0) {
          //   $('._tbmLaber[data-onin=1]').css({'pointer-events': 'none', 'background': '#aeb7bb'})
          //   return
          // }
          // $('._tbmLaber[data-onin=1]').removeAttr('style')
        storage.introduceDATA = data.showDetails
        $('#controlPanel').show()
        embellish.introduce()
      })
    },

    GetThemeAnalysis: function() {
      if (storage.introduceDATA.themeAnalysis.length == 0 ) {
          $('._themeAnalyse .cp-dataInfor').addClass('open')
          $('.intro-l, .intro-r').html('')
          $('.themeAnalysis').hide()
          return
        }
      _API._G('DataShow.asmx/GetThemeAnalysis', {
        themeID: storage.theme_indiatorID || 0,
        surveyCode: ch.cl.surveyCode,
        isNextLevel: '0'
      }, function(data) {
        // if (storage.introduceDATA.themeAnalysis.length == 0 ) {
        //   $('.themeAnalysis').hide()
        // }
        $('.themeAnalysis').show()
        if (data.indiator.length === 0) {
          // $('._tbmLaber[data-onin=0]').css({'pointer-events': 'none', 'background': '#aeb7bb'})
          $('._themeAnalyse .cp-dataInfor').addClass('open')
          $('.intro-l, .intro-r').html('')
          return
        }
        $('._themeAnalyse .cp-dataInfor').removeClass('open')
          // $('._tbmLaber[data-onin=0]').removeAttr('style')
        storage.chartData = data.indiator
        embellish.informations()
      })
    },

    GetReportShow: function() {
      _API._G('DataShow.asmx/GetReportShow', {
        reportID: storage.reportID,
        termID: ch.tl.termID,
        surveyCode: ch.cl.surveyCode
      })
    },


  }


  /**
   *  渲染详情介绍页面数据
   * **/

  var embellish = {

    introduce: function() {

      var themeAnalysis = ''
        // console.log('storage.introduceDATA:', storage.introduceDATA)
      for (var key in storage.introduceDATA) {

        if (typeof storage.introduceDATA[key] === 'object' && key !== 'reportShow') {
          storage.introduceDATA[key].forEach(function(_val, _index) {
            if (_index == 0) {
              themeAnalysis = '<li class="_theme active"  data-id=" ' + _val.id + '">' + _val.name + '</li>'
              storage.theme_indiatorID = _val.id
            } else {
              themeAnalysis = '<li class="_theme"  data-id=" ' + _val.id + '">' + _val.name + '</li>'
            }
            $('.' + key).append(themeAnalysis)

          })
        } else if (typeof storage.introduceDATA[key] === 'object' && key === 'reportShow') {
          // var flag = true
          storage.introduceDATA[key].forEach(function(_val) {
            if (_val.pid === -1) {
              themeAnalysis = '<li class="_reportShow-p base' + _val.id + '"><p  data-inid= "' + _val.reportID + '">' + _val.name + '</p></li>'
              $('.' + key).append(themeAnalysis)
            }
          })
          storage.introduceDATA[key].forEach(function(_val) {

            if ($('.base' + _val.pid)) {

              if ($('.base' + _val.pid).find('ul').length <= 0) {
                $('.base' + _val.pid).append('<ul></ul>')
              }

              $('.base' + _val.pid).find('ul').append('<li class="_reportShow base' + _val.id + '"  data-inid= "' + _val.reportID + '">' + _val.name + '</li>')
            }
          })
        } else {
          $('.' + key).attr('data-id', storage.introduceDATA[key])
        }

      }
      $('.themeAnalysis').addClass('open')
      $('.cp-pointer').removeClass('open')
      $('._themeAnalyse').addClass('open')
      sendRequest.GetThemeAnalysis()
    },

    // 处理数据，生成详情页对应信息

    informations: function() {
      $('.intro-l,.intro-r ').html('')
      storage.chartData.forEach(function(_val) {
        var sizeType = ''
        var location = ''
          /**
           * 遍历判断绘制于左右面板， 绘制图形大小
           * */
        if (_val.indiatorInfo.location == 'left') {
          location = '.intro-l'
        } else {
          location = '.intro-r'
        }

        if (_val.indiatorInfo.size_type === 0) {
          sizeType = 'type-big'
        } else if (_val.indiatorInfo.size_type === 1) {
          sizeType = 'type-middle'
        } else if (_val.indiatorInfo.size_type === 2) {
          sizeType = 'type-small'
        }

        var is_map = _val.indiatorInfo.is_map === 1 ? '_isMap' : 'hide'
        $(location).append("<div class='information " + sizeType + "-parent'><div data-index= " + _val.indiatorInfo.id + " class='mouseMove " + sizeType + " introdraw_" + _val.indiatorInfo.id + " '></div></div>");

        switch (_val.indiatorInfo.type) {
          case 'Text':
            draw.text(_val, ".draw_" + _val.indiatorInfo.id)
            break;

          case 'Table':
            draw.table(_val.indiatorData, ".introdraw_" + _val.indiatorInfo.id, _val.indiatorInfo.name)
            break;

          case 'SingleText':
            draw.singleText(_val.indiatorData, ".introdraw_" + _val.indiatorInfo.id, _val.indiatorInfo.name, _val.indiatorInfo.size_type)
            break;

          default:
            if (typeof ch.dr._default(_val.indiatorInfo.type) === 'function') {
              var __default__ = ch.dr._default(_val.indiatorInfo.type)
              if (_val.indiatorInfo.type === 'Pie_MultiLevelPie') {}
              var _tsDefault = __default__(_val.indiatorData, _val.indiatorInfo.name, _val.indiatorInfo.size_type)
              ch.dr.echart(_tsDefault, ".introdraw_" + _val.indiatorInfo.id)
            }

            break;
        }
      })
    }
  }

  var draw = {
    singleText: function(_data, _pClass, _name, _type) {
      var ct = '<div>'
      _data.forEach(function(_val) {
        ct += '<h4 class="table-titles">' + _val.caption + '</h4>'
        ct += '<p class="single-text">' + _val.value + ' <span>' + _val.unit + '</span></p>'
      })
      ct += '</div>'
      $(_pClass).css({ 'min-height': '80px', 'display': 'flex' })

      $(_pClass).html('').append(ct)
    },
    table: function(_data, _pClass, name) {
      var ct = '<h4 class="table-titles">' + name + '</h4><table  align="center"><tr class="_column">'

      _data.column.forEach(function(_val) {
        ct += '<th>' + _val + '</th>'
      })
      ct += '</tr> '

      _data.data.forEach(function(_vals) {
        ct += '<tr>'
        _vals.forEach(function(_vs) {

          ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
        })

        ct += '</tr>'
      })

      ct += '</table>'
      $(_pClass).append(ct)
    }
  }

  function _surveyCode_(val) {
    storage._surveyCode_ = val
    console.log('storage._surveyCode_:', storage._surveyCode_)
  }

  return {
    _s: storage,
    _setCode: _surveyCode_
  }
})