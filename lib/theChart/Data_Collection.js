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
        e.preventDefault()
        if ($(this).parent().find('._j_treeSelect').hasClass('active')) {
            if ($(this).next().length !== 0) {
                $(this).nextAll().remove().end().removeClass('active')
                return
            }


        }
        // }
        $('._j_treeSelect').removeClass('active');
        $(this).addClass('active')

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
        $(this).parents('._parmis').slideUp()
        $(this).parents('._parmis').prev('._j_prents').find('span').html($(this).html())
        storage.addTre_t = $(this).parents('._parentsTree')
        storage.surveyid = $(this).data('survey')
        storage.survey = $(this).data('code')
        storage._fCode = $(this).data('code')
        sendReques.GetTableBySurvey()
        sendReques.GetSurveyTree()
    })

    $('body').on('click', '._j_prents', function() {
        $(this).find('span').html('请选择')
        $(this).next().slideDown().nextAll().remove()
    })

    $('body').on('click', '._moreInforTabel', function() {
        $('._moreInforTabel').removeClass('active')
        $(this).addClass('active')
        storage.__reportid = $(this).data('reportid')
            // $('#reporteIframe')[0].contentWindow.ins_sheetPanel(storage.__reportid, '15')
    })

    $('body').on('change', '._termCounts', function() {
        storage.termCount = $(this).find('option:selected').data('term')
    })
    $('body').on('click', '._potoshop', function() {
        sendReques.GetPicture()
    })

    $('body').on('click', '.silder_nav li', function() {
        $('.silder_nav li').removeClass('active')
        $(this).addClass('active')
        var _in = $(this).index()
        $('.silder_con li').removeClass('active')
        $('.silder_con li').eq(_in).addClass('active')
    })

    var storage = {
        surveyCode: '',
        isFirst: '1',
        surveyTree: '',
        addTre_t: '',
        survey: l._Lg('___surveyCode'),
        category: '-1',
        tableBySurvey: '',
        surveyid: '',
        _initIframe: true,
        _fCode: '',
        _flagIfram: true,
        _term: '',
        __reportid: '',
        potoShop: '',
        __repotID: ''
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
                storage.surveyTree = data
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
        },

        GetPicture: function() {
            _API._G('ReportManage.asmx/GetPicture', {
                surveyCode: storage.survey,
                reportID: storage.__repotID,
                termID: storage.termCount
            }, function(data) {
                console.log(data)
                storage.potoShop = data
                renderingDOM.potoShop()
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
                ct +=
                    '     <li class="_j_treeSelect" ' +
                    '          data-category="' + _val.FK_CATEGORY + '" ' +
                    '          data-code="' + _val.F_CODE + '"  ' +
                    '          data-survey="' + _val.FK_SURVEY + '">' +
                    '        ' + _val['F_CAPTION'] +
                    '     </li>'
            })
            return ct
        },

        serveryTree: function() {
            var _tree = storage.surveyTree.surveyTree
            var _container = ''
            var _title = '<div class="_j_prents css-treePrents">' + storage.surveyTree.surveyName + '<span class="selectInfor">请选择</span></div>'
            for (var i = 0; i < _tree.length; i++) {
                for (var key in _tree[i]) {
                    var ct = this.cycle(_tree[i][key])
                    _container = '<div class="_parentsTree"><h4>' + key + '</h4>' + _title + '<ul class="_parmis">' + ct + '</ul></div>'
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
            var _tree = storage.surveyTree.surveyTree
            var _container = this.cycle(_tree)
            var _title = '<div class="_j_prents css-treePrents">' + storage.surveyTree.surveyName + '<span class="selectInfor">请选择</span></div>'
            _title += '<ul class="_parmis">' + _container + '</ul>'
            storage.addTre_t.append(_title)
                // $('._j_inforReported').append(_title)
        },

        addSurveyTree: function() {
            var ct = ''
            var _tabel = storage.tableBySurvey.surveyTable
            var flag = true
            var reportid = ''
            for (var i = 0; i < _tabel.length; i++) {
                if (flag) {
                    reportid = _tabel[i].reportID
                    storage.__repotID = _tabel[i].reportID
                    flag = false
                }
                ct += '<div class="_moreInforTabel" data-reportid="' + _tabel[i].reportID + '">' + _tabel[i].reportName + '</div>'
            }
            $('._moreInfor').html('').append(ct)
            $('._moreInfor').find('._moreInforTabel:first').addClass('active')
                // reportid = $('._moreInfor').findreportidreportid('._moreInforTabel:first').data('reportid')
                // if ($('#reporteIframe').length !== 0) {
                //     if (storage._initIframe) {
                //         setTimeout(function() {
                //             $('#reporteIframe')[0].contentWindow.ins_displaySheet(false)
                //         }, 2000)
                //         storage._initIframe = false
                //     }
                //     $('#reporteIframe')[0].contentWindow.ins_sheetPanel(reportid, '15')
                //     setTimeout(function() {
                //         $('#reporteIframe')[0].contentWindow.ins_loadvalue(reportid, storage.termCount, storage._fCode)
                //     }, 2000);
                // }
        },

        createTerm: function() {
            var ct = '<select class="_termCounts">'
            storage._term.terms.forEach(function(_val) {
                ct += '<option data-term="' + _val.termID + '">' + _val.termName + '</option>'
            })
            storage.termCount = 1
            ct += '</select>'
            $('._term').append(ct)
        },

        potoShop: function() {
            var _view = ''
            var _minview = ''
            var flag = true
            storage.potoShop.picture.forEach(function(_val) {
                var _active = ''
                if (flag) {
                    _active = 'active'
                    flag = false
                }
                _view +=
                    '<li class="silder_panel ' + _active + ' clearfix">' +
                    '   <div class="f_l""><img src="' + _val.url + '"></div>' +
                    '</li>'

                _minview +=
                    '<li  class="' + _active + '">' +
                    '   <div><img src="' + _val.url + '"></div>' +
                    ' <p>' + _val.name + '</p>'
                ' </li>'
            })
            $('.silder_con').html('').append(_view)
            $('.silder_nav').html('').append(_minview)
            _tmss()
        }
    }

    // li.silder_panel


    // $(function() {
    // var _tmss = function() {
    //         var sWidth = $("#slider_name").width();
    //         var len = $("#slider_name .silder_panel").length;
    //         var index = 0;
    //         var picTimer;

    //         var btn = "<a class='prev'>Prev</a><a class='next'>Next</a>";
    //         $("#slider_name").append(btn);
    //         var _width = $('#slider').width()
    //         $("#slider_name .silder_con li").css('width', _width)
    //         $("#slider_name .silder_nav li").css({ "opacity": "0.6", "filter": "alpha(opacity=60)" }).mouseenter(function() {
    //             index = $("#slider_name .silder_nav li").index(this);
    //             showPics(index);
    //         }).eq(0).trigger("mouseenter");

    //         $("#slider_name .prev,#slider_name .next").css({ "opacity": "0.2", "filter": "alpha(opacity=20)" }).hover(function() {
    //             $(this).stop(true, false).animate({ "opacity": "0.6", "filter": "alpha(opacity=60)" }, 300);
    //         }, function() {
    //             $(this).stop(true, false).animate({ "opacity": "0.2", "filter": "alpha(opacity=20)" }, 300);
    //         });


    //         // Prev
    //         $("#slider_name .prev").click(function() {
    //             index -= 1;
    //             if (index == -1) { index = len - 1; }
    //             showPics(index);
    //         });

    //         // Next
    //         $("#slider_name .next").click(function() {
    //             index += 1;
    //             if (index == len) { index = 0; }
    //             showPics(index);
    //         });

    //         // 
    //         $("#slider_name .silder_con").css("width", sWidth * (len));

    //         // mouse 
    //         $("#slider_name").hover(function() {
    //             clearInterval(picTimer);
    //         }, function() {
    //             // picTimer = setInterval(function() {
    //             // 	showPics(index);
    //             // 	index++;
    //             // 	if(index == len) {index = 0;}
    //             // },3000); 
    //         }).trigger("mouseleave");

    //         // showPics
    //         function showPics(index) {
    //             var nowLeft = -index * sWidth;
    //             // $("#slider_name .silder_con").stop(true, false).animate({ "left": nowLeft }, 300);
    //             $("#slider_name .silder_con").css('left', nowLeft)

    //             $("#slider_name .silder_nav li").removeClass("current").eq(index).addClass("current");
    //             // $("#slider_name .silder_nav li").stop(true, false).animate({ "opacity": "0.5" }, 300).eq(index).stop(true, false).animate({ "opacity": "1" }, 300);
    //             $("#slider_name .silder_nav li").css('opacity', 1).eq(index).css('opacity', 1)
    //         }
    //     }
    // });

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