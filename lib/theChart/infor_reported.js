define('infor_reported', ['jquery', 'map', 'chartInformations', 'translatePopup'], function(jq, map, ch, c) {
    /**
     * 
     * Dom操作
     */

    $('body').on('click', '._j_treeSelect', function() {
        storage.addTre_t = $(this)
        if (storage.isFirst == 1) {
            storage.category = $(this).data('category')
            storage.isFirst = '0'
        } else {
            storage.category = $(this).data('code')
        }
        storage.survey = $(this).data('survey')
        sendReques.GetTableBySurvey()
        sendReques.GetSurveyTree()
    })

    $('body').on('change', '._surveyTabel', function() {
        var reportid = $(this).find('option:selected').data('reportid')
        $('#reporteIframe')[0].contentWindow.ins_displaySheet()
        $('#reporteIframe')[0].contentWindow.ins_sheetPanel(reportid, '15')
    })

    var storage = {
        surveyCode: '',
        isFirst: '1',
        serveryTree: '',
        addTre_t: '',
        survey: '',
        category: '-1',
        tableBySurvey: ''
    }

    ch.su.sendUser(true)

    var serverCode = {
        sendSurvey: function(code) {
            storage.surveyCode = code
            sendReques.GetSurveyTree(code)
        }
    }

    /**
     * 
     * 发送请求
     */
    var sendReques = {
        GetSurveyTree: function(_ys) {
            ch.api.getDevelopment('GetSurveyTree', {
                surveyCode: storage.surveyCode,
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
            ch.api.getDevelopment('GetTableBySurvey', {
                surveyID: storage.survey,
                categoryID: storage.category
            }, function(data) {
                storage.tableBySurvey = data
                renderingDOM.addSurveyTree()
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
            var ct = '<ul>'
            _tree.forEach(function(_val) {
                console.log(_val)
                ct += '<li><div class="_j_treeSelect"  data-category="' + _val.FK_CATEGORY + '" data-code="' + _val.F_CODE + '"  data-survey="' + _val.FK_SURVEY + '">' + _val['F_CAPTION'] + '</div></li>'
                for (var _k in _val) {}
            })
            ct += '</ul>'
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
        },

        serveryTree2: function() {
            var _tree = storage.serveryTree.surveyTree
            var _container = this.cycle(_tree)
            storage.addTre_t.parent().append(_container)
        },

        addSurveyTree: function() {
            var ct = '<select class="_surveyTabel">'
            var _tabel = storage.tableBySurvey.surveyTable
            for (var i = 0; i < _tabel.length; i++) {
                ct += '<option class="_moreInforTabel" data-reportid="' + _tabel[i].reportID + '">' + _tabel[i].reportName + '</option>'
            }
            ct += '</select>'
            $('._selecteTabel').html('').append(ct)

        }
    }

    return {
        S: serverCode.sendSurvey
    }

})