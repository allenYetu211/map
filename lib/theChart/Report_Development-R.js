define('dataLaySth', ['jquery', 'local', 'api'], function(jq, l, _API) {
  if (l._Lh !== 'Report_Development-R.html') {
    return
  }

  /**
   * Dom
   */
  $('body').on('click', '._j_toggleNextUl', function() {
    $(this).next().slideDown().addClass('_c_open').end().parent().siblings().find('ul').removeClass('_c_open').slideUp()
  })

  $('body').on('click', '._j_getInfo', function() {
    $('._j_getInfo').removeClass('active')
    $(this).addClass('active')
    storage.reportID = $(this).data('reportid')
    sendRequst.GetReportInfo()
    sendRequst.GetFieldByReport()
    $('#viewinfo-sheetFile')[0].contentWindow.ins_sheetPanel($(this).data('reportid'), '15')
  })

  $('body').on('click', '._j_dropDown', function() {
    $(this).next().slideToggle()
  })

  $('body').on('click', '._j_selected', function() {
    $('._j_selected').removeClass('_selected')
    $('._liSelect').hide()
    $(this).parents('._popupSelect').find('label').data('info', $(this).data('info'))
    $(this).addClass('_selected').parents('._popupSelect').find('input').val($(this).html())
  })


  $('body').on('blur', '._bulrInfo', function() {
    $(this).prev().data('info', $(this).val())
  })

  $('body').on('click', '._j_selectLab label', function() {
    var parentsType = $(this).parents('._popupSelect').data('reoptype')
    var count = $(this).data('info').toString()
    if (storage[parentsType].includes(count)) {
      var _count = storage[parentsType].indexOf(count)
      storage[parentsType].splice(_count, 1)
    } else {
      storage[parentsType].push(count)
    }
    if (!$(this).prev().prop('checked')) {
      if (storage.checkboxSelect[parentsType].includes($(this).html())) {
        return
      } else {
        storage.checkboxSelect[parentsType].push($(this).html())
      }
    } else {
      var _index = storage.checkboxSelect[parentsType].indexOf($(this).html())
      storage.checkboxSelect[parentsType].splice(_index, 1)
    }

    // console.log(storage[parentsType])
    var ct = storage.checkboxSelect[parentsType].join(',')
    $(this).parents('._popupSelect').find('._infoData').data('index')
    $(this).parents('._popupSelect').find('input').val(ct)
  })

  $('.fillInSelection').on('click', '.input[type=checkbox]', function() {
    console.log($(this))
  })



  /**
   *  新增， 修改， 删除 , 关闭, 提交
   * */

  $('.confirm').on('click', function() {
    $('._popupSelect').each(function() {
      if ($(this).data('reoptype') == 'FK_TERM' || $(this).data('reoptype') == 'FK_CATEGORY') {
        storage._ob[$(this).data('reoptype')] = storage[$(this).data('reoptype')]
      } else if ($(this).data('reoptype') == 'F_DOCUMENT_NAME') {
        var ary = $('#fileData').val().split('\\')
        storage._ob[$(this).data('reoptype')] = ary[ary.length - 1]
      } else {
        if ($(this).find('label').data('info') != '') {
          storage._ob[$(this).data('reoptype')] = $(this).find('label').data('info')
        } else {
          storage._ob[$(this).data('reoptype')] = $(this).find('input').val()
        }
      }
    })

    if (storage.reportType == 0) {
      storage._ob['F_REPORTID'] = '-1'
    } else {
      storage._ob['F_REPORTID'] = storage.reportID
    }
    if ($('#fileData').val() !== '') {
      sendRequst.sendFrom()
    } else {
      sendRequst.ReportOp()
    }
  })

  $('.popup_close, ._PopBcloser').on('click', function() {
    storage.addTable = false
    $(this).parents('._j_popup').hide()
  })


  $('._Addlaysth').on('click', function() {
    $('.popupAddChange .popupTitle-h2').html('添加报表')
    $('.popupAddChange').show()
    sendRequst.GetReportInfo('-1')
    storage.reportType = 0
    storage.fillIn_Type = 0
  })

  $('._Changelaysth').on('click', function() {
    $('.popupAddChange .popupTitle-h2').html('修改报表')
    $('.popupAddChange').show()
    sendRequst.GetReportInfo()
    storage.reportType = 1
    storage.fillIn_Type = 1
  })

  $('._Deletelaysth').on('click', function() {
    storage.reportType = 2
    storage._ob = {}
    storage._ob['F_REPORTID'] = storage.reportID
    sendRequst.ReportOp()
  })

  $('._OpenActive').on('click', function() {

    storage.mouseUp = !storage.mouseUp
    if (storage.mouseUp) {
      $(this).find('img').attr('src', 'images/chart/icon_switch_off@2x.png')
    } else {
      $(this).find('img').attr('src', 'images/chart/icon_switch_on@2x.png')
    }
  })

  $('._fieldOpenC').on('click', function() {
    $('._fieldRqpost').toggleClass('close')
  })

  /**
   *  字段绑定，字段添加 添加 , 修改， 删除， 生成 字段
   */


  $('body').on('focus', '._zdPopupSelect input', function() {
    if ($(this).hasClass('_j_fieldGroup') || $(this).hasClass('_j_report')) {
      $(this).parents('._zdPopupSelect').next().find('input').attr('disabled', 'disabled')
    }
    $(this).next().show()

  })


  $('body').on('click', '.sizeFilter li', function() {
    var _paretnesInfo = $(this).parents('.sizeFilter').prev()
    var _p = $(this).parents('._zdPopupSelect')
    _paretnesInfo.data('selected', $(this).data('flicid'))
    _paretnesInfo.val($(this).html())
    $(this).parents('.sizeFilter').hide()
    if (_paretnesInfo.hasClass('_j_fieldGroup')) {
      $(this).parents('._zdPopupSelect ').next().find('input').val('')
      sendRequst.GetFieldOfGroup($(this).data('flicid'), $(this))
    }

    if (_paretnesInfo.hasClass('_j_report')) {
      $(this).parents('._zdPopupSelect ').next().find('input').val('')
      sendRequst.GetFieldOfReport($(this).data('flicid'), $(this))
    }



    if (_p.hasClass('_j_actives')) {
      if ($(this).html() == '是') {
        _p.nextAll().removeClass('_anmose')
      }else {
        _p.nextAll().addClass('_anmose')
      }
    }
  })

  $('body').on('change', '.PopupAdd-ZD select ', function() {
    $(this).data('selected', $(this).find('option:selected').data('flicid'))
  })

  $('body').on('click', '._j_field', function() {
    $('._j_field').removeClass('active')
    $(this).addClass('active')
    storage._location = $(this).find('td:last').html()
    storage.fieldID = $(this).data('fieldid')
  })

  $('._addTable').on('click', function() {
    storage.fieldOp['F_FIELDID'] = '-1'
    storage.tabalopType = '0'
    sendRequst.GetFieldInfo('-1')
  })

  $('._changeTable').on('click', function() {
    storage.fieldOp['F_FIELDID'] = storage.fieldID
    storage.tabalopType = '1'
    sendRequst.GetFieldInfo()
  })

  $('._deleteTable').on('click', function() {
    storage.fieldOp = {}
    storage.fieldOp['F_FIELDID'] = storage.fieldID
    storage.tabalopType = '2'
    sendRequst.ReportFieldOp()

  })

  $('._createTable').on('click', function() {
    sendRequst.CreateData()
  })

  $('._PopBconfirm').on('click', function() {
    if ($('#location').val().replace(/^\s./g, '') == '') {
      $('#location').css('border', '1px solid red')
      return
    }

    $('._zdPopupSelect').each(function(_val) {
      if ($(this).find('label').data('eg') == 'F_CELL_POSITION') {
        storage.fieldOp[$(this).find('label').data('eg')] = $('#location').val().replace(/^\s./g, '')
      } else {
        storage.fieldOp[$(this).find('label').data('eg')] = $(this).find('input').data('selected')
      }
    })
    sendRequst.ReportFieldOp('0')

  })


  $('body').on('keyup', '._selectInfo', function() {
    var flag = true
    var _ary = []
    var _selectAry = []
    var _txt = $(this).val()
    var _split = _txt.split('')
    var reg = new RegExp(_split.join('.*'))

    var _mb = $(this).parents('._selectMb-parent').find('._selectMb')
    if (_mb[0].nodeName.toLowerCase() == 'li') {
      _mb.hide()
      flag = true
    } else {
      _mb.parents('._j_selectLab').hide()
      flag = false
    }
    _mb.each(function() {
      _ary.push($(this).html())
    })

    _ary.forEach(function(_val, _inx) {
      if (reg.exec(_val)) {
        _selectAry.push(_inx)
      }
    })
    if (flag) {
      _selectAry.forEach(function(_vls, _in) {
        _mb.eq(_vls).show()
      })
    } else {
      _selectAry.forEach(function(_vl, _in) {
        _mb.eq(0).parents('ul').find('._j_selectLab').eq(_vl).show()
      })
    }



  })

  $('body').on('focus', '#location', function() {
    $(this).removeAttr('style')
  })


  $('body').on('change', '._j_actives', function() {
    // console.log($(this).find('option:selected').text())
    if ($(this).find('option:selected').text() == '是') {
      $(this).nextAll().removeClass('_anmose')
    } else {
      $(this).nextAll().addClass('_anmose')
    }
  })


  /**
   *  storage
   */

  var storage = {
    laysthList: '',
    mouseUp: true,
    reportID: '',
    fieldID: '',
    fillIn_Info: '',
    fillIn_Type: 1,
    fillIn_addInfo: '',
    checkboxSelect: {},
    checkCount: {},
    reportType: '', // 报表操作 修改、添加、删除 参数
    FK_REPORT_TYPE: [],
    FK_TERM: [],
    _ob: {},
    fieldInfo: '',
    fieldOp: {},
    addTable: false,
    _location: '',
    initMake: [],
    _changeLocation: ''
  }

  var iframeCmita = {
    _selectedRange: function(location) {
      storage._location = location.minLetter
      if (!storage.addTable && !storage.mouseUp) {
        storage.fieldOp['F_FIELDID'] = '-1'
        storage.tabalopType = '0'
        sendRequst.GetFieldInfo('-1')
      } else {
        $('#location').val(location)
      }
    }
  }

  // function _test() {
  //     console.log('111')
  // }

  /**
   * sendRequst
   */

  var sendRequst = {
    GetReport: function() {
      _API._G('ReportManage.asmx/GetReport', {}, function(data) {
        storage.laysthList = data
        rendering.laysthList()
      })
    },

    GetReportInfo: function(_info) {
      _API._G('ReportManage.asmx/GetReportInfo', {
        reportID: _info || storage.reportID
      }, function(data) {
        if (!data.success) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
        }
        if (storage.fillIn_Type == 1) {
          storage.fillIn_Info = data
        } else {
          storage.fillIn_addInfo = data
        }
        rendering.fillInSelection()
        sendRequst.GetFieldByReport()
      })
    },

    ReportOp: function(_ob) {
      _API._G('ReportManage.asmx/ReportOp', {
        report: JSON.stringify(storage._ob),
        opType: storage.reportType
      }, function(data) {
        if (!data.success) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
        } else {
          var _type = storage._ob['FK_REPORT_TYPE']
          if (storage.reportType == 0) {
            var _val = $('._popupSelect[data-reoptype=F_NAME]').find('input').val()
            $('._j_getInfo').removeClass('active')
            var ct = '<li data-reportid= "' + data.reportID + '"  class="_j_getInfo active">' + _val + '</li>'
            $('#viewinfo-sheetFile')[0].contentWindow.ins_sheetPanel(data.reportID, 15, false)
              // $('._c_open').append(ct)
            $('._j_laysthList>div').eq(_type - 1).find('ul').append(ct)
          } else if (storage.reportType == 1) {
            $('._j_getInfo.active').html(storage._ob['F_NAME'])
            if (!$('._j_getInfo.active').parents('div').index() == _type - 1) {
              $('._j_laysthList>div').eq(_type - 1).find('ul').append($('._j_getInfo.active').html(storage._ob['F_NAME']).clone(true).end().remove())
            }

          } else {
            $('._j_getInfo.active').remove()
          }
          $('.popupAddChange').hide()
        }

      })
    },

    GetFieldByReport: function() {
      _API._G('ReportManage.asmx/GetFieldByReport', {
        reportID: storage.reportID
      }, function(data) {
        storage.filedData = data
        rendering.filedTable()
      })
    },

    sendFrom: function() {
      var files = $('#fileData').prop('files')
      var fromInfor = new FormData()
      fromInfor.append('fileContent', $('#fileData')[0].files[0])
      _API._S('ReportManage.asmx/FileUp', fromInfor, function(data) {
        sendRequst.ReportOp()
      })
    },
    GetFieldInfo: function(_fieldID) {
      _API._G('ReportManage.asmx/GetFieldInfo', {
        fieldID: _fieldID || storage.fieldID,
        reportID: storage.reportID
      }, function(data) {
        console.log('data', data)
        storage.fieldInfo = data
        rendering.fieldInfo()
        storage.addTable = true
        $('.popupAddChangeZD').show()
      })
    },

    GetFieldOfGroup: function(group, _t) {
      _API._G('ReportManage.asmx/GetFieldOfGroup', {
        groupID: group
      }, function(data) {
        console.log(data)
        if (data.field.length <= 0) {
          _t.parents('._zdPopupSelect').next().find('ul').html('')
        } else {
          rendering.addOption(data, _t)
        }
      })
    },

    GetFieldOfReport: function(group, _t) {
      _API._G('ReportManage.asmx/GetFieldOfReport', {
        reportID: group
      }, function(data) {
        rendering.addOption(data, _t)
      })
    },


    ReportFieldOp: function(add) {
      if (storage.fieldOp['F_IS_EXTERNAL'] == 0) {
        storage.fieldOp['FK_REPORT'] = '-1'
        storage.fieldOp['FK_EXTERNAL_FIELD'] = '-1'
      }
      _API._G('ReportManage.asmx/ReportFieldOp', {
        field: JSON.stringify(storage.fieldOp),
        reportID: storage.reportID,
        opType: storage.tabalopType
      }, function(data) {
        if (!data.success) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
          return
        }
        if (storage.tabalopType == 2) {
          $('#viewinfo-sheetFile')[0].contentWindow.ins_deletemake(storage._location)
        } else if (storage.tabalopType == 0) {
          var _info = $('.PopupAdd-ZD').find('label[data-eg=FK_FIELD]').next().val()
          $('#viewinfo-sheetFile')[0].contentWindow.ins_addmake(storage._location, _info)
        } else {
          var _info = $('.PopupAdd-ZD').find('label[data-eg=FK_FIELD]').next().val()
          if (_info !== storage._changeLocation) {
            $('#viewinfo-sheetFile')[0].contentWindow.ins_deletemake(storage._changeLocation)
            $('#viewinfo-sheetFile')[0].contentWindow.ins_addmake(storage._location, _info)
          }
        }

        // if (storage.tabalopType == 0) {
        //     $('#viewinfo-sheetFile')[0].contentWindow.ins_addmake($('#location').val())
        // } else if (storage.tabalopType == 1) {
        //     if (storage._location != $('#location').val()) {
        //         $('#viewinfo-sheetFile')[0].contentWindow.ins_deletemake(storage._location)
        //         $('#viewinfo-sheetFile')[0].contentWindow.ins_addmake($('#location').val())
        //     }
        // }
        $('.popupAddChangeZD').hide()
        storage.addTable = false
        sendRequst.GetFieldByReport()
      })
    },
    CreateData: function() {
      _API._G('ReportManage.asmx/CreateData', {
        reportID: storage.reportID
      }, function(data) {
        if (!data.success) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
          return
        } else {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html('生成表成功')
        }
      })
    }
  }

  sendRequst.GetReport()

  $(window).on('load', function() {
    setTimeout(function() {
      if ($('#viewinfo-sheetFile').length !== 0) {
        $('#viewinfo-sheetFile')[0].contentWindow.ins_displaySheet()
        $('#viewinfo-sheetFile')[0].contentWindow.ins_sheetPanel(storage.reportID, 15, false)
        storage.initMake.forEach(function(_val) {
          $('#viewinfo-sheetFile')[0].contentWindow.ins_addmake(_val.make, _val.name)
        })
      }
    }, 1000)

  })

  /**
   * Rendering  DOM
   */

  var rendering = {
    laysthList: function() {
      var _lay = storage.laysthList.report
      var flag = true
      for (var key in _lay) {
        var ct = '<div><button class="_j_toggleNextUl toggleTarget"> ' + key + '</button><ul class="in_parents">'
        _lay[key].forEach(function(_val, _inx) {

          if (flag) {
            storage.reportID = _val.reportID
            flag = false
          }

          ct += '<li data-reportid= ' + _val.reportID + '  class="_j_getInfo">' + _val.reportName + '</li>'
        })
        ct += '</ul></div>'
        $('._j_laysthList').append(ct)
      }
      $('._j_laysthList > div:first').find('ul').show().addClass('_c_open').find('li:first').addClass('active')
      sendRequst.GetReportInfo()
    },
    //  报表 添加，修改 模板
    fillInSelection: function(_type) {
      $('.fillInSelection').html('')
      var ct = ''
      var _fillinfo = ''
      if (storage.fillIn_Type == 1) {
        _fillinfo = storage.fillIn_Info
      } else {
        _fillinfo = storage.fillIn_addInfo
      }
      console.log(_fillinfo.reportInfo)
      _fillinfo.reportInfo.forEach(function(_val) {
        var _ctInfo = ''
        var infoData = ''
        switch (_val.type) {
          case 'string':
            infoData = _val.value
            _ctInfo += '<input class="_bulrInfo" type="text" value="' + _val.value + '">'
            break

          case 'number':
            infoData = _val.value

            _ctInfo += '<input class="_bulrInfo"  type="number" value="' + _val.value + '">'
            break;

          case 'number_dic':

            _ctInfo += '<input class="_selectInfo" type="text" value="' + _val.value + '"><span class="_j_dropDown _drop"></span><div class="_liSelect"><ul>'
            for (var key in _val.values) {
              if (_val.values[key] == _val.value) {
                infoData = key

                _ctInfo += '<li  class="_j_selected _selected _selectMb" data-info="' + key + '">' + _val.values[key] + '</li>'
                storage['FK_REPORT_TYPE'] = key
              } else {
                _ctInfo += '<li class="_j_selected _selectMb" data-info="' + key + '">' + _val.values[key] + '</li>'
              }
            }
            _ctInfo += '</ul></div>'
            break;

          case 'number_mulDic':
            storage[_val.egField] = []
              // storage.checkboxSelect = 
            _ctInfo += '<input class="_selectInfo" type="text" value="' + _val.value + '"><span class="_j_dropDown _drop"></span><div class="_liSelect"><ul>'
            for (var key in _val.values) {
              if (_val.values[key] == _val.value) {
                infoData = [key]
                _ctInfo += '<li class="_j_selectLab _selected" ><input   id="' + _val.egField + key + '" type="checkbox" checked><label class="_selectMb" data-info="' + key + '" for="' + _val.egField + key + '">' + _val.values[key] + '</label></li>'
                storage[_val.egField].push(key)
                storage.checkboxSelect[_val.egField] = []
                storage.checkboxSelect[_val.egField].push(_val.values[key])
                storage.checkCount[_val.egField] = []
                storage.checkCount[_val.egField].push(key)
                  // storage.checkboxSelect.push(_val.values[key])
                  // storage.checkCount.push(key)
              } else {
                _ctInfo += '<li class="_j_selectLab"><input   id="' + _val.egField + key + '" type="checkbox"><label class="_selectMb" for="' + _val.egField + key + '"  data-info="' + key + '" >' + _val.values[key] + '</label></li>'
              }
            }
            _ctInfo += '</ul></div>'
            break;

          case 'string_select':
            _ctInfo += '<input id="fileData" type="file">'
            break;

          default:
            break;

        }
        ct += '<div class="_popupSelect _selectMb-parent" data-reopType="' + _val.egField + '"><label class="_infoData" data-info = ' + infoData + '>' + _val.chField + '</label>'
        ct += _ctInfo
        ct += '</div>'
      })
      $('.fillInSelection').append(ct)
    },
    filedTable: function() {
      storage.initMake = []
      $('._dataFiled').html('')
      var ct = '<table  align="center"><tr class="_column">'
      storage.filedData.field.column.forEach(function(_val) {
        ct += '<th>' + _val.chField + '</th>'
      })
      ct += '</tr> '

      storage.filedData.field.data.forEach(function(_vals, _index) {

        ct += '<tr class="_j_field" data-fieldid="' + storage.filedData.field.fieldID[_index] + '">'
        _vals.forEach(function(_vs, _in) {
          if (_in == _vals.length - 1) {
            storage.initMake.push({ make: _vals[2].value, name: _vals[0].value })
          }
          ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
        })

        ct += '</tr>'
      })

      ct += '<table>'

      $('._dataFiled').append(ct)
    },

    //字段 修改模板
    // fieldInfo: function() {
    //   var ct = ''
    //   var src = ''
    //   $('.PopupAdd-ZD').html('')
    //   var _d = false
    //   storage.fieldInfo.reportInfo.forEach(function(_val) {
    //     var _dInfor = ''
    //     var _hide = ''
    //     var _parp = ''
    //     switch (_val.type) {
    //       case 'string':
    //         var _blins = ''
    //         storage._changeLocation = _val.value
    //         if (_val.value == '') {
    //           _blins = storage._location
    //         } else {
    //           _blins = _val.value
    //         }
    //         _dInfor += '<input id="location" type="text" value="' + _blins + '">'
    //         break;

    //       default:
    //         var info = ''
    //         for (var key in _val.values) {
    //           if (_val.values[key] == _val.value) {
    //             src = key
    //             info += '<option data-flicid="' + key + '" selected = "selected">' + _val.values[key] + '</option>'

    //           } else {
    //             info += '<option data-flicid="' + key + '">' + _val.values[key] + '</option>'

    //           }

    //         }

    //         if (_val.egField == 'FK_FIELD_GROUP') {
    //           _dInfor += '<select data-selected="' + src + '" class="_j_fieldGroup"> ' + info + '</select>'
    //         } else if (_val.egField == 'FK_REPORT') {
    //           _dInfor += '<select data-selected="' + src + '" class="_j_report">' + info + '</select>'
    //         } else {
    //           _dInfor += '<select data-selected="' + src + '">' + info + '</select>'
    //         }
    //         break;
    //     }
    //     if (_d) {
    //       _hide = '_anmose'
    //     }
    //     if (_val.egField == "F_IS_EXTERNAL" && _val.value == '否') {
    //       _d = true
    //       _parp = '_j_actives'
    //     }
    //     if (_val.egField == "F_IS_EXTERNAL" && _val.value == '是') {
    //       _d = false
    //       _parp = '_j_actives'
    //     }

    //     ct += '<div class="_zdPopupSelect ' + _hide + _parp + '"><label data-eg="' + _val.egField + '">' + _val.chField + '</label>' + _dInfor

    //     // ct += '</select>'

    //     ct += '</div>'
    //     _parp = ''
    //   })
    //   $('.PopupAdd-ZD').append(ct)
    // },


    fieldInfo: function() {
      var ct = ''
      var src = ''
      $('.PopupAdd-ZD').html('')
      var _d = false
      storage.fieldInfo.reportInfo.forEach(function(_val) {
        var _dInfor = ''
        var _hide = ''
        var _parp = ''
        switch (_val.type) {
          case 'string':
            var _blins = ''
            storage._changeLocation = _val.value
            if (_val.value == '') {
              _blins = storage._location
            } else {
              _blins = _val.value
            }
            _dInfor += '<input id="location" type="text" value="' + _blins + '">'
            break;

          default:
            var info = '<div class="sizeFilter _liSelect"><ul>'
            var defaultValue = ''
            for (var key in _val.values) {
              if (_val.values[key] == _val.value) {
                src = key
                defaultValue = _val.values[key]
                info += '<li  class="_selectMb" data-flicid="' + key + '" selected = "selected">' + _val.values[key] + '</li>'

              } else {
                info += '<li class="_selectMb" data-flicid="' + key + '">' + _val.values[key] + '</li>'

              }

            }
            info += '</ul></div>'

            if (_val.egField == 'FK_FIELD_GROUP') {
              _dInfor += '<input type="text" data-selected="' + src + '" value="' + defaultValue + '" class="_j_fieldGroup _selectInfo"> ' + info + '</input>'
            } else if (_val.egField == 'FK_REPORT') {
              _dInfor += '<input type="text" data-selected="' + src + '" value="' + defaultValue + '" class="_j_report _selectInfo">' + info + '</input>'
            } else {
              _dInfor += '<input type="text" data-selected="' + src + '" value="' + defaultValue + '" class="_selectInfo">' + info
            }
            break;
        }
        if (_d) {
          _hide = '_anmose'
        }
        if (_val.egField == "F_IS_EXTERNAL" && _val.value == '否') {
          _d = true
          _parp = '_j_actives'
        }
        if (_val.egField == "F_IS_EXTERNAL" && _val.value == '是') {
          _d = false
          _parp = '_j_actives'
        }

        ct += '<div class="_selectMb-parent _zdPopupSelect ' + _hide + _parp + '" ><label data-eg="' + _val.egField + '">' + _val.chField + '</label>' + _dInfor

        // ct += '</select>'

        ct += '</div>'
        _parp = ''
      })
      $('.PopupAdd-ZD').append(ct)
    },
    // 列表联动 生成option
    addOption: function(data, _t) {
      _t.parents('._zdPopupSelect').next().find('input').removeAttr('disabled')
      var ct = ''
      if (data.field.length !== 0) {
        data.field.forEach(function(_val) {
          ct += '<li data-flicid="' + _val.id + '">' + _val.name + '</li>'
        })
        _t.parents('._zdPopupSelect')
          .next().find('input')
          .val(data.field[0].name).data('selected', data.field[0].id)
          .find('ul')
          .html('')
          .append(ct)

      } else {
        _t.parents('._zdPopupSelect').next().find('input').data('selected', '')
      }

    }
  }

  return C = {
    ifr: iframeCmita
  }

})