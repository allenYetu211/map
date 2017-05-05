define('infor_reported', ['jquery', 'map', 'chartInformations', 'translatePopup', 'local', 'api'], function(jq, map, ch, c, l, _API) {
    if (l._Lh !== 'Data_Collection.html') {
        return
    }
    /**
     * 
     * Dom操作
     */
    // ch.st(function(data) {
    //     console.log('data', data)
    //     storage._term = data
    //     renderingDOM.createTerm()
    // })

    $('body').on('click', '._j_treeSelect', function(e) {
        // if ($(this).hasClass('active')) {

        if ($(this).parent().find('._j_treeSelect').hasClass('active')) {
            if ($(this).next().length !== 0) {
                $(this).nextAll().remove().end().removeClass('active')
                return
            }


        }
        // }
        $('._j_treeSelect').removeClass('active');
        $(this).addClass('active')
        storage.addTre_t = $(this)
        if (storage.isFirst == 1) {
            storage.category = $(this).data('category')
            storage.isFirst = '0'
        } else {
            storage.category = $(this).data('category')
        }
        console.log(
            storage._fCode ==
            $(this).data('code')
        )

        storage.surveyid = $(this).data('survey')
        storage.survey = $(this).data('code')
        storage._fCode = $(this).data('code')
        sendReques.GetTableBySurvey()
        sendReques.GetSurveyTree()
    })

    $('body').on('click', '._moreInforTabel', function() {
        $('._moreInforTabel').removeClass('active')
        $(this).addClass('active')
        var reportid = $(this).data('reportid')
        $('#reporteIframe')[0].contentWindow.ins_sheetPanel(reportid, '15')
    })

    $('body').on('change', '._termCounts', function() {
        storage.termCount = $(this).find('option:selected').data('term')
    })

    var storage = {
        surveyCode: '',
        isFirst: '1',
        serveryTree: '',
        addTre_t: '',
        survey: l._Lg('___surveyCode'),
        category: '-1',
        tableBySurvey: '',
        surveyid: '',
        _initIframe: true,
        _fCode: '',
        _flagIfram: true,
        _term: ''
    }

    // ch.su.sendUser(true)

    var serverCode = {
        sendSurvey: function(code) {
            storage.survey = code
            sendReques.GetSurveyTree(code)
        }
    }

    /**
     * 
     * 发送请求
     */
    var sendReques = {
        GetSurveyTree: function(_ys) {
            _API._G('ReportManage.asmx/GetSurveyTree', {
                surveyCode: storage.survey,
                categoryID: storage.category,
                isFirst: storage.isFirst,
            }, function(data) {
                storage.serveryTree = data
                if (storage.isFirst == '1') {
                    renderingDOM.serveryTree()
                } else {
                    renderingDOM.serveryTree2()
                }
            })
        },

        GetTableBySurvey: function() {
            _API._G('ReportManage.asmx/GetTableBySurvey', {
                surveyID: storage.surveyid,
                categoryID: storage.category
            }, function(data) {
                if (data.surveyTable, length == 0) {
                    $('#sheet-markup').hide()
                    return
                }
                $('#sheet-markup').show()
                storage.tableBySurvey = data
                renderingDOM.addSurveyTree()
            })
        },
        GetTerm: function() {
            _API._G('DataShow.asmx/GetTerm', {}, function(data) {
                storage._term = data
                renderingDOM.createTerm()
            })
        }
    }


    /**
     * 
     * 页面渲染renderingDOM
     * 
     */

    var renderingDOM = {
        cycle: function(_tree) {
            var ct = ''
            _tree.forEach(function(_val) {
                if (storage._flagIfram) {
                    storage._fCode = _val.F_CODE
                    storage._flagIfram = false
                }
                ct += '<div class="_parmis"><p class="_j_treeSelect"  data-category="' + _val.FK_CATEGORY + '" data-code="' + _val.F_CODE + '"  data-survey="' + _val.FK_SURVEY + '"> <span>' + _val['F_CAPTION'] + '</span></p></div>'
            })
            return ct
        },

        serveryTree: function() {
            var _tree = storage.serveryTree.surveyTree
            var _container = ''
            for (var i = 0; i < _tree.length; i++) {
                for (var key in _tree[i]) {
                    var ct = this.cycle(_tree[i][key])
                    var _container = '<div>' + key + ct + '</div>'
                }
            }
            $('._j_inforReported').append(_container)
                // $('._j_inforReported').find('div> ._parmis:first').find('._j_treeSelect').addClass('active')
            var _surID = $('._j_inforReported').find('div> ._parmis:first').find('._j_treeSelect').data('reportid')
            storage.surveyid = 1
            storage.category = 1
            sendReques.GetTableBySurvey()
                // if ($('#reporteIframe').length !== 0) {
                //     $('#reporteIframe')[0].contentWindow.ins_displaySheet()
                // }
        },

        serveryTree2: function() {
            var _tree = storage.serveryTree.surveyTree
            var _container = this.cycle(_tree)
            storage.addTre_t.parent().append(_container)
        },

        addSurveyTree: function() {
            var ct = ''
            var _tabel = storage.tableBySurvey.surveyTable
            var flag = true
            var reportid = ''
            for (var i = 0; i < _tabel.length; i++) {
                if (flag) {
                    reportid = _tabel[i].reportID
                    flag = false
                }
                ct += '<div class="_moreInforTabel" data-reportid="' + _tabel[i].reportID + '">' + _tabel[i].reportName + '</div>'
            }
            $('._moreInfor').html('').append(ct)
            $('._moreInfor').find('._moreInforTabel:first').addClass('active')
                // reportid = $('._moreInfor').findreportidreportid('._moreInforTabel:first').data('reportid')
            if ($('#reporteIframe').length !== 0) {
                if (storage._initIframe) {
                    $('#reporteIframe')[0].contentWindow.ins_displaySheet(false)
                    storage._initIframe = false
                }
                $('#reporteIframe')[0].contentWindow.ins_sheetPanel(reportid, '15')
                setTimeout(function() {
                    $('#reporteIframe')[0].contentWindow.ins_loadvalue(reportid, storage.termCount, storage._fCode)
                }, 2000);
            }
        },

        createTerm: function() {
            var ct = '<select class="_termCounts">'
            storage._term.terms.forEach(function(_val) {
                ct += '<option data-term="' + _val.termID + '">' + _val.termName + '</option>'
            })
            storage.termCount = 1
            ct += '</select>'
            $('._term').append(ct)
        }

    }

    var _init = {
        term: function() {
            sendReques.GetSurveyTree()
            sendReques.GetTerm()
        }
    }
    _init.term()
    return {
        S: serverCode.sendSurvey
    }

})