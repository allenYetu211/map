define('dataAdmin', ['jquery', 'map', 'chartInformations'], function(jq, map, ch) {

    // require(["markercluster"], function(r) {
    //     // r.MARKER.init("", { defCenter:[29, 100], defZoom:4});
    //     r.MARKER.init("", "");
    //     console.log(r)
    // });

    /**
     * 操作Dom
     * */
    $('body').on('click', '.tree-branch', function() {
        $(this).next().slideToggle().end().toggleClass('open')
    })

    $('body').on('click', '.tree-p-branch li', function() {
        $('.tree-p-branch li').removeClass('active')
        $(this).addClass('active')


        stroage.showDataCount = $('.numberCount ').find('input').val()
        stroage.newDataCount = $('.selectIn').find('input').val()
        stroage.reportid = $(this).data('reportid')
        stroage.categoriesid = $(this).data('categoriesid')

        sendRequest.GetReportData()

        $('#map').hide()
        $('#dataView').show()
        $('.module-md div').removeClass('active')
        $('.md-d').addClass('active')
        $('.module-features').addClass('open')

    })


    // $('.selectPop').on('click', function() {
    //     $('.SelectPopup').
    // })

    $('.outputExcle').on('click', function() {
        sendRequest.ExportReportData()
    })

    $('.next-all').on('click', function() {
        stroage.newDataCount = stroage.Counts
        $('.selectIn ').find('input').val(stroage.Counts)
        pageSwitch.switch()
    })


    $('.next').on('click', function() {
        stroage.newDataCount++
            if (stroage.newDataCount >= stroage.Counts) {
                stroage.newDataCount = stroage.Counts
            }

        $('.selectIn ').find('input').val(stroage.newDataCount)
        pageSwitch.switch()
    })



    $('.prev-all').on('click', function() {
        stroage.newDataCount = 1
        $('.selectIn ').find('input').val(1)
        pageSwitch.switch()
    })


    $('.prev').on('click', function() {
        stroage.newDataCount--
            if (stroage.newDataCount <= 1) {
                stroage.newDataCount = 1
            }
        $('.selectIn ').find('input').val(stroage.newDataCount)
        pageSwitch.switch()
    })

    /**
     * 处理页面切换
     */

    var pageSwitch = {

        switch: function() {
            stroage.showDataCount = $('.numberCount ').find('input').val()
            sendRequest.GetReportData()
        }

    }


    /**
     *  数据存储仓库
     * */

    var stroage = {
        manage: '',
        dataView: '',
        reportid: '',
        categoriesid: '',
        showDataCount: '',
        newDataCount: '',
        Counts: ''
    }

    /**
     * 获取数据
     */

    var sendRequest = {
        GetSurveyTable: function() {
            ch.api.getDataManage('GetSurveyTable', {}, function(data) {
                stroage.manage = data.surveyTable
                embellish.dAdminTree()
            })
        },


        GetReportData: function() {
            ch.api.getDataManage('GetReportData', {
                reportID: stroage.reportid,
                categoriesID: stroage.categoriesid,
                start: stroage.showDataCount * (stroage.newDataCount - 1),
                limit: stroage.showDataCount * stroage.newDataCount
            }, function(data) {
                stroage.dataView = data.searchResult
                embellish.dataView()
            })
        },

        ExportReportData: function() {
            ch.api.getDataManage('ExportReportData', {
                reportID: stroage.reportid,
                categoriesID: stroage.categoriesid
            }, function(data) {
                console.log(data)
            })
        }
    }

    /**
     * 渲染页面
     */

    var embellish = {
        dAdminTree: function() {


            var sm = stroage.manage

            for (var key in sm) {
                var ct = '<div class="tree-parents"> <div class="tree-radius"> <p>' + key + '</p> <div class="tree-bg">'

                for (var lat in sm[key]) {

                    var _u = '<div class="tree-p-branch">'
                    _u += '<p class="tree-branch">' + lat + '</p> <ul>'

                    sm[key][lat].forEach(function(_val, _in) {
                        _u += '<li data-reportid=" ' + _val.reportID + '" data-categoriesid=" ' + _val.categoriesID + '">' + _val.reportName + '</li>'
                    })
                    _u += '</ul> </div>'
                    ct += _u

                };
                ct += '</div></div></div>'

                $('.dAdminTree').append(ct)
            };

        },


        dataView: function() {
            $('.isShow span').html('').append(stroage.dataView.total)
            var _b = stroage.dataView.total / stroage.showDataCount
            stroage.Counts = _b < 1 ? 1 : Math.ceil(_b)

            $('.selectIn span').html('').append(stroage.Counts)
                // stroage.dataView
            $('.dataView-Pages').html('')
            var ct = '<table  align="center"><tr class="_column">'

            stroage.dataView.column.forEach(function(_val) {
                ct += '<th>' + _val + '</th>'
            })
            ct += '</tr> '

            stroage.dataView.data.forEach(function(_vals) {
                ct += '<tr>'
                _vals.forEach(function(_vs) {

                    ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
                })

                ct += '</tr>'
            })

            ct += '<table>'

            $('.dataView-Pages').append(ct)
        }

    }


    /**
     * 返回接口
     * */

    // return {

    // }

    /**
     * 页面初始化
     */

    sendRequest.GetSurveyTable()
})