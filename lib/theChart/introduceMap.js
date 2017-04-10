define("mapIntroduce", ['map', "jquery", "userservice", "chartInformations", "sqlBuilder", "queryBuilder"], function(m, j, us, ch, sq, qb) {

    var sqlBuilder;

    function loadBuilter() {
        var filters = [{
            id: '0'
        }];
        sqlBuilder = new SqlBuilder('sql-builder')
        sqlBuilder.init(filters)
    };



    /**
     * 左右图标详情信息 Dom 操作 
     **/
    $('body').on('click', 'button.introduceButton', function() {
        $('#left-sidebar, #right-sidebar').addClass('closed')
        stroage.de_indiatorID = $(this).data('id')
        sendRequest.GetShowDetails()
        sendRequest.GetThemeAnalysis()
    })

    $('body').on('click', '._theme', function() {
        if ($(this).hasClass('active')) return
        $('.intro-r, .intro-l').html('')
        $('._theme, ._reportShow ').removeClass('active')
        $(this).addClass('active')
        stroage.theme_indiatorID = $(this).data('id')
        sendRequest.GetThemeAnalysis()
    })

    $('body').on('click', '.reportID', function() {
        loadBuilter()
    })

    $('._tbmLaber').on('click', function() {
        $('.cp-pointer').hide()
        $('.cp-pointer').eq($(this).data('onin')).show()
        if ($(this).hasClass('reportID')) {
            stroage.reportID = $(this).data('id')
        }
    })

    /**
     * 保留
     */
    $('body').on('click', '._reportShow', function() {
        $('._theme, ._reportShow ').removeClass('active')
        $(this).addClass('active')
            //     stroage.reportID = $(this).data('inid')
            //     sendRequest.GetReportShow()
    })
    $('body').on('click', '._reportShow-p p', function(e) {

        setTimeout(function() {
            $('#sheetFile')[0].contentWindow.ins_sheetPanel('11047', '15')

        }, 500)
        $('._theme, ._reportShow , ._reportShow-p p').removeClass('active')
        $(this).addClass('active')
            //     stroage.reportID = $(this).data('inid')
            //     sendRequest.GetReportShow()
    })


    $('.cp-oninter').on('click', function() {
        $('.cp-pointer').hide()
        $('.cp-pointer').eq($(this).data('onin')).show()
            //reportID 存储位置
        if ($(this).hasClass('reportID')) {
            stroage.reportID = $(this).data('id')
        }
    })

    $('._tableFieldclose span').on('click', function() {
        $('.tableField').hide()
    })

    $('.addFiled button').on('click', function() {
        sendRequest.GetTableField()
        $('.tableField').show()

    })

    $('body').on('click', '.field-itmes', function() {
        var filg = true
        var _tindex = $(this).data('index')
        var _color = ''

        if (stroage.arrayposts.includes(_tindex)) {
            return
        }

        stroage.arrayposts.push($(this).data('index'))


        switch (stroage.tableField[$(this).data('index')].indicatorType) {
            case '描述指标':
                _color = '#7ED321'
                break;

            case '数量指标':
                _color = '#E93F00'
                break;

            default:
                _color = '#0088EB'
                break;
        }
        stroage.egfield += $(this).data('egfield') + ','
        var select = '<div data-index="' + $(this).data('index') + '" style = "background-color: ' + _color + '" class="select_cf">' + $(this).text() + '</div>'
        var option = '<option value="' + $(this).text() + '"> ' + $(this).text() + '</option>'

        $('.selcetInfo').append(select)
        $('.selectOn_:last').find('._filed').append(option)
        $('.tableField').hide()

        stroage.fieldInfoData = []
        stroage.fields = []
        stroage._requertCount = 0
        $('.selcetInfo').find('div').each(function(_in) {
            sendRequest.GetFieldInfo($(this).data('index'), _in)
        })

    })

    $('._close').on('click', function() {
        $('.intro-l, .intro-r').html('')
        $('.cp-oninter').find('ul , li').remove()
        $('#controlPanel').hide()
        $('#left-sidebar, #right-sidebar').removeClass('closed')
    })

    $('.dataInquire').on('click', function() {
        $('.showFieldData').show()
    })

    $('.conditionrReset').on('click', function() {
        $('.showFieldData').hide()
        $('.selcetInfo').html('')
        $('._filed').html('')

    })

    $('.filedCondition div').on('click', function() {
        $('.filedCondition div').removeClass('active')
        $(this).addClass('active')
    })


    $('body').on('click', '.base1', function() {
        $('.__infors').hide();
        $('.zh-dark').show();
    })

    $('body').on('click', '.base2', function() {
        $('.__infors').hide();
        $('.sw-dark').show();

    })

    $('.confirmInformation button').on('click', function() {
        stroage.fieldInfoData = []
        stroage.fields = []
        stroage._requertCount = 0
        $('.selcetInfo').find('div').each(function(_in) {
            sendRequest.GetFieldInfo($(this).data('index'), _in)
                // $('#sql-builder').html('')
        })
    })

    $('._getsql').on('click', function() {
        $('.FieldDataloading').show()
        var sql = sqlBuilder.getSql()
        sendRequest.GetSearchResult(sql)
    })

    $('._reset').on('click', function() {
        var sql = sqlBuilder.reset()
        stroage.arrayposts = []
        $('.selcetInfo').html('')
        $('.showFieldDataTab').html('')
    })



    /**
     * 仓库
     **/

    var stroage = {
        chartData: '',
        de_indiatorID: '',
        introduceDATA: '',
        theme_indiatorID: '',
        reportID: '',
        tableField: '',
        egfield: '',
        fieldInfoData: [],
        fields: [],
        serchResultData: '',
        _requertCount: 0,
        arrayposts: []
    }


    /**
     *  请求
     **/

    var sendRequest = {
        GetShowDetails: function() {
            ch.api.getData('GetShowDetails', {
                indiatorID: stroage.de_indiatorID
            }, function(data) {
                stroage.introduceDATA = data.showDetails
                $('#controlPanel').show()
                embellish.introduce()
            })
        },

        GetThemeAnalysis: function() {
            ch.api.getData('GetThemeAnalysis', {
                themeID: stroage.theme_indiatorID || '0',
                surveyCode: ch.cl.surveyCode,
                isNextLevel: '0'
            }, function(data) {
                stroage.chartData = data.indiator
                embellish.informations()
            })
        },

        GetReportShow: function() {
            ch.api.getData('GetReportShow', {
                reportID: stroage.reportID,
                termID: ch.tl.termID,
                surveyCode: ch.cl.surveyCode
            })
        },


        GetTableField: function() {
            ch.api.getData('GetTableField', {
                reportID: stroage.reportID
            }, function(data) {
                stroage.tableField = data.tableField
                embellish.fieldList()
            })
        },

        // GetDicData: function() {
        // ch.api.getData('GetDicData', function() {
        //     egField: 
        // })
        // },
        GetFieldInfo: function(_vs, _in) {
            ch.api.getData('GetFieldInfo', {
                egFields: stroage.tableField[_vs].egField
            }, function(data) {
                stroage._requertCount++
                    switch (data.fieldInfo[0].type) {
                        case 'string':
                            data.fieldInfo[0].input = 'textarea'
                            data.fieldInfo[0].rows = 1
                            data.fieldInfo[0].optgroup = 'text'
                            break;

                        case 'integer':
                            data.fieldInfo[0].input = 'select'
                            data.fieldInfo[0].placeholder = '-----'
                            break;

                        case 'double':
                            data.fieldInfo[0].size = 5
                            data.fieldInfo[0].data = 'com.example.PriceTag'
                            data.fieldInfo[0].optgroup = 'number'
                            data.fieldInfo[0].validation = {
                                "min": 0,
                                "step": 0.01
                            }

                            break;

                        default:
                            break;

                    }
                data.fieldInfo[0].operators = ["equal", "not_equal", "is_null", "is_not_null"]
                stroage.fieldInfoData.push(data.fieldInfo[0])

                if ($('.select_cf').length == stroage._requertCount) {
                    sqlBuilder.setFilters(stroage.fieldInfoData)
                }
                stroage.fields.push(data.fieldInfo[0].id)
            })
        },


        GetSearchResult: function(sql) {
            ch.api.getData('GetSearchResult', {
                reportID: stroage.reportID,
                fields: stroage.fields.join(','),
                queryCondition: sql,
                summaryCondition: '',
                start: 0,
                limit: 20
            }, function(data) {
                $('.FieldDataloading').hide()
                stroage.serchResultData = data.searchResult
                embellish.showFieldData()
                    // $('.showFieldData').html('')
            })
        }
    }


    /**
     *  渲染详情介绍页面数据
     * **/

    var embellish = {

        introduce: function() {
            var themeAnalysis = ''
            console.log(stroage.introduceDATA)
            for (var key in stroage.introduceDATA) {

                if (typeof stroage.introduceDATA[key] === 'object' && key !== 'reportShow') {
                    stroage.introduceDATA[key].forEach(function(_val) {
                        themeAnalysis = '<li class="_theme"  data-id=" ' + _val.id + '">' + _val.name + '</li>'
                        $('.' + key).append(themeAnalysis)

                    })
                } else if (typeof stroage.introduceDATA[key] === 'object' && key === 'reportShow') {
                    // var flag = true
                    stroage.introduceDATA[key].forEach(function(_val) {
                        if (_val.pid === -1) {
                            themeAnalysis = '<li data-inid= "' + _val.reportID + '" class="_reportShow-p base' + _val.id + '"><p>' + _val.name + '</p></li>'
                            $('.' + key).append(themeAnalysis)
                        }
                    })
                    stroage.introduceDATA[key].forEach(function(_val) {

                        if ($('.base' + _val.pid)) {

                            if ($('.base' + _val.pid).find('ul').length <= 0) {
                                $('.base' + _val.pid).append('<ul></ul>')
                            }

                            $('.base' + _val.pid).find('ul').append('<li class="_reportShow base' + _val.id + '"  data-inid= "' + _val.reportID + '">' + _val.name + '</li>')
                        }
                    })
                } else {
                    $('.' + key).attr('data-id', stroage.introduceDATA[key])
                }

            }
        },

        // 处理数据，生成详情页对应信息

        informations: function() {
            stroage.chartData.forEach(function(_val) {
                var sizeType = ''
                var location = ''
                    /**
                     * 遍历判断绘制于左右面板， 绘制图形大小
                     * */
                if (_val.indiatorInfo.location == 'left') {
                    location = '.intro-l'
                } else {
                    location = '.intro-r'
                }

                if (_val.indiatorInfo.size_type === 0) {
                    sizeType = 'type-big'
                } else if (_val.indiatorInfo.size_type === 1) {
                    sizeType = 'type-middle'
                } else if (_val.indiatorInfo.size_type === 2) {
                    sizeType = 'type-small'
                }

                var is_map = _val.indiatorInfo.is_map === 1 ? '_isMap' : 'hide'
                $(location).append("<div class='information " + sizeType + "-parent'><div data-index= " + _val.indiatorInfo.id + " class='mouseMove " + sizeType + " introdraw_" + _val.indiatorInfo.id + " '></div></div>");

                switch (_val.indiatorInfo.type) {
                    case 'Text':
                        draw.text(_val, ".draw_" + _val.indiatorInfo.id)
                        break;
                    default:
                        if (typeof ch.dr._default(_val.indiatorInfo.type) === 'function') {
                            var __default__ = ch.dr._default(_val.indiatorInfo.type)
                            if (_val.indiatorInfo.type === 'Pie_MultiLevelPie') {}
                            var _tsDefault = __default__(_val.indiatorData, _val.indiatorInfo.name, _val.indiatorInfo.size_type)
                            ch.dr.echart(_tsDefault, ".introdraw_" + _val.indiatorInfo.id)
                        }

                        break;
                }

            })
        },


        fieldList: function() {
            stroage.tableField.forEach(function(_val, _in) {

                // var ct = '<li data-indicatorType = ' + _val.indicatorType + '  class="field-itmes" data-egField="' + _val.egField + '"> ' + _val.chField + '</li>'
                var ct = '<li data-index = ' + _in + '  class="field-itmes" > ' + _val.chField + '</li>'
                $('.tableField ul').append(ct)
            })
        },


        // 处理列表数据

        showFieldData: function() {
            $('.showFieldDataTab').html('')
            var ct = '<table  align="center"><tr class="_column">'
            stroage.serchResultData.column.forEach(function(_val) {
                ct += '<th>' + _val + '</th>'
            })
            ct += '</tr> '

            stroage.serchResultData.data.forEach(function(_vals) {
                ct += '<tr>'
                _vals.forEach(function(_vs) {

                    ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
                })

                ct += '</tr>'
            })

            ct += '<table>'

            $('.showFieldDataTab').append(ct).show()
        }

    }

    return {
        _s: stroage,
        load: loadBuilter
    }
})