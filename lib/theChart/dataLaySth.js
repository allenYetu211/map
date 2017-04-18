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
        $(this).parents('._popupSelect').find('input').val(ct)
    })

    $('.fillInSelection').on('click', '.input[type=checkbox]', function() {
        console.log($(this))
    })

    /**
     *  新增， 修改， 删除 , 关闭, 提交
     * */

    $('.confirm').on('click', function() {
        var _ob = {}
        $('._popupSelect').each(function() {
            if ($(this).find('input[type=text]').data('info') != undefined) {
                _ob[$(this).data('reoptype')] = $(this).find('input[type=text]').data('info')
            } else {
                _ob[$(this).data('reoptype')] = $(this).data('reoptype')
            }
        })
        console.log(_ob)
        sendRequst.ReportOp()
    })

    $('.popup_close').on('click', function() {
        $('.popupAddChange').hide()
    })

    $('._Addlaysth').on('click', function() {
        $('.popupTitle-h2').html('添加字段')
        $('.popupAddChange').show()
        sendRequst.GetReportInfo('-1')
        storage.reportType = 0
        storage.fillIn_Type = 0
    })

    $('._Changelaysth').on('click', function() {
        $('.popupTitle-h2').html('修改字段')
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
     *  storage
     */

    var storage = {
        laysthList: '',
        reportID: '',
        fillIn_Info: '',
        fillIn_Type: 1,
        fillIn_addInfo: '',
        checkboxSelect: [],
        checkCount: [],
        reportType: '', // 报表操作 修改、添加、删除 参数
        FK_REPORT_TYPE: [],
        FK_TERM: []

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

        // ReportOp: function() {
        //     ch.api.getDevelopment('ReportOp', {
        //         report: 
        //         opType: storage.report
        //     }, function(data) {
        //         console.log(data)
        //     })
        // },

        GetFieldByReport: function() {
            ch.api.getDevelopment('GetFieldByReport', {
                reportID: storage.reportID
            }, function(data) {
                console.log(data)
                storage.filedData = data
                rendering.filedTable()
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
        },
        // 添加，修改 模板
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
                ct += '<div class="_popupSelect" data-reopType="' + _val.egField + '"><label>' + _val.chField + '</label>'
                switch (_val.type) {
                    case 'string':
                        ct += '<input type="text" value="' + _val.value + '">'
                        break

                    case 'number':
                        ct += '<input type="number" value="' + _val.value + '">'
                        break;

                    case 'number_dic':
                        ct += '<input type="text" value="' + _val.value + '"><span class="_j_dropDown _drop"></span><div class="_liSelect"><ul>'
                        for (var key in _val.values) {
                            if (_val.values[key] == _val.value) {
                                ct += '<li class="_j_selected _selected" data-info="' + key + '">' + _val.values[key] + '</li>'
                                storage['FK_REPORT_TYPE'] = key
                            } else {
                                ct += '<li class="_j_selected" data-info="' + key + '">' + _val.values[key] + '</li>'
                            }
                        }
                        ct += '</ul></div>'
                        break;

                    case 'number_mulDic':
                        storage['FK_TERM'] = []
                        storage.checkboxSelect = []
                        ct += '<input type="text" value="' + _val.value + '"><span class="_j_dropDown _drop"></span><div class="_liSelect"><ul>'
                        for (var key in _val.values) {
                            if (_val.values[key] == _val.value) {
                                ct += '<li class="_j_selectLab _selected" ><input  id="_mulDic' + key + '" type="checkbox" checked><label data-info="' + key + '" for="_mulDic' + key + '">' + _val.values[key] + '</label></li>'
                                storage['FK_TERM'].push(key)
                                storage.checkboxSelect.push(_val.values[key])
                                storage.checkCount.push(key)
                            } else {
                                ct += '<li class="_j_selectLab"><input id="_mulDic' + key + '" type="checkbox"><label for="_mulDic' + key + '"  data-info="' + key + '">' + _val.values[key] + '</label></li>'
                            }
                        }
                        ct += '</ul></div>'
                        break;

                    case 'string_select':
                        ct += '<input type="file">'
                        break;

                    default:
                        break;

                }
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

            storage.filedData.field.data.forEach(function(_vals) {
                ct += '<tr>'
                _vals.forEach(function(_vs) {

                    ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
                })

                ct += '</tr>'
            })

            ct += '<table>'

            $('._dataFiled').append(ct)
        }
    }



})