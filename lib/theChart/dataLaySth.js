define('dataLaySth', ['jquery', 'map', 'chartInformations', 'mapIntroduce'], function(jq, map, ch, mi) {


  /**
   * Dom
   */
  $('body').on('click', '._j_toggleNextUl', function() {
    $(this).next().slideToggle()
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
    $(this).parents('._popupSelect').find('input[type=text]').data('info', $(this).data('info'))
    $(this).addClass('_selected').parents('._popupSelect').find('input').val($(this).html())
  })


  $('body').on('blur', '._bulrInfo', function() {
    $(this).prev().data('info', $(this).val())
  })

  $('body').on('click', '._j_selectLab label', function() {
    var count = $(this).data('info').toString()
    if (storage['FK_TERM'].includes(count)) {
      var _count = storage['FK_TERM'].indexOf(count)
      storage['FK_TERM'].splice(_count, 1)
    } else {
      storage['FK_TERM'].push(count)
    }
    if (!$(this).prev().prop('checked')) {
      if (storage.checkboxSelect.includes($(this).html())) {
        return
      } else {
        storage.checkboxSelect.push($(this).html())

      }
    } else {
      var _index = storage.checkboxSelect.indexOf($(this).html())
      storage.checkboxSelect.splice(_index, 1)
    }
    var ct = storage.checkboxSelect.join(',')
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
      //   if ($(this).find('input[type=text]').data('info') != undefined) {
      if ($(this).data('reoptype') == 'FK_TERM') {
        storage._ob[$(this).data('reoptype')] = storage['FK_TERM']
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

  $('.popup_close').on('click', function() {
    $(this).parents('._j_popup').hide()
  })

  $('._Addlaysth').on('click', function() {
    $('.popupAddChange .popupTitle-h2').html('添加字段')
    $('.popupAddChange').show()
    sendRequst.GetReportInfo('-1')
    storage.reportType = 0
    storage.fillIn_Type = 0
  })

  $('._Changelaysth').on('click', function() {
    $('.popupAddChange .popupTitle-h2').html('修改字段')
    $('.popupAddChange').show()
    sendRequst.GetReportInfo()
    storage.reportType = 1
    storage.fillIn_Type = 1
  })

  $('._Deletelaysth').on('click', function() {
    $('.popupAddChange').show()
    storage.reportType = 2
  })

  /**
   *  字段绑定，字段添加 添加 , 修改， 删除， 生成 字段
   */

  //   $('body').on('click', '.PopupAdd-ZD select', function() {
  //     $(this).
  //   })

  $('body').on('click', '._j_fieldGroup', function() {
    var flicid = $(this).find('option:selected').data('flicid')
    $(this).find('option:selected').text()
    $(this).parents('._zdPopupSelect').next().find('select').attr('disabled', 'disabled')
    sendRequst.GetFieldOfGroup(flicid, $(this))
  })

  $('body').on('click', '._j_report', function() {
    var flicid = $(this).find('option:selected').data('flicid')
    $(this).find('option:selected').text()
    $(this).parents('._zdPopupSelect').next().find('select').attr('disabled', 'disabled')
    sendRequst.GetFieldOfReport(flicid, $(this))
  })

  $('body').on('click', '.PopupAdd-ZD select', function() {
    $(this).data('selected', $(this).find('option:selected').data('flicid'))
  })

  $('body').on('click', '._j_field', function() {
    $('._j_field').removeClass('active')
    $(this).addClass('active')
    storage.fieldID = $(this).data('fieldid')
    console.log(storage.fieldID)
  })

  $('._addTable').on('click', function() {
    storage.fieldOp['F_FIELDID'] = '-1'
    storage.tabalopType = '0'
    sendRequst.GetFieldInfo('-1')
  })

  $('._changeTable').on('click', function() {
    storage.fieldOp['F_FIELDID'] = storage.fieldID
    console.log(storage.fieldOp['F_FIELDID'])
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
    // $('.popupAddChangeZD').show()
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
        storage.fieldOp[$(this).find('label').data('eg')] = $(this).find('select').data('selected')
      }
    })
    sendRequst.ReportFieldOp('0')

  })

  $('._PopBcloser').on('click', function() {
    $(this).parents('._j_popup').hide()
  })


  $('body').on('focus', '#location', function() {
    $(this).removeAttr('style')
  })


  $('body').on('click', '._j_actives', function() {
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
    reportID: '',
    fieldID: '',
    fillIn_Info: '',
    fillIn_Type: 1,
    fillIn_addInfo: '',
    checkboxSelect: [],
    checkCount: [],
    reportType: '', // 报表操作 修改、添加、删除 参数
    FK_REPORT_TYPE: [],
    FK_TERM: [],
    _ob: {},
    fieldInfo: '',
    fieldOp: {}

  }

  /**
   * sendRequst
   */

  var sendRequst = {
    GetReport: function() {
      ch.api.getDevelopment('GetReport', {}, function(data) {
        storage.laysthList = data
        rendering.laysthList()
      })
    },

    GetReportInfo: function(_info) {
      ch.api.getDevelopment('GetReportInfo', {
        reportID: _info || storage.reportID
      }, function(data) {
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
      ch.api.getDevelopment('ReportOp', {
        report: JSON.stringify(storage._ob),
        opType: storage.reportType
      }, function(data) {})
    },

    GetFieldByReport: function() {
      ch.api.getDevelopment('GetFieldByReport', {
        reportID: storage.reportID
      }, function(data) {
        storage.filedData = data
        rendering.filedTable()
      })
    },

    sendFrom: function() {
      var files = $('#fileData').prop('files')
      var fromInfor = new FormData()
      console.log(files)
      fromInfor.append('fileContent', $('#fileData')[0].files[0])
      fromInfor.append('fileName', $('#fileData')[0].files[0].name)
      ch.api.postFormData('FileUp', fromInfor, function(data) {
        sendRequst.ReportOp()

      })
    },
    GetFieldInfo: function(_fieldID) {
      ch.api.getDevelopment('GetFieldInfo', {
        fieldID: _fieldID || storage.fieldID,
        reportID: storage.reportID
      }, function(data) {
        storage.fieldInfo = data
        rendering.fieldInfo()
        $('.popupAddChangeZD').show()
      })
    },

    GetFieldOfGroup: function(group, _t) {
      ch.api.getDevelopment('GetFieldOfGroup', {
        groupID: group
      }, function(data) {
        rendering.addOption(data, _t)
      })
    },

    GetFieldOfReport: function(group, _t) {
      ch.api.getDevelopment('GetFieldOfReport', {
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
      ch.api.getDevelopment('ReportFieldOp', {
        field: JSON.stringify(storage.fieldOp),
        reportID: storage.reportID,
        opType: storage.tabalopType
      }, function(data) {
        $('.popupAddChangeZD').hide()
        if (!data.success) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
        }
        sendRequst.GetFieldByReport()
        console.log(data)
      })
    }
  }

  sendRequst.GetReport()



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
      $('._j_laysthList > div:first').find('ul').show().find('li:first').addClass('active')
      sendRequst.GetReportInfo()
      setTimeout(function() {
        $('#viewinfo-sheetFile')[0].contentWindow.ins_displaySheet()
        $('#viewinfo-sheetFile')[0].contentWindow.ins_sheetPanel(storage.reportID, 15)
      }, 2000)
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

            _ctInfo += '<input type="text" value="' + _val.value + '"><span class="_j_dropDown _drop"></span><div class="_liSelect"><ul>'
            for (var key in _val.values) {
              if (_val.values[key] == _val.value) {
                infoData = key

                _ctInfo += '<li class="_j_selected _selected" data-info="' + key + '">' + _val.values[key] + '</li>'
                storage['FK_REPORT_TYPE'] = key
              } else {
                _ctInfo += '<li class="_j_selected" data-info="' + key + '">' + _val.values[key] + '</li>'
              }
            }
            _ctInfo += '</ul></div>'
            break;

          case 'number_mulDic':
            storage['FK_TERM'] = []
            storage.checkboxSelect = []
            _ctInfo += '<input type="text" value="' + _val.value + '"><span class="_j_dropDown _drop"></span><div class="_liSelect"><ul>'
            for (var key in _val.values) {
              if (_val.values[key] == _val.value) {
                infoData = [key]

                _ctInfo += '<li class="_j_selectLab _selected" ><input  id="_mulDic' + key + '" type="checkbox" checked><label data-info="' + key + '" for="_mulDic' + key + '">' + _val.values[key] + '</label></li>'
                storage['FK_TERM'].push(key)
                storage.checkboxSelect.push(_val.values[key])
                storage.checkCount.push(key)
              } else {
                _ctInfo += '<li class="_j_selectLab"><input id="_mulDic' + key + '" type="checkbox"><label for="_mulDic' + key + '"  data-info="' + key + '">' + _val.values[key] + '</label></li>'
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
        ct += '<div class="_popupSelect" data-reopType="' + _val.egField + '"><label class="_infoData" data-info = ' + infoData + '>' + _val.chField + '</label>'
        ct += _ctInfo
        ct += '</div>'
      })
      $('.fillInSelection').append(ct)
    },
    filedTable: function() {
      $('._dataFiled').html('')
      var ct = '<table  align="center"><tr class="_column">'
      storage.filedData.field.column.forEach(function(_val) {
        ct += '<th>' + _val.chField + '</th>'
      })
      ct += '</tr> '

      storage.filedData.field.data.forEach(function(_vals, _index) {
        ct += '<tr class="_j_field" data-fieldid="' + storage.filedData.field.fieldID[_index] + '">'
        _vals.forEach(function(_vs) {

          ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
        })

        ct += '</tr>'
      })

      ct += '<table>'

      $('._dataFiled').append(ct)
    },

    //字段 修改模板
    fieldInfo: function() {
      var ct = ''
      var src = ''
      $('.PopupAdd-ZD').html('')
      var _d = false
      console.log(storage.fieldInfo)
      storage.fieldInfo.reportInfo.forEach(function(_val) {
        var _dInfor = ''
        var _hide = ''
        var _parp = ''
        switch (_val.type) {
          case 'string':
            _dInfor += '<input id="location" type="text" value="' + _val.value + '">'
            break;

          default:
            var info = ''
            for (var key in _val.values) {
              if (_val.values[key] == _val.value) {
                src = key
                info += '<option data-flicid="' + key + '" selected = "selected">' + _val.values[key] + '</option>'

              } else {
                info += '<option data-flicid="' + key + '">' + _val.values[key] + '</option>'

              }

            }

            if (_val.egField == 'FK_FIELD_GROUP') {
              _dInfor += '<select data-selected="' + src + '" class="_j_fieldGroup"> ' + info
            } else if (_val.egField == 'FK_REPORT') {
              _dInfor += '<select data-selected="' + src + '" class="_j_report">' + info
            } else {
              _dInfor += '<select data-selected="' + src + '">' + info
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

        ct += '<div class="_zdPopupSelect ' + _hide + _parp + '"><label data-eg="' + _val.egField + '">' + _val.chField + '</label>' + _dInfor

        ct += '</select>'

        ct += '</div>'
        _parp = ''
      })
      $('.PopupAdd-ZD').append(ct)
    },

    // 列表联动 生成option
    addOption: function(data, _t) {
      _t.parents('._zdPopupSelect').next().find('select').removeAttr('disabled')
      var ct = ''
      console.log(data)
      if (data.field.length !== 0) {
        data.field.forEach(function(_val) {
          ct += '<option data-flicid="' + _val.id + '">' + _val.name + '</option>'
        })
        _t.parents('._zdPopupSelect').next().find('select').html('').append(ct)
      } else {
        _t.parents('._zdPopupSelect').next().find('select').data('selected', '')
      }

    }
  }



})