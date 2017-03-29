define("mapIntroduce", ['map', "jquery", "userservice", "chartInformations"], function(m, j, us, ch) {

    var sqlBuilder;

    function loadBuilter() {
        var filters = [{
            "id": "F_TERM",
            "label": "所属阶段",
            "type": "integer",
            "input": "select",
            "optgroup": "select",
            "placeholder": "-------",
            "values": {
                "1": "设计阶段-预研",
                "2": "设计阶段-实物调查",
                "3": "实施阶段",
                "4": "后扶阶段"
            },
            "operators": ["equal", "not_equal", "is_null", "is_not_null"]
        }, {
            "id": "F_BUILD_NO",
            "label": "幢号",
            "type": "double",
            "size": 5,
            "validation": {
                "min": 0,
                "step": 0.01
            },
            "data": {
                "class": "com.example.PriceTag"
            },
            "optgroup": "number"
        }, {
            "id": "F_CODE",
            "label": "编码",
            "type": "string",
            "input": "textarea",
            "operators": ["equal"],
            "size": 40,
            "rows": 1,
            "optgroup": "text"
        }];
        setTimeout(function() {
            sqlBuilder = new SqlBuilder('sql-builder', filters);

        }, 200)
    };

    /**
     * 左右图标详情信息 Dom 操作 
     **/
    $('body').on('click', 'button.introduceButton', function() {
        $()
        stroage.de_indiatorID = $(this).data('id')
        sendRequest.GetShowDetails()
        sendRequest.GetThemeAnalysis()
        loadBuilter()
    })

    $('body').on('click', '._theme', function() {
        if ($(this).hasClass('active')) return
        $('.intro-r, .intro-l').html('')
        $('._theme, ._reportShow ').removeClass('active')
        $(this).addClass('active')
        stroage.theme_indiatorID = $(this).data('id')
        sendRequest.GetThemeAnalysis()
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
        $('._theme, ._reportShow , ._reportShow-p p').removeClass('active')
        $(this).addClass('active')
            //     stroage.reportID = $(this).data('inid')
            //     sendRequest.GetReportShow()
    })


    $('.cp-oninter').on('click', function() {
        $('.cp-pointer').hide()
        $('.cp-pointer').eq($(this).data('onin')).show()
    })


    $('.addFiled button').on('click', function() {
        stroage.reportID = $('.reportID').data('id')
        sendRequest.GetTableField()
        $('.tableField').show()

    })

    $('body').on('click', '.field-itmes', function() {

        stroage.egfield += $(this).data('egfield') + ','

        var select = '<div class="select_cf">' + $(this).text() + '</div>'
        var option = '<option value="' + $(this).text() + '"> ' + $(this).text() + '</option>'
        $('.selcetInfo').append(select)
        $('.selectOn_:last').find('._filed').append(option)
        $('.tableField').hide()
        console.log(stroage.egfield)
    })

    $('._close').on('click', function() {
        $('.intro-l, .intro-r').html('')
        $('.cp-oninter').find('ul , li').remove()
        $('#controlPanel').hide()
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
        egfield: ''
    }


    /**
     *  请求
     **/

    var sendRequest = {
        GetShowDetails: function() {
            ch.api.getData('GetShowDetails', {
                indiatorID: stroage.de_indiatorID
            }, function(data) {
                console.log('data', data)
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
                console.log('data:', data)
            })
        },

        GetDicData: function() {
            // ch.api.getData('GetDicData', function() {
            //     egField: 
            // })
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
            stroage.tableField.forEach(function(_val) {
                var ct = '<li class="field-itmes" data-egField="' + _val.egField + '"> ' + _val.chField + '</li>'
                $('.tableField ul').append(ct)
            })
        }

    }
})