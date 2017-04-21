define('dataAdmin', ['jquery', 'map', 'chartInformations', 'mapIntroduce', 'translatePopup'], function(jq, map, ch, mi, tl) {

    // require(["markercluster"], function(r) {
    //     // r.MARKER.init("", { defCenter:[29, 100], defZoom:4});
    //     r.MARKER.init("", "");
    //     console.log(r)`
    // });

    // mi.load()
    /**
     * 操作Dom
     * */

    // 执行拖拽部分
    $('._j_translate')._translate_($('._a_translate'))

    $('.dataView-Pages').on('scroll', function(e) {
        $('._j_translate').css({
            top: e.currentTarget.scrollTop
        })
    })

    $('body').on('click', '.tree-branch', function() {
        $(this).next().slideToggle().end().toggleClass('open')
    })

    $('.module-md div.md-m').on('click', function() {
        $('.module-md div').removeClass('active')
        $(this).addClass('active')
        $('.module-features').removeClass('open')
        $('#dataView').hide()
        $('#map').show()
    })

    $('.module-md div.md-d').on('click', function() {
        $('.module-md div').removeClass('active')
        $(this).addClass('active')
        $('.module-features').addClass('open')
        $('#dataView').show()
        $('#map').hide()
    })

    $('body').on('click', '.tree-p-branch li', function() {

        $('.tree-p-branch li').removeClass('active')
        $(this).addClass('active')


        storage.showDataCount = $('.numberCount ').find('input').val()
        storage.newDataCount = $('.selectIn').find('input').val()
        mi._s.reportID = storage.reportid = $(this).data('reportid')
        storage.categoriesid = $(this).data('categoriesid')

        sendRequest.GetReportData()

        $('#map').hide()
        $('#dataView').show()
        $('.module-md div').removeClass('active')
        $('.md-d').addClass('active')
        $('.module-features').addClass('open')

    })
    $('body').on('click', '.dataView-Pages td', function() {
        if ($(this).parents('tr').hasClass('active')) {
            $(this).parents('tr').removeClass('active')
        } else {
            $('.dataView-Pages tr').removeClass('active')
            $(this).parents('tr').addClass('active')
        }

    })

    $('._closePop').on('click', function() {
        $('.SelectPopup').hide()

    })


    $('.selectPop').on('click', function() {
        mi.load()
        $('.SelectPopup').show()
    })

    $('.outputExcle').on('click', function() {
        sendRequest.ExportReportData()
    })

    $('.next-all').on('click', function() {
        storage.newDataCount = storage.Counts
        $('.selectIn ').find('input').val(storage.Counts)
        pageSwitch.switch()
    })


    $('.next').on('click', function() {
        storage.newDataCount++
            if (storage.newDataCount >= storage.Counts) {
                storage.newDataCount = storage.Counts
            }

        $('.selectIn ').find('input').val(storage.newDataCount)
        pageSwitch.switch()
    })



    $('.prev-all').on('click', function() {
        storage.newDataCount = 1
        $('.selectIn ').find('input').val(1)
        pageSwitch.switch()
    })


    $('.prev').on('click', function() {
        storage.newDataCount--
            if (storage.newDataCount <= 1) {
                storage.newDataCount = 1
            }
        $('.selectIn ').find('input').val(storage.newDataCount)
        pageSwitch.switch()
    })



    /**
     * 处理页面切换
     */

    var pageSwitch = {

        switch: function() {
            storage.showDataCount = $('.numberCount ').find('input').val()
            sendRequest.GetReportData()
        }

    }


    /**
     *  数据存储仓库
     * */

    var storage = {
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
                storage.manage = data.surveyTable
                embellish.dAdminTree()
            })
        },


        GetReportData: function() {
            ch.api.getDataManage('GetReportData', {
                reportID: storage.reportid,
                categoriesID: storage.categoriesid,
                start: storage.showDataCount * (storage.newDataCount - 1),
                limit: storage.showDataCount * storage.newDataCount
            }, function(data) {
                storage.dataView = data.searchResult
                embellish.dataView()
            })
        },

        ExportReportData: function() {
            ch.api.getDataManage('ExportReportData', {
                reportID: storage.reportid,
                categoriesID: storage.categoriesid
            }, function(data) {
                console.log(data)
            })
        },

        // 获取任务单元农户
        GetCategory: function() {
            ch.api.getDataManage('GetCategory', '', function(data){
                console.log(data)
            })
        }
    }
    sendRequest.GetCategory();

    /**
     * 渲染页面
     */

    var embellish = {
        dAdminTree: function() {


            var sm = storage.manage

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
            $('.isShow span').html('').append(storage.dataView.total)
            var _b = storage.dataView.total / storage.showDataCount
            storage.Counts = _b < 1 ? 1 : Math.ceil(_b)

            $('.selectIn span').html('').append(storage.Counts)
                // storage.dataView
            $('.dataView-Pages').html('')
            var ct = '<table  align="center"><tr class="_column _j_translate _Tr-translate">'

            storage.dataView.column.forEach(function(_val) {
                ct += '<th>' + _val + '</th>'
            })
            ct += '</tr> '

            storage.dataView.data.forEach(function(_vals) {
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