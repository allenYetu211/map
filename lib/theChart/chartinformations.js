define("chartInformations", ['map', "jquery", "userservice"], function(map, j, us) {


    /**
     * Dom 操作集
     */

    $('.zoomout').on('click', function() {
        map.Ly.enlarge()
    })

    $('.zoomin').on('click', function() {
        map.Ly.narrow()
    })
    $('body').on('click', '._isMap', function() {
            drawOn.draw($(this).data('index'))
        })
        /**
         * 正则匹配key值
         */

    function _getValue(item) {
        var _key = Object.keys(item).find(function(k) {
            return /F_TYPE/.test(k)
        })
        return item[_key]
    }

    /**
     * 用户权限
     */

    var userPermissions = {
            surveyCode: '',
            surveyLevel: ''
        }
        /**
         * 阶段列表
         */
    var InvestigationStage = {
            list: ''
        }
        /**
         * 仓库存处数据信息。
         */
    var storage = {
            chartData: ''
        }
        /**
         *   api 请求地址
         * 
         * */
    var api = {
        getData: function(address, theInput, fn) {
            var theInput_ = theInput || ''
            $.ajax({
                type: 'POST',
                url: "http://122.224.94.108:8002/THService/DataShow.asmx/" + address,
                data: theInput_,
                contentType: "application/x-www-form-urlencoded",
                success: function(data) {
                    var translateData = JSON.parse(data)
                    switch (address) {
                        case 'UserLogin':
                            map.Ly.addTileLayer('http://124.207.115.117:8089/ReadTile.ashx?Layer=', 'D:\\\\ZJDATA\\\\切片数据\\\\gask_xgt')
                            userPermissions.surveyCode = translateData.surveyInfo.surveyCode
                            userPermissions.surveyLevel = translateData.surveyInfo.surveyLevel
                            userPermissions.userID = translateData.userID
                            sendRequest.GetTerm()
                            break;

                        case 'GetTerm':
                            InvestigationStage.terms = translateData.terms
                            sendRequest.GetIndicators()
                            break;

                        case 'GetIndicators':
                            storage.chartData = translateData.indiator
                            toDealWith.tsData()
                            break;
                        default:
                            console.log('输入的信息有误')
                            break;
                    }
                },
                erroer: function(error) {
                    console.log('error:', error)
                }
            })
        }
    }

    /**
     * 用户登录
     */
    $('._login').on('click', function() {
        var user = $('.mapUser').val()
        var pasw = $('.mapPasw').val()
        pasw = md5('123456')
        var _request = {
            user: 'liufang',
            pasw: pasw
        }
        sendRequest.UserLogin(_request)
    })

    /**
     * 发送请求
     */

    var sendRequest = {
        UserLogin: function(req) {
            api.getData('UserLogin', {
                userName: req.user,
                userPwd: req.pasw
            })
        },



        GetTerm: function() {
            api.getData('GetTerm')
        },



        GetIndicators: function() {
            console.log(InvestigationStage.terms)
            api.getData('GetIndicators', {
                termID: InvestigationStage.terms[0].termID,
                surveyCode: userPermissions.surveyCode,
                isNextLevel: '0' // 测试默认为0
            })
        },


        DrawMap: function(index) {
            api.getData('GetIndicators', {
                indicatorID: index,
                level: userPermissions.surveyLevel,
                code: userPermissions.surveyCode
            }, function() {



            })
        }
    }

    /**
     * 处理数据
     */
    var toDealWith = {
        tsData: function() {
            for (var i = 0; i < storage.chartData.length; i++) {
                var sizeType = ''
                var location = ''
                var _t = storage.chartData[i]

                /**
                 * 遍历判断绘制于左右面板， 绘制图形大小
                 * */
                if (_t.indiatorInfo.location == 'left') {
                    location = '.left-cnj'
                } else {
                    location = '.right-cnj'
                }

                if (_t.indiatorInfo.size_type === 0) {
                    sizeType = 'type-big'
                } else if (_t.indiatorInfo.size_type === 1) {
                    sizeType = 'type-middle'
                } else if (_t.indiatorInfo.size_type === 2) {
                    sizeType = 'type-small'
                }
                var is_map = _t.indiatorInfo.is_map === 1 ? '_isMap' : 'hide'
                $(location).append("<div class='information " + sizeType + "-parent'><button data-index=" + _t.indiatorInfo.id + " class=" + is_map + ">下一级</button> <a target='_blank' href='" + _t.indiatorInfo.id + "'></a><div data-index= " + _t.indiatorInfo.id + " class='mouseMove " + sizeType + " draw_" + _t.indiatorInfo.id + " '></div></div>");

                switch (_t.indiatorInfo.type) {
                    case 'Text':
                        draw.text(_t, ".draw_" + _t.indiatorInfo.id)
                        break;
                    default:
                        if (typeof draw._default(_t.indiatorInfo.type) === 'function') {
                            var __default__ = draw._default(_t.indiatorInfo.type)
                            var _tsDefault = __default__(_t.indiatorData, _t.indiatorInfo.name, _t.indiatorInfo.size_type)
                            draw.echart(_tsDefault, ".draw_" + _t.indiatorInfo.id)
                        }

                        break;
                }
            }
        }
    }

    //

    /**
     * 处理数据，渲染面板图表
     */
    var draw = {
        text: function(_data, _pClass) {
            var _daInfor = _data.indiatorInfo
            $(_pClass).append('<div class="typeText"><span>' + _daInfor.name + '</span></div>')
            _data.indiatorData.forEach(function(_val) {
                var high_lighted = _val.is_show == '1' ? 'class = "highlighted"' : ''
                $(_pClass).append('<div class="typeText"><span>' + _val.caption + '</span><span ' + high_lighted + '>' + _val.value + '</span></div>')
            })
        },
        echart(_data, _target) {
            var echart = echarts.init($(_target)[0]);
            echart.setOption(_data);
        },
        _default: function(type) {
            switch (type) {
                /**
                 * 百分比仪表图
                 * */
                case 'Dashboard_PercentDashboard':
                    return function(raw, name, sizeType) {
                        function conversion() {
                            var _p = _getValue(raw.data[1]) / _getValue(raw.data[0])
                            var _s = _p.toFixed(2) * 100
                            return _s
                        }
                        if (raw) {
                            switch (sizeType) {
                                case 0:
                                    return {
                                        tooltip: {
                                            formatter: "{a} <br/>{b} : {c}%",
                                            confine: true,
                                        },
                                        toolbox: {
                                            feature: {
                                                restore: {},
                                                saveAsImage: {}
                                            }
                                        },
                                        detail: {
                                            shadowColor: '#333', //默认透明
                                            offsetCenter: ['0%', '60%'], // x, y，单位px
                                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                                fontWeight: 'bolder',
                                                fontSize: 16,
                                                color: 'rgba(96,125,139,0.8)',
                                            },
                                            formatter: '{value}%'
                                        },
                                        series: [{
                                            splitNumber: 10,
                                            name: raw['indicatorData'][0].data.lable,
                                            type: 'gauge',
                                            data: [{ value: conversion() }]
                                        }],
                                        color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                    }
                                    break;

                                case 1:
                                    return {
                                        title: {
                                            text: name,
                                            subtext: '',
                                            x: 'left',
                                            left: 10,
                                            top: 10,
                                            textAlign: 'left',
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#03538D',
                                                fontSize: 12,
                                            }
                                        },
                                        tooltip: {
                                            formatter: "{a} <br/>{b} : {c}%",
                                            confine: true,
                                        },
                                        toolbox: {
                                            show: false,
                                            feature: {
                                                restore: {},
                                                saveAsImage: {}
                                            }
                                        },

                                        series: [{
                                            name: name,
                                            type: 'gauge',
                                            pointer: {
                                                width: 3,
                                                shadowBlur: 5
                                            },
                                            splitNumber: 5,
                                            axisLine: { // 坐标轴线
                                                lineStyle: { // 属性lineStyle控制线条样式
                                                    width: 5,
                                                    color: [
                                                        [0.2, 'rgba(233,30,99,1)'],
                                                        [0.8, 'rgba(33,150,243,1)'],
                                                        [1, 'rgba(76,175,80,0.8)']
                                                    ],
                                                },
                                            },
                                            axisTick: { // 坐标轴小标记
                                                length: 8, // 属性length控制线长
                                                lineStyle: { // 属性lineStyle控制线条样式
                                                    color: '#999',
                                                    shadowColor: '#fff', //默认透明
                                                    shadowBlur: 1,
                                                    width: 1
                                                }
                                            },
                                            axisLabel: {
                                                textStyle: {
                                                    color: '#999',
                                                    fontSize: 10,
                                                }

                                            },
                                            splitLine: { // 分隔线
                                                length: 12, // 属性length控制线长
                                                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                                                    width: 2,
                                                }
                                            },
                                            pointer: {
                                                width: 3,
                                                length: '80%',
                                            },
                                            itemStyle: {
                                                normal: {
                                                    color: 'rgba(244,32,18,1)',
                                                },
                                            },
                                            detail: {
                                                // backgroundColor: 'rgba(30,144,255,0.8)',
                                                // borderWidth: 1,
                                                // borderColor: '#fff',
                                                shadowColor: '#333', //默认透明
                                                // shadowBlur: 5,
                                                offsetCenter: ['0%', '60%'], // x, y，单位px
                                                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                                    fontWeight: 'bolder',
                                                    fontSize: 16,
                                                    color: 'rgba(96,125,139,0.8)',
                                                },
                                                formatter: '{value}%'
                                            },
                                            color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
                                            data: [{ value: conversion() }]
                                        }],

                                    }
                                    break;

                                default:
                                    console.log('未匹配到')
                                    break;
                            }

                        }
                    }
                    break;
                    /**
                     * 柱状图
                     * */
                case 'Column_CustomAxisLabel3':
                    return function(raw, name, sizeType) {
                        if (raw) {
                            function _getAxig(_type, attr) {
                                return raw['indicatorData'].reduce(function(arr, item) {
                                    var _items = []
                                    for (let i = 0; i < item['data'].length; i++) {
                                        for (let k = 0; k < item['data'][i][_type].length; k++) {
                                            if (item['data'][i][_type][k][attr] !== undefined) {
                                                _items.push(item['data'][i][_type][k][attr])
                                            }
                                        }
                                    }
                                    return Array.from(new Set(arr.concat(_items)))
                                }, [])
                            }


                            function Dashboard() {
                                var contain = []

                                var _stack = ''
                                for (let i = 0; i < raw.length; i++) {
                                    var _data = raw[i]['data']
                                    _data.reduce(function(c, item, idx) {
                                        var _rawItem = raw[i]
                                        if (c.length > idx) {
                                            var _curr = c[idx]
                                            _curr['data'].push(_getValue(_rawItem['data'][idx]['data'][0]))
                                        } else {
                                            c[idx] = {
                                                name: _rawItem['data'][idx]['other'][0]['F_NAME'],
                                                stack: _rawItem.stack,
                                                type: 'bar',
                                                data: [_getValue(_rawItem['data'][idx]['data'][0])]
                                            }
                                        }

                                        return c
                                    }, contain)
                                }
                                return contain
                            }
                            switch (sizeType) {
                                case 0:
                                    return {
                                        legend: {
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(_getValue(item.data[0].data[0]))
                                            }, [])
                                        },
                                        title: {
                                            text: name,
                                            subtext: '',
                                            x: 'left',
                                            left: 10,
                                            top: 10,
                                            textAlign: 'left',
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#03538D',
                                                fontSize: 12,
                                            }
                                        },
                                        tooltip: {
                                            trigger: 'axis',
                                            confine: true,
                                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                            }
                                        },
                                        // legend: {
                                        //   data: _getAxig('other', 'F_NAME')
                                        // },
                                        grid: {
                                            top: '25%',
                                            left: '0%',
                                            right: '0%',
                                            bottom: '10%',
                                            containLabel: true
                                        },
                                        xAxis: [{
                                            type: 'category',
                                            axisLine: {
                                                show: true,
                                                lineStyle: {
                                                    color: '#d1d1d1',
                                                    width: 1,
                                                },
                                            },
                                            axisTick: {
                                                show: false,
                                            },
                                            axisLabel: {
                                                margin: 5,
                                                textStyle: {
                                                    color: '#8e8e8e',
                                                    fontSize: 10
                                                }
                                            },
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(item.stack)
                                            }, [])
                                        }],
                                        yAxis: [{
                                            type: 'value',
                                            axisLine: {
                                                show: false
                                            },
                                            axisTick: {
                                                show: false
                                            },
                                            axisLabel: {
                                                inside: true,
                                                interval: 1,
                                                margin: 5,
                                                textStyle: {
                                                    color: '#D4D4D4',
                                                    fontSize: 10
                                                }
                                            },
                                            splitLine: {
                                                lineStyle: {
                                                    color: '#eaeaea',
                                                    width: 0.5,
                                                },
                                            },
                                        }],
                                        series: Dashboard(),
                                        color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                    }
                                    break;

                                case 1:
                                    return {
                                        title: {
                                            text: name,
                                            subtext: '',
                                            x: 'left',
                                            left: 10,
                                            top: 10,
                                            textAlign: 'left',
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#03538D',
                                                fontSize: 12,
                                            }
                                        },
                                        tooltip: {
                                            trigger: 'axis',
                                            confine: true,
                                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                            }
                                        },
                                        legend: {
                                            orient: 'vertical',
                                            left: '0',
                                            top: '0',
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#999',
                                                fontSize: 12,
                                            },
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(_getValue(item.data[0].data[0]))
                                            }, [])
                                        },
                                        grid: {
                                            top: '25%',
                                            left: '0%',
                                            right: '0%',
                                            bottom: '10%',
                                            containLabel: true
                                        },
                                        xAxis: [{
                                            type: 'category',
                                            axisLine: {
                                                show: true,
                                                lineStyle: {
                                                    color: '#d1d1d1',
                                                    width: 1,
                                                },
                                            },
                                            axisTick: {
                                                show: false,
                                            },
                                            axisLabel: {
                                                margin: 5,
                                                textStyle: {
                                                    color: '#8e8e8e',
                                                    fontSize: 10
                                                }
                                            },
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(item.stack)
                                            }, [])
                                        }],
                                        yAxis: [{
                                            type: 'value',
                                            axisLine: {
                                                show: false
                                            },
                                            axisTick: {
                                                show: false
                                            },
                                            axisLabel: {
                                                inside: true,
                                                interval: 1,
                                                margin: 5,
                                                textStyle: {
                                                    color: '#D4D4D4',
                                                    fontSize: 10
                                                }
                                            },
                                            splitLine: {
                                                lineStyle: {
                                                    color: '#eaeaea',
                                                    width: 0.5,
                                                },
                                            },
                                        }],
                                        series: Dashboard(),
                                        barGap: '0%',
                                        barCategoryGap: '50%',
                                        barMaxWidth: '30%',
                                        color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                    }
                                    break;

                            }

                        }
                    }
                    break;

                    /**
                     * 折线图
                     */
                case 'Line_FlashingLineChart':
                    return function(raw, name, sizeType) {
                        if (raw) {
                            function _getAxig(_type, attr) {
                                return raw.reduce(function(arr, item) {
                                    var _items = []
                                    for (let i = 0; i < item['data'].length; i++) {
                                        for (let k = 0; k < item['data'][i][_type].length; k++) {
                                            if (item['data'][i][_type][k][attr] !== undefined) {
                                                _items.push(item['data'][i][_type][k][attr])
                                            }
                                        }
                                    }
                                    return Array.from(new Set(arr.concat(_items)))
                                }, [])
                            }

                            function Dashboard() {
                                var contain = []
                                var conso = []
                                var _stack = ''
                                var newconso = []
                                for (let i = 0; i < raw.length; i++) {

                                    conso = []
                                    var _data = raw[i]
                                    _data['data'].reduce(function(_arr, item) {
                                        conso.push(_getValue(item['data'][0]))
                                    }, conso)

                                    newconso.push({
                                        name: raw[i].stack,
                                        type: 'line',
                                        stack: raw[i].stack,
                                        data: conso
                                    })
                                }
                                return newconso
                            }
                            switch (sizeType) {
                                case 0:
                                    return {
                                        legend: {
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(_getValue(item.data[0].data[0]))
                                            }, [])
                                        },
                                        title: {
                                            text: name,
                                            subtext: '',
                                            x: 'left',
                                            left: 10,
                                            top: 10,
                                            textAlign: 'left',
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#03538D',
                                                fontSize: 12,
                                            }
                                        },
                                        tooltip: {
                                            trigger: 'axis',
                                            confine: true,
                                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                            }
                                        },
                                        legend: {
                                            data: _getAxig('other', 'F_NAME')
                                        },
                                        grid: {
                                            top: '25%',
                                            left: '0%',
                                            right: '0%',
                                            bottom: '10%',
                                            containLabel: true
                                        },
                                        xAxis: [{
                                            type: 'category',
                                            axisLine: {
                                                show: true,
                                                lineStyle: {
                                                    color: '#d1d1d1',
                                                    width: 1,
                                                },
                                            },
                                            axisTick: {
                                                show: false,
                                            },
                                            axisLabel: {
                                                margin: 5,
                                                textStyle: {
                                                    color: '#8e8e8e',
                                                    fontSize: 10
                                                }
                                            },
                                            data: _getAxig('other', 'F_NAME')
                                        }],
                                        yAxis: [{
                                            type: 'value',
                                            axisLine: {
                                                show: false
                                            },
                                            axisTick: {
                                                show: false
                                            },
                                            axisLabel: {
                                                inside: true,
                                                interval: 1,
                                                margin: 5,
                                                textStyle: {
                                                    color: '#D4D4D4',
                                                    fontSize: 10
                                                }
                                            },
                                            splitLine: {
                                                lineStyle: {
                                                    color: '#eaeaea',
                                                    width: 0.5,
                                                },
                                            },
                                        }],
                                        series: Dashboard(),
                                        color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                    }
                                    break;

                                case 1:
                                    return {
                                        title: {
                                            text: name,
                                            subtext: '',
                                            x: 'left',
                                            left: 10,
                                            top: 10,
                                            textAlign: 'left',
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#03538D',
                                                fontSize: 12,
                                            }
                                        },
                                        tooltip: {
                                            trigger: 'axis',
                                            confine: true,
                                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                            }
                                        },
                                        legend: {
                                            orient: 'vertical',
                                            left: '0',
                                            top: '0',
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#999',
                                                fontSize: 12,
                                            },
                                            data: _getAxig('other', 'F_NAME')
                                        },
                                        grid: {
                                            top: '25%',
                                            left: '0%',
                                            right: '0%',
                                            bottom: '10%',
                                            containLabel: true
                                        },
                                        xAxis: [{
                                            type: 'category',
                                            axisLine: {
                                                show: true,
                                                lineStyle: {
                                                    color: '#d1d1d1',
                                                    width: 1,
                                                },
                                            },
                                            axisTick: {
                                                show: false,
                                            },
                                            axisLabel: {
                                                margin: 5,
                                                textStyle: {
                                                    color: '#8e8e8e',
                                                    fontSize: 10
                                                }
                                            },
                                            data: _getAxig('other', 'F_NAME')
                                        }],
                                        yAxis: [{
                                            type: 'value',
                                            axisLine: {
                                                show: false
                                            },
                                            axisTick: {
                                                show: false
                                            },
                                            axisLabel: {
                                                inside: true,
                                                interval: 1,
                                                margin: 5,
                                                textStyle: {
                                                    color: '#D4D4D4',
                                                    fontSize: 10
                                                }
                                            },
                                            splitLine: {
                                                lineStyle: {
                                                    color: '#eaeaea',
                                                    width: 0.5,
                                                },
                                            },
                                        }],
                                        series: Dashboard(),
                                        barGap: '0%',
                                        barCategoryGap: '50%',
                                        barMaxWidth: '30%',
                                        color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                    }
                                    break;

                            }

                        }
                    }
                    break;

                    //多层饼图
                case 'Pie_MultiLevelPie':

                    return function(raw, name, sizeType) {
                        if (raw) {
                            switch (sizeType) {
                                case 0:
                                    return {
                                        // backgroundColor: '#fff',
                                        tooltip: {
                                            trigger: 'item',
                                            formatter: "{a} <br/>{b} : {c} ({d}%)",
                                            confine: true, //弹窗限制在窗口内
                                        },
                                        title: {
                                            text: name,
                                            subtext: '',
                                            x: 'left',
                                            left: 10,
                                            top: 10,
                                            textAlign: 'left',
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#03538D',
                                                fontSize: 12,
                                            }
                                        },
                                        legend: {
                                            orient: 'vertical',
                                            left: '66%',
                                            top: '15%',
                                            itemGap: 7,
                                            itemWidth: 15,
                                            itemHeight: 10,
                                            textStyle: {
                                                color: '#333',
                                                fontStyle: 'normal',
                                                fontWeight: 'bolder',
                                                fontFamily: 'sans-serif',
                                                color: '#999',
                                                fontSize: 10
                                            },
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(item['data'].reduce(function(array, item) {
                                                    return array.concat(item['lable'])
                                                }, []))
                                            }, [])
                                        },
                                        series: [{
                                            name: name,
                                            type: 'pie',
                                            radius: [0, '40%'],
                                            center: ['33%', '53%'],
                                            label: {
                                                normal: {
                                                    show: false,
                                                    position: 'center'
                                                }
                                            },
                                            data: raw.reduce(function(arr, id) {
                                                return arr.concat({
                                                    name: id['other'].reduce(function(str, item) {
                                                        if (item['F_NAME']) {
                                                            return str + item['F_NAME']
                                                        } else {
                                                            return str
                                                        }
                                                    }, ''),
                                                    value: id['data'].reduce(function(sum, item) {
                                                        return sum + Number(_getValue(item))
                                                    }, 0)
                                                })
                                            }, [])
                                        }, {
                                            width: '15px',
                                            name: name,
                                            type: 'pie',
                                            radius: ['48%', '68%'],
                                            center: ['33%', '53%'],
                                            label: {
                                                normal: {
                                                    show: false,
                                                    position: 'center'
                                                }
                                            },
                                            data: raw.reduce(function(arr, id) {
                                                return arr.concat(id['data'].reduce(function(array, item) {
                                                    return array.concat({ name: item['lable'], value: _getValue(item) })
                                                }, []))
                                            }, [])
                                        }],
                                        color: ['rgba(244,32,18,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(33,150,243,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
                                        animationType: 'scale',
                                        animationEasing: 'elasticOut',
                                        animationDelay: function animationDelay(idx) {
                                            return Math.random() * 200;
                                        }
                                    }
                                    break;

                                case 1:
                                    // return {
                                    //     // backgroundColor: '#fff',
                                    //     tooltip: {
                                    //         trigger: 'item',
                                    //         formatter: "{a} <br/>{b} : {c} ({d}%)",
                                    //         confine: true,
                                    //     },
                                    //     title: {
                                    //         text: name,
                                    //         subtext: '',
                                    //         x: 'left',
                                    //         left: 10,
                                    //         top: 10,
                                    //         textAlign: 'left',
                                    //         textStyle: {
                                    //             color: '#333',
                                    //             fontStyle: 'normal',
                                    //             fontWeight: 'bolder',
                                    //             fontFamily: 'sans-serif',
                                    //             color: '#03538D',
                                    //             fontSize: 12,
                                    //         }
                                    //     },
                                    //     legend: {
                                    //         orient: 'horizontal',
                                    //         left: '10%',
                                    //         top: '70%',
                                    //         itemGap: 7,
                                    //         itemWidth: 15,
                                    //         itemHeight: 10,
                                    //         textStyle: {
                                    //             fontStyle: 'normal',
                                    //             fontWeight: 'bolder',
                                    //             fontFamily: 'sans-serif',
                                    //             color: '#999',
                                    //             fontSize: 10,
                                    //         },
                                    //         data: raw['indicatorData'].reduce(function(arr, id) {
                                    //             return arr.concat(id['data'].reduce(function(array, item) {
                                    //                 return array.concat(item['lable'])
                                    //             }, []))
                                    //         }, [])
                                    //     },
                                    //     series: [{
                                    //         name: name,
                                    //         type: 'pie',
                                    //         radius: [0, '30%'],
                                    //         center: ['555%', '50%'],
                                    //         label: {
                                    //             normal: {
                                    //                 position: 'inner'
                                    //             }
                                    //         },
                                    //         data: raw['indicatorData'].reduce(function(arr, id) {
                                    //             return arr.concat({
                                    //                 name: id['other'].reduce(function(str, item) {
                                    //                     if (item['F_NAME']) {
                                    //                         return str + item['F_NAME']
                                    //                     } else {
                                    //                         return str
                                    //                     }
                                    //                 }, ''),
                                    //                 value: id['data'].reduce(function(sum, item) {
                                    //                     return sum + Number(_getValue(item))
                                    //                 }, 0)
                                    //             })
                                    //         }, [])
                                    //     }, {
                                    //         name: name,
                                    //         type: 'pie',
                                    //         radius: ['40%', '60%'],
                                    //         center: ['50%', '40%'],
                                    //         label: {
                                    //             normal: {
                                    //                 show: false,
                                    //             }
                                    //         },
                                    //         data: raw['indicatorData'].reduce(function(arr, id) {
                                    //             return arr.concat(id['data'].reduce(function(array, item) {
                                    //                 return array.concat({ name: item['lable'], value: _getValue(item) })
                                    //             }, []))
                                    //         }, [])
                                    //     }],
                                    //     color: ['rgba(244,32,18,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(33,150,243,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
                                    //     animationType: 'scale',
                                    //     animationEasing: 'elasticOut',
                                    //     animationDelay: function animationDelay(idx) {
                                    //         return Math.random() * 200;
                                    //     }
                                    // }
                                    break;
                            }

                        }

                        return null
                    }
                    break;
                case 'Table':
                    break;
            }
        }
    }


    /**
     * 绘制地图图表
     */
    var drawOn = {
        draw: function(_id) {
            var mapInArroy = []
            storage.chartData.forEach(function(val) {
                if (val.indiatorInfo.id === _id) {
                    val.indiatorData
                    var _rtMap = callBackMap(val.indiatorInfo.map_type)
                    mapInArroy.push(_rtMap(val))
                    us.addLayers(mapInArroy)
                }
            })
        }
    }


    /**
     * 回传地图，渲染图表
     */

    var callBackMap = function(type) {
        switch (type) {
            case 'pie':
                return function(_data) {
                    if (_data.indiatorInfo.type === 'Dashboard_PercentDashboard') {
                        function _getNewData() {
                            var _tag = true
                            var _all = ''
                            var _rt = []
                            var _arr = []
                            for (var k = 0; k < _data.indiatorData.data.length; k++) {
                                _arr.push(_getValue(_data.indiatorData.data[k]))
                            }
                            _arr.forEach(function(_x, _in) {
                                if (_tag) {
                                    _all = _arr[0] - _arr[1]
                                    _tag = false
                                } else {
                                    _all = _arr[0] - _all
                                }
                                _rt.push({ name: _data.indiatorData.data[_in]['lable'], value: _all })
                            })
                            return _rt
                        }

                        return {
                            level: userPermissions.surveyLevel,
                            code: userPermissions.surveyCode,
                            mapType: _data.indiatorInfo.map_type,
                            minScale: _data.indiatorData.minScale,
                            maxScale: _data.indiatorData.maxScale,
                            width: _data.indiatorData.width,
                            center: _data.indiatorData.center,
                            other: _data.indiatorData.other,
                            data: _getNewData()
                        }
                    } else {
                        return {
                            level: userPermissions.surveyLevel,
                            code: userPermissions.surveyCode,
                            mapType: _data.indiatorInfo.map_type,
                            minScale: _data.indiatorData.minScale,
                            maxScale: _data.indiatorData.maxScale,
                            width: _data.indiatorData.width,
                            center: _data.indiatorData.center,
                            other: _data.indiatorData.other,
                            data: _data.indiatorInfo.data.reduce(function(array, item) {
                                return array.concat({ name: item['lable'], value: _getValue(item) })
                            }, [])
                        }
                    }
                }
                break;

            case 'bar':
                return function(_data) {
                    var _ds = []
                    console.log(_data)

                    function processing(i, __type__) {
                        var info = []
                        for (var j = 0; j < _data.indiatorData[i].data.length; j++) {
                            let _content = _data.indiatorData[j].data[i]
                                // console.log('_content:', _content)
                            console.log(__type__)
                            if (__type__ === 'data') {
                                info.push({
                                    value: _getValue(_content.data[0]),
                                    name: _content['other'][0]['F_NAME']
                                })
                            } else {
                                info.push(_content.other)
                            }
                        }

                        return info
                    }
                    for (var i = 0; i < _data.indiatorData.length; i++) {
                        _ds.push({
                            level: userPermissions.surveyLevel,
                            code: userPermissions.surveyCode,
                            mapType: _data.indiatorInfo.map_type,
                            minScale: _data.indiatorData[i].minScale,
                            maxScale: _data.indiatorData[i].maxScale,
                            // width: 100,
                            center: ['29.55', '121.38'],
                            other: processing(i, 'other'),
                            data: processing(i, 'data')
                        })
                    }
                    return _ds
                }
        }

    }


})