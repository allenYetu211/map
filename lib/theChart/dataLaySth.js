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
    })

    $('body').on('click', '._j_dropDown', function() {
        $(this).next().slideToggle()
    })

    /**
     *  新增， 修改， 删除 , 关闭
     * */
    $('.popup_close').on('click', function() {
        $('.popupAddChange').hide()
    })

    $('._Addlaysth').on('click', function() {
        $('.popupAddChange').show()

    })

    $('._Changelaysth').on('click', function() {
        $('.popupAddChange').show()
        rendering.fillInSelection('change')
    })

    $('._Deletelaysth').on('click', function() {
        $('.popupAddChange').show()

    })

    /**
     *  storage
     */

    var storage = {
        laysthList: '',
        reportID: '',
        fillIn_Info: '',
        checkboxSelect: []
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

        GetReportInfo: function() {
            ch.api.getDevelopment('GetReportInfo', {
                reportID: storage.reportID
            }, function(data) {
                storage.fillIn_Info = data
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
            for (var key in _lay) {
                var ct = '<div><button class="_j_toggleNextUl toggleTarget"> ' + key + '</button><ul class="in_parents">'
                _lay[key].forEach(function(_val, _inx) {
                    ct += '<li data-reportid= ' + _val.reportID + '  class="_j_getInfo">' + _val.reportName + '</li>'
                })
                ct += '</ul></div>'
                $('._j_laysthList').append(ct)
            }
        },

        fillInSelection: function(_type) {
            var ct = ''
            storage.fillIn_Info.reportInfo.forEach(function(_val) {
                ct += '<div class="_popupSelect"><label>' + _val.chField + '</label>'
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
                                ct += '<li class="_j_selected _selected">' + _val.values[key] + '</li>'
                            } else {
                                ct += '<li class="_j_selected">' + _val.values[key] + '</li>'
                            }
                        }
                        ct += '</ul></div>'
                        break;

                    case 'number_mulDic':
                        ct += '<input type="text" value="' + _val.value + '"><span class="_j_dropDown _drop"></span><div class="_liSelect"><ul>'
                        for (var key in _val.values) {
                            if (_val.values[key] == _val.value) {
                                ct += '<li class="_selected"><input id="_mulDic' + key + '" type="checkbox" checked><label for="_mulDic' + key + '">' + _val.values[key] + '</label></li>'
                                storage.checkboxSelect.push(_val.values[key])
                            } else {
                                ct += '<li><input id="_mulDic' + key + '" type="checkbox"><label for="_mulDic' + key + '">' + _val.values[key] + '</label></li>'
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
            $('.fillInSelection').html('').append(ct)
        }
    }



})