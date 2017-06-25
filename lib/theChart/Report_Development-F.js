// define("development", ["jquery", "chartInformations"], function(j, ch) {

define('development', ['jquery', 'local', 'api'], function(jq, l, _API) {
  if (l._Lh !== 'Report_Development-F.html') {
    return
  }
  /***
   *  Dom 操作
   * */
  (function($) {
    $.fn.setCursorPosition = function(position) {
      if (this.lengh == 0)
        return this;
      return $(this).setSelection(position, position);
    };

    $.fn.setSelection = function(selectionStart, selectionEnd) {
      if (this.lengh == 0)
        return this;
      input = this[0];

      if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
      } else if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
      }

      return this;
    };

    $.fn.focusEnd = function() {
      if ($(this).attr("type") != 'text') return
      this.setCursorPosition(this.val().length);
    };
  })(jq)

  $('.developmentSelect').on('keydown', function(e) {
    if (e.keyCode == 13) {
      if ($(this).val().trim() == '') return
      sendRequest.FieldSearch($(this).val())
    }
    if (e.keyCode == 8) {
      if ($(this).val().length <= 1) {
        sendRequest.GetFieldByGroup()
      }
    }
  })

  //  $('.developmentSelect').on('blur', function () {
  //   $('._selecteBtn').removeClass('active')
  // })

  $('.al-popup-prompt, .al-closer-b').on('click', function() {
    $('.al-popup-prompt').hide()
  })

  // $('body').on('click', '.group', function() {
  //   // $('.addSeve').show();
  //   storage.groupid = $(this).data('groupid')
  //   storage.groupHTML = $(this).html()
  //   storage.notA = false
  //   storage.notC = false
  //   storage.notD = false
  //   $('.changeListData, .deleteListData').removeClass('active')
  //   sendRequest.GetFieldByGroup()
  // })

  $('body').on('click', '._j_d_Addlaysth', function() {
    rendering.Bb_addListAry()
  })

  $('body').on('click', '._j_d_Changelaysth', function() {

    storage.opType = '1'
    $('._listAryUL li.active').find('.change-group').removeClass('_show')
    var replaceNew = $('._listAryUL li.active').find('.change-group').val().replace(/^\s*/g, '')
    $('._listAryUL li.active').find('.change-group').val(replaceNew)
    storage.inputValus = replaceNew
    storage.groupID = $('._listAryUL li.active').find('.group').data('groupid')
    $('._listAryUL li.active').find('.change-group').addClass('_show').focusEnd()

  })

  $('body').on('click', '._j_d_Deletelaysth', function() {
    var _html = $('._listAryUL li.active').find('span').html()
    $('.al-popup-prompt').show().find('.al-prompt-informations').html('确认删除 "' + _html + '" 分组?')
    $('.deleteLaysth').show()
  })

  $('.deleteLaysth ._affirm').on('click', function () {
    storage.opType = '2'
    sendRequest.FieldGroupOp()
    $('.al-popup-prompt, .deleteLaysth').hide()
  })

  $('.deleteLaysth ._cancel').on('click', function () {
    $('.al-popup-prompt, .deleteLaysth').hide()
  })

  $('.al-popup').on('click', function(e) {
    e.stopPropagation()
  })

  $('body').on('click', '.gr-delete', function() {
    storage.opType = '2'
    storage.groupID = $(this).parents('li').find('span.group').data('groupid')
    console.log($(this).parents('li').find('span').html())
    sendRequest.FieldGroupOp($(this).parents('li').find('span').html(), $(this))
  })

  $('body').on('click', '.gr-change', function() {
    storage.opType = '1'
    $('.listAry').find('.change-group').removeClass('_show')

    var replaceNew = $(this).parents('li').find('.change-group').val().replace(/^\s*/g, '')
    $(this).parents('li').find('.change-group').val(replaceNew)
    storage.inputValus = replaceNew
    storage.groupID = $(this).parents('li').find('.group').data('groupid')
    $(this).parents('li').find('.change-group').addClass('_show').focusEnd()
  })

  $('body').on('blur', 'input.change-group', function() {
    if ($(this).val() !== storage.inputValus && $(this).val().replace(/^\s*/g, '') !== '') {
      storage.groupName = $(this).val()
      sendRequest.FieldGroupOp($(this).val(), $(this))
    } else if ($(this).val().replace(/^\s*/g, '') === '') {
      $(this).parents('li').remove()
    } else {
      $(this).removeClass('_show')
    }
  })

  $('body').on('click', '._listAryUL li', function() {
    storage.groupid = $(this).find('.group').data('groupid')
    storage.groupHTML = $(this).find('.group').html()
    storage.notA = false
    storage.notC = false
    storage.notD = false
    $('.changeListData, .deleteListData').removeClass('active')
    sendRequest.GetFieldByGroup()

    storage.groupID = $(this).find('.group').data('groupid')
    storage.groupName = $(this).find('.group').html()
    $('._listAryUL li').removeClass('active')
    $(this).addClass('active')
  })

  $('body').on('click', '.addListAry', function() {
    rendering.Bb_addListAry()
  })


  $('body').on('click', '.tableList td', function() {
      console.log($(this).parents('._deleteTr').length > 0 ? true : false)
      var _infor = $(this).parents('._deleteTr').length > 0 ? true : false
    if (storage.notD) return
    if (storage.notC && _infor) {
      $(this).find('input, select').show()
      $(this).find('input[type="text"]').focusEnd()
    } else if(storage.notA && !_infor) {
        $(this).find('input, select').show()
      $(this).find('input[type="text"]').focusEnd()
    }else {
      $('.tebleListinfo').find('tr').removeClass('action')
      $(this).parents('tr').addClass('action')
    }

  })

  $('body').on('blur', '.tableList td input', function() {
    var replaceNew = $(this).val().replace(/^\s*/g, '').replace('/\s*$/g', '')
    $(this).val(replaceNew)
    $(this).prev().html(replaceNew)
    $(this).hide()
    dealWithData.fieldOp($(this))
  })

  $('body').on('change', '.tableList td select', function() {
    $(this).prev().data('selectindex', $(this).get(0).selectedIndex)
    $(this).prev().html($(this).find("option:selected").text())
    $(this).prev().data('selectindex', $(this).find("option:selected").data('selectindex'))
    $(this).hide()
    dealWithData.fieldOp($(this))
  })



  /**
   * 删除id
   */
  $('body').on('click', '._deleteTr', function() {
    if (!storage.notD) return
    var _key = {}
    $(this).toggleClass('active')
    storage.deleteAry.push($(this).index() - 1)
    _key['F_FIELDID'] = $(this).data('key')
    storage.fieldOp[$(this).data('key')] = _key
  })

  $('body').on('click', '._addTr', function() {
    if (!storage.notD) return
    $(this).toggleClass('active')
  })

  /**
   * 存储
   */
  $('.serverListData').on('click', function() {

    if (storage.FieldOpType == '2') {
      $('._addTr.active').remove()
      sendRequest.FieldOp()
      return;
    }
    // 存储 检查是否填写完整
    var falg = false
      // if (storage.FieldOpType == '0') {
    $('tr').find('span').each(function(_inx) {
      if ($(this).html() == '') {
        $(this).parents('td').addClass('_null')
        falg = true
      }
      if (_inx == $('tr').find('span').length - 1) {
        if (falg) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html('不能为空')
        } else {
          sendRequest.FieldOp()

        }
      }

    })
    storage.notA = false
    storage.notC = false
    storage.notD = false
  })

  /**
   * 删除
   */
  $('.deleteListData').on('click', function() {
    $('.tebleListinfo').find('tr').removeClass('action')
    $(this).toggleClass('active')
    $('.addListData, .changeListData').removeClass('active')
    storage.FieldOpType = '2'
    storage.notD = !storage.notD
    storage.notA = false
    storage.notC = false
  })

  /**
   * 修改
   */
  $('.changeListData').on('click', function() {
    $('.tebleListinfo').find('tr').removeClass('action')
    $(this).toggleClass('active')
    $('.addListData, .deleteListData').removeClass('active')
    $('._deleteTr,._addTr').removeClass('active')
    storage.FieldOpType = '1'
    storage.notC = !storage.notC
    storage.notA = true
    storage.notD = false
  })

  /**
   * 新增
   */
  $('.addListData').on('click', function() {
    $('.tebleListinfo').find('tr').removeClass('action')
    $('.changeListData, .deleteListData').removeClass('active')
    $('._deleteTr,._addTr').removeClass('active')
    storage.FieldOpType = '0'
    storage.notA = true
    storage.notC = false
    storage.notD = false

    var _dataKey = $('.tebleListinfo').find('tr:last').data('key') == undefined ? -1 : $('.tebleListinfo').find('tr:last').data('key')
    var ct = ''
    ct += '<tr class="_addTr" data-key= "' + (_dataKey + 1) + '">'
      // var _vs = storage.bygroupData.field.data
    storage.bygroupData.field.columnPro.forEach(function(_val, _int) {
      var _pro = storage.bygroupData.field.columnPro[_int]

      var inputTypes = ''
      var defaultVal = ''
      var _selectIndex = ''

      switch (_val.type) {
        case 'string':
          inputTypes = '<input type="text" value="">'
          break;

        case 'number_dic':
          var _count = 0
          inputTypes += '<select>'
          for (var key in _pro.values) {
            if (_int == storage.bygroupData.field.columnPro.length - 1) {
              if (storage.groupHTML == _pro.values[key]) {
                defaultVal = _pro.values[key]
                _selectIndex = 'data-selectIndex= "' + key + '"'
                inputTypes += '<option data-selectIndex="' + key + '" selected="selected">' + _pro.values[key] + '</option>'
              } else {
                inputTypes += '<option data-selectIndex="' + key + '" >' + _pro.values[key] + '</option>'
              }

            } else {
              if (_count < 1) {
                _selectIndex = 'data-selectIndex= "' + key + '"'
                defaultVal = _pro.values[key]
                inputTypes += '<option data-selectIndex="' + key + '" selected="selected">' + _pro.values[key] + '</option>'
              } else {
                inputTypes += '<option data-selectIndex="' + key + '">' + _pro.values[key] + '</option>'

              }
              _count++
            }

          }
          inputTypes += '</select>'
          break;

        case 'number':
          inputTypes = '<input type="number" value="">'
          break;

        default:
          break;
      }

      ct += '<td valign="middle" rowspan = "1"><span ' + _selectIndex + '>' + defaultVal + '</span>' + inputTypes + '</td>'
    })
    ct += '</tr>'

    $('.tebleListinfo tbody').append(ct)
  })

  var dealWithData = {
    fieldOp: function(_t) {
      var _obj = {}
      var _key = ''
      _t.parents('tr').find('span').each(function(_index) {
        _key = storage.bygroupData.field.column[_index].egField
        if ($(this).data('selectindex') != undefined) {
          _obj[_key] = $(this).data('selectindex')
        } else {
          _obj[_key] = $(this).html()
        }
      })
      _obj['F_FIELDID'] = _t.parents('._deleteTr').data('key')
      storage.fieldOp[_t.parents('tr').data('key')] = _obj
    }
  }

  /***
   *  storage Data
   * */

  var storage = {
    listAry: '',
    groupid: '',
    bygroupData: '',
    inputValus: '',
    opType: '',
    fieldOp: {},
    notD: false,
    notA: false,
    notC: false,
    FieldOpType: '',
    deleteAry: []
  }

  /**
   *  send Rquest
   * **/
  var sendRequest = {
    FieldSearch: function (_val) {
      _API._G('ReportManage.asmx/FieldSearch', {
        content: _val
      }, function (data) {
         storage.bygroupData = data
         rendering.tablelist()
         storage.fieldOp = {}
      })
    },

    GetFieldGroup: function() {
      _API._G('ReportManage.asmx/GetFieldGroup', {}, function(data) {
        storage.listAry = data
        rendering.listAry()
      })
    },


    GetFieldByGroup: function() {
      _API._G('ReportManage.asmx/GetFieldByGroup', {
        groupID: storage.groupid
      }, function(data) {
        storage.bygroupData = data
        rendering.tablelist()
        if (data.field.data.length <= 0) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html('无数据')

        }
        storage.fieldOp = {}
      })
    },


    FieldGroupOp: function(_changVal, _t) {
      var _info = ''
      if (storage.groupName != undefined) {
        _info = storage.groupName.replace(/^\s*/g, '').replace(/\s*$/g, '')
      } else {
        _info = _changVal
      }
      _API._G('ReportManage.asmx/FieldGroupOp', {
        groupID: storage.groupID || '-1',
        groupName: _info,
        // groupName: storage.groupName.replace(/^\s*/g, '').replace(/\s*$/g, ''),
        opType: storage.opType
      }, function(data) {
        if (data.success) {
          if (_t != undefined) {
            if (storage.opType == '2') {
              _t.parents('li').remove()
            } else if (storage.opType == '0') {
              $('._listinfoAdd').find('li').removeClass('active')
              _t.parents('li').addClass('active').find('.group').data('groupid', data.groupID)
              _t.parents('li').find('.change-group').val(_t.val())
              _t.prev().html(_t.val())
              _t.removeClass('_show')
              storage.groupid = data.groupID
              sendRequest.GetFieldByGroup()
            } else {
              _t.prev().html(_t.val())
              _t.removeClass('_show')
            }
          } else {
            if (storage.opType == '2') {
              $('._listAryUL li.active').remove()
            } else if (storage.opType == '0') {
              _t.parents('li').find('.group').data('groupid', data.groupID)
              _t.parents('li').find('.change-group').val(_t.val())
              _t.prev().html(_t.val())
              _t.removeClass('_show')
            } else {
              _t.prev().html(_t.val())
              _t.removeClass('_show')
            }
          }
        } else {
          if (storage.opType == '1') {
            _t.val(storage.inputValus)
            _t.removeClass('_show')
          } else if (storage.opType == '-1') {
            _t.parents('li').remove()
          } else {}
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
        }
      })
    },


    FieldOp: function() {
      var _obj = {}
      var _ary = []
      for (var key in storage.fieldOp) {
        _ary.push(storage.fieldOp[key])
      }
      _obj['fields'] = _ary
      _API._G('ReportManage.asmx/FieldOp', {
        fields: JSON.stringify(_obj),
        opType: storage.FieldOpType
      }, function(data) {
        if (storage.FieldOpType == 0) {
          sendRequest.GetFieldByGroup()
        } else if (storage.FieldOpType == 2) {
          storage.fieldOp = {}
          $('._deleteTr.active, _addTr.active').each(function() {
            $(this).remove()
          })
          $('.deleteListData').removeClass('active')
          storage.notD = false
        }
        $('.addSeve').find('button').removeClass('active')
        if (data.errcode) {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html(data.msg)
        } else {
          $('.al-popup-prompt').show().find('.al-prompt-informations').html('提交成功')

        }
      })
    }
  }

  sendRequest.GetFieldGroup()



  /***
   *  Rendering Dom
   */

  var rendering = {
    Bb_addListAry: function() {
      var ct = '<li><span class="group" data-groupid=""> </span>' +
        '<input type="text" class="change-group _show" value=" ">' +
        '<div class="gr-feature"></div></li>'
      storage.opType = '0'
      $('._listAryUL').append(ct).find('li:last').find('input').focusEnd()
    },

    listAry: function() {
      var itme = '<ul class="_listAryUL">'
      storage.listAry.fieldGroup.forEach(function(_val, _index) {
        if (_index <= 0) {
          storage.groupid = _val.groupID
        }
        itme += '<li><span class="group" data-groupid=' + _val.groupID + '>' + _val.groupName + '</span><input type="text" class="change-group" value=' + _val.groupName + '><div class="gr-feature"></div></li>'

        // itme += '<li><span class="group" data-groupid=' + _val.groupID + '>' + _val.groupName + '</span><input type="text" class="change-group" value=' + _val.groupName + '><div class="gr-feature"><span class="gr-change">' +
        //     '<img src="images/chart/icon_zdedit@2x.png" alt=""></span>' +
        //     '<span class="gr-delete"><img src="images/chart/icon_zddelete@2x.png" alt=""></span>' +
        //     '</div></li>'
      })
      itme += '</ul>'
      $('._listinfo').append(itme)
      $('._listinfo').find('li:first').addClass('active')
      sendRequest.GetFieldByGroup()
    },


    tablelist: function() {
      var ct = '<table  align="center"><tr class="_column">'
      storage.bygroupData.field.column.forEach(function(_val) {
        ct += '<th>' + _val.chField + '</th>'
      })
      ct += '</tr> '

      storage.bygroupData.field.data.forEach(function(_vals, _inx) {
        ct += '<tr class="_deleteTr" data-key="' + storage.bygroupData.field.fieldID[_inx] + '">'
        _vals.forEach(function(_vs, _index) {
          var _pro = storage.bygroupData.field.columnPro[_index]
          var inputTypes = ''
          var _selectIndex = ''
          switch (_pro.type) {
            case 'string':
              inputTypes = '<input type="text" value="' + _vs.value + '">'
              break;

            case 'number_dic':
              var _count = 0
              inputTypes += '<select>'
              for (var key in _pro.values) {
                // if (_count <= 1) {
                //     _selectIndex = 'data-selectIndex= "' + key + '"'
                //     defaultVal = _pro.values[key]
                // }
                if (_pro.values[key] == _vs.value) {
                  _selectIndex = 'data-selectindex= "' + key + '"'
                  inputTypes += '<option data-selectIndex= "' + key + '" selected="selected">' + _pro.values[key] + '</option>'
                } else {
                  inputTypes += '<option data-selectIndex= "' + key + '" >' + _pro.values[key] + '</option>'

                }
              }
              inputTypes += '</select>'
              break;

            case 'number':
              inputTypes = '<input type="number" value="' + _vs.value + '">'
              break;

            default:
              break;
          }

          ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '><span ' + _selectIndex + '>' + _vs.value + '</span>' + inputTypes + '</td>'
        })
        ct += '</tr>'
      })
      ct += '<table>'
      $('.tebleListinfo').html('').append(ct)
    }
  }

})