// define("development", ["jquery", "chartInformations"], function(j, ch) {

define('development', ['jquery', 'map', 'chartInformations', 'mapIntroduce'], function(jq, map, ch, mi) {
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

    $('body').on('click', '.group', function() {
        storage.groupid = $(this).data('groupid')
        sendRequest.GetFieldByGroup()
    })

    $('body').on('click', '.gr-delete', function() {
        storage.groupID = $(this).parents('li').find('.group').data('groupid')
        storage.opType = '2'
        sendRequest.FieldGroupOp($(this).parents('li').find('input').val(), $(this))
    })

    $('body').on('click', '.gr-change', function() {
        storage.opType = '1'
        $('.listAry').find('.change-group').removeClass('_show')

        var replaceNew = $(this).parents('li').find('.change-group').val().replace(/\s*/g, '')
        $(this).parents('li').find('.change-group').val(replaceNew)
        storage.inputValus = replaceNew
        storage.groupID = $(this).parents('li').find('.group').data('groupid')
        $(this).parents('li').find('.change-group').addClass('_show').focusEnd()
    })

    $('body').on('blur', 'input.change-group', function() {
        if ($(this).val() !== storage.inputValus && $(this).val().replace(/^\s*/g, '') !== '') {
            sendRequest.FieldGroupOp($(this).val(), $(this))
        } else if ($(this).val().replace(/^\s*/g, '') === '') {
            $(this).parents('li').remove()
        } else {
            $(this).removeClass('_show')
        }
    })

    $('body').on('click', '.addListAry', function() {
        var ct = '<li><span class="group" data-groupid=""> </span><input type="text" class="change-group _show" value=" "><div class="gr-feature"><span class="gr-delete"><img src="images/chart/icon_close@2x.png" alt=""></span><span class="gr-change"><img src="images/chart/icon_close@2x.png" alt=""></span></div></li>'
        storage.opType = '0'
        $('._listAryUL').append(ct).find('li:last').find('input').focusEnd()
    })


    $('body').on('dblclick', '.tableList td', function() {
        if (storage.notD) return

        if (storage.notA) {
            if ($(this).parents('tr').hasClass('_addTr')) {
                $(this).find('input, select').show()
                $(this).find('input[type="text"]').focusEnd()
            }
        } else if (storage.notC) {
            if ($(this).parents('tr').hasClass('_deleteTr')) {
                $(this).find('input, select').show()
                $(this).find('input[type="text"]').focusEnd()
            }
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
        sendRequest.FieldOp()
    })

    /**
     * 删除
     */
    $('.deleteListData').on('click', function() {
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
        $(this).toggleClass('active')
        $('.addListData, .deleteListData').removeClass('active')
        storage.FieldOpType = '1'
        storage.notC = !storage.notC
        storage.notA = false
        storage.notD = false
    })

    /**
     * 新增
     */
    $('.addListData').on('click', function() {
        // $(this).toggleClass('active')
        $('.changeListData, .deleteListData').removeClass('active')
        storage.FieldOpType = '0'
        storage.notA = true
        storage.notC = false
        storage.notD = false

        var _dataKey = $('.tebleListinfo').find('tr:last').data('key') == undefined ? -1 : $('.tebleListinfo').find('tr:last').data('key')
        var _pro = storage.bygroupData.field.columnPro
        var ct = ''
        ct += '<tr class="_addTr" data-key= "' + (_dataKey + 1) + '">'
        _pro.forEach(function(_val, _int) {
            var inputTypes = ''
            var defaultVal = ''
            var _selectIndex = ''
            switch (_val.type) {
                case 'string':
                    inputTypes = '<input type="text" value="">'
                    break;

                case 'number_dic':
                    var _count = 0
                    _selectIndex = 'data-selectIndex= "0"'
                    inputTypes += '<select>'
                    for (var key in _pro[_int].values) {
                        if (_count <= 1) {
                            defaultVal = _pro[_int].values[key]
                        }
                        inputTypes += '<option>' + _pro[_int].values[key] + '</option>'
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
            console.log(storage.fieldOp)
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
        GetFieldGroup: function() {
            ch.api.getDevelopment('GetFieldGroup', {}, function(data) {
                storage.listAry = data
                rendering.listAry()
            })
        },


        GetFieldByGroup: function() {
            ch.api.getDevelopment('GetFieldByGroup', {
                groupID: storage.groupid
            }, function(data) {
                storage.bygroupData = data
                rendering.tablelist()
                storage.fieldOp = {}
            })
        },


        FieldGroupOp: function(_changVal, _t) {
            ch.api.getDevelopment('FieldGroupOp', {
                groupID: storage.groupID || '-1',
                groupName: _changVal.replace(/^\s*/g, '').replace(/\s*$/g, ''),
                opType: storage.opType
            }, function(data) {
                if (data.success) {
                    if (storage.opType == '2') {
                        _t.parents('li').remove()
                    } else if (storage.opType == '0') {
                        _t.parents('li').find('.group').data('groupid', data.groupID)
                        _t.parents('li').find('.change-group').val(_t.val())
                        _t.prev().html(_t.val())
                        _t.removeClass('_show')
                    } else {
                        _t.prev().html(_t.val())
                        _t.removeClass('_show')
                    }
                } else {
                    if (storage.opType == '1') {
                        _t.val(storage.inputValus)
                        _t.removeClass('_show')
                    } else if (storage.opType == '-1') {
                        _t.parents('li').remove()
                    } else {

                    }
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
            console.log(_obj)
            ch.api.getDevelopment('FieldOp', {
                fields: JSON.stringify(_obj),
                opType: storage.FieldOpType
            }, function(data) {
                if (storage.FieldOpType == 0) {
                    sendRequest.GetFieldByGroup()
                } else if (storage.FieldOpType == 2) {
                    $('._deleteTr.active, _addTr.active').each(function() {
                        $(this).remove()
                    })
                    $('.deleteListData').removeClass('active')
                    storage.notD = false
                }
                console.log(data)
            })
        }
    }

    sendRequest.GetFieldGroup()



    /***
     *  Rendering Dom
     */

    var rendering = {
        listAry: function() {
            var itme = '<div class="addListAry">新增</div><ul class="_listAryUL">'
            storage.listAry.fieldGroup.forEach(function(_val) {
                itme += '<li><span class="group" data-groupid=' + _val.groupID + '>' + _val.groupName + '</span><input type="text" class="change-group" value=' + _val.groupName + '><div class="gr-feature"><span class="gr-delete">' +
                    '<img src="images/chart/icon_close@2x.png" alt=""></span>' +
                    '<span class="gr-change"><img src="images/chart/icon_close@2x.png" alt=""></span>' +
                    '</div></li>'
            })
            itme += '</ul>'
            $('.listAry').append(itme)
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
                    switch (_pro.type) {
                        case 'string':
                            inputTypes = '<input type="text" value="' + _vs.value + '">'
                            break;

                        case 'number_dic':
                            inputTypes += '<select>'
                            for (var key in _pro.values) {
                                inputTypes += '<option>' + _pro.values[key] + '</option>'
                            }
                            inputTypes += '</select>'
                            break;

                        case 'number':
                            inputTypes = '<input type="number" value="' + _vs.value + '">'
                            break;

                        default:
                            break;
                    }

                    ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '><span>' + _vs.value + '</span>' + inputTypes + '</td>'
                })
                ct += '</tr>'
            })
            ct += '<table>'
            $('.tebleListinfo').html('').append(ct)
        }
    }

})