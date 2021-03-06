function printObject(obj) {
    function _p(_obj, index, len, _level) {
        var space = '  '.repeat(_level)
        var str = ''
        if (_obj === null) {
            str += 'null'
        } else if (_obj === undefined) {
            str += 'undefined'
        } else if (typeof _obj === 'number') {
            str += '' + _obj
        } else if (typeof _obj === 'string') {
            str += _obj
        } else if (Object.prototype.toString.call(_obj) === '[object Array]') {
            str += '[\n' + _obj.reduce(function(str, item, idx) {
                return str + space + _p(item, idx, _obj.length - 1, _level + 1)
            }, '') + space + ']'
        } else if (Object.prototype.toString.call(_obj) === '[object Object]') {
            str += '{\n' + Object.keys(_obj).reduce(function(str, key, idx) {
                return str + space + key + ': ' + _p(_obj[key], idx, Object.keys(_obj).length - 1, _level + 1)
            }, '') + space + '}'
        } else {
            str += '???'
        }

        return str + (index < len ? ',' : '') + '\n'
    }

    // console.log(_p(obj, 0, 0, 0))
}


define("chart", ['map', "jquery", "userservice"], function(map, j, us) {

    function addThemeMap(o) {
        printObject(o)
        h.addLayer(o);
    }



    /**
     * 
     */



    setInterval(function() {
        var inputOut = getNowFormatDate()
        $('#Time').html(inputOut.time);
        $('#Years').html(inputOut.year);
        $('#Day').html(inputOut.day);
    }, 1000);

    function getNowFormatDate() {
        var day = ["日", "一", "二", "三", "四", "五", "六"];
        var date = new Date();
        var seperator1 = "/";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hours = fill(date.getHours());
        var seconds = fill(date.getSeconds());
        var minutes = fill(date.getMinutes());

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = {
            year: date.getFullYear() + seperator1 + month + seperator1 + strDate,
            time: hours + seperator2 + minutes + seperator2 + seconds,
            day: '星期' + day[date.getDay()]
        }
        return currentdate;
    }

    function fill(l) {
        if (l >= 0 && l <= 9) {
            l = "0" + l;
        }
        return l
    }

    // $('.map1').on('click', function() {
    //     $('#top-sidebar, #left-sidebar, #right-sidebar').removeClass('dark'),
    //         $('.logo img').attr('src', 'images/chart/logo@2x.png')
    // })

    // $('.map2').on('click', function() {
    //     $('#top-sidebar,#left-sidebar, #right-sidebar').addClass('dark'),
    //         $('.logo img').attr('src', 'images/chart/logodark@2x.png')
    // })

    // $('.zoomout').on('click', function() {
    //     map.Ly.enlarge()
    // })

    // $('.zoomin').on('click', function() {
    //     map.Ly.narrow()
    // })

    // $('.openCloseSidebar-left').on('click', function() {
    //     $('#left-sidebar').toggleClass('close')
    // })

    // $('.openCloseSidebar-right').on('click', function() {
    //     $('#right-sidebar').toggleClass('close')
    // })

    // $('.prev-button').on('click', function() {
    //     controlStage.initCount--
    //         if (controlStage.initCount <= 1) {
    //             $('.prev-button').addClass('active')
    //         }
    //     if (controlStage.initCount < 1) {
    //         controlStage.initCount = 1
    //         return
    //     }
    //     $('.next-button').removeClass('active')
    //     $('#left-sidebar, #right-sidebar').find('.mouseMove').parents('.information').remove()
    //     $('.button_d')
    //         .eq(controlStage.initCount - 1)
    //         .addClass('active')
    //         .siblings()
    //         .removeClass('active')
    //     switchPhase(controlStage.initCount)
    // })

    // $('body').on('click', '.mouseMove', function() {
    //     drawOn.draw($(this).data('index'))
    //     cblin._indicatorId = $(this).data('index')
    // })

    // $('.next-button').on('click', function() {
    //     controlStage.initCount++
    //         if (controlStage.initCount >= 8) {
    //             $('.next-button').addClass('active')
    //         }
    //     if (controlStage.initCount > $('.button_d').length) {
    //         controlStage.initCount = $('.button_d').length
    //         return
    //     }
    //     $('.prev-button').removeClass('active')
    //     $('#left-sidebar, #right-sidebar').find('.mouseMove').parents('.information').remove()
    //     $('.button_d')
    //         .eq(controlStage.initCount - 1)
    //         .addClass('active')
    //         .siblings()
    //         .removeClass('active')
    //     switchPhase(controlStage.initCount)
    // })

    var controlStage = {
        initCount: 1
    }

    var api = {
        getData: function(address, theInput = '', fn) {
            $.ajax({
                type: 'POST',
                url: "http://124.207.115.117:8090/DataShow.asmx/" + address,
                data: theInput,
                contentType: "application/x-www-form-urlencoded",
                success: function(data) {
                    if (address === 'GetTerm') {
                        initTerms.initData = JSON.parse(data)
                        map.Ly.addTileLayer('http://124.207.115.117:8089/ReadTile.ashx?Layer=', 'D:\\\\ZJDATA\\\\切片数据\\\\gask_xgt')
                        initTerms.initTermsPages()
                    } else if (address === 'GetIndicatorCount') {
                        cblin._indicator = JSON.parse(data)
                        initTerms.init()
                        initTerms.callBackMapData = []
                    } else if (address === 'GetIndicatorData') {
                        initTerms.processData = ''
                        initTerms.processData = JSON.parse(data)
                        if (typeof fn === 'function') {
                            fn()
                        }
                    }
                },
                erroer: function(error) {
                    console.log('error:', error)
                }
            })
        }
    }

    $('#test2').on('click', function() {
        mapReturn.mr(1, 330283103)
    });

    var mapReturn = {
        mr: function(_level, _code, _mapType = 'bar') {
            // initTerms.init(_level, _code)
            mapReturn.drawChange(_level, _code)
            api.getData('GetIndicatorData', {
                indicatorID: cblin._indicatorId,
                level: _level,
                code: _code
            }, function() {
                if (initTerms.processData['indicatorData'].length !== 0) {
                    // console.log('test:', callBackMap(_mapType)(initTerms.processData, _mapType, _level, _code))
                    // callBackMap('bar')(initTerms.processData, 'bar', _level, _code)
                    // console.log('cons:',callBackMap('bar')(initTerms.processData, 'bar', _level, _code))
                    // us.addLayers(callBackMap('bar')(initTerms.processData, 'bar', _level, _code));
                    us.addLayers(callBackMap(_mapType)(initTerms.processData, _mapType, _level, _code));
                }
            })
        },
        newProcessData: '',
        drawChange: function(_level, _code) {
            var _handleKeyValues = []
            var _location = ''
            var _locationClass = ''
            var _chartType = ''
            for (let i = 0; i < cblin._indicator.indicators.length; i++) {
                api.getData('GetIndicatorData', {
                    indicatorID: cblin._indicator.indicators[i].indicatorID,
                    level: _level,
                    code: _code
                }, function(data) {
                    if (initTerms.processData.indicatorData.length !== 0) {
                        _handleKeyValues[i] = getTransformer(cblin._indicator.indicators[i].indicatorType)
                        mapReturn.newProcessData = initTerms.processData
                        console.log(cblin._indicator.indicators[i].location)
                        if (cblin._indicator.indicators[i].location === 'left') {
                            _location = '.left-cnj'
                        } else {
                            _location = '.right-cnj'
                        }

                        if (cblin._indicator.indicators[i].type === '0') {
                            _chartType = _locationClass = 'type-big'
                        } else if (cblin._indicator.indicators[i].type === '1') {
                            _chartType = _locationClass = 'type-middle'
                        } else if (cblin._indicator.indicators[i].type === '2') {
                            _chartType = _locationClass = 'type-small'
                        }
                        " draw_" + cblin._indicator.indicators[i].indicatorID
                        if (!$(".draw_" + cblin._indicator.indicators[i].indicatorID)) {
                            $(_location).append("<div class='information " + _locationClass + "-parent'> <a target='_blank' href='" + cblin._indicator.indicators[i].theme['url'] + "'></a><div data-index= " + cblin._indicator.indicators[i].indicatorID + " class='mouseMove " + _locationClass + " draw_" + cblin._indicator.indicators[i].indicatorID + " '></div></div>");
                        }


                        draw.echart(_handleKeyValues[i](mapReturn.newProcessData, cblin._indicator.indicators[i].indicatorName, cblin._indicator.indicators[i].type), i)
                    }
                })
            }
        }

    }

    function switchPhase(theId) {
        api.getData('GetIndicatorCount', {
            termID: theId
        })
    }

    var drawOn = {
        draw: function(index) {
            initTerms.callBackMapData = []
            let ag = ''
            api.getData('GetIndicatorData', {
                indicatorID: index,
                level: cblin.__level__,
                code: cblin.__code__
            }, function() {
                if (initTerms.processData !== []) {
                    if (cblin._indicator.indicators[index].mapType === 'pie') {
                        initTerms.callBackMapData.push(callBackMap(cblin._indicator.indicators[index].mapType)
                            (initTerms.processData, cblin._indicator.indicators[index], cblin.__level__, cblin.__code__))
                        console.log('s:', initTerms.callBackMapData)
                            // console.log(initTerms.callBackMapData)
                        us.addLayers(initTerms.callBackMapData)
                    } else {
                        us.addLayers(callBackMap(cblin._indicator.indicators[index].mapType)
                            (initTerms.processData, cblin._indicator.indicators[index].mapType, cblin.__level__, cblin.__code__))
                    }
                }
            })
        }
    }

    var cblin = {
        _indicator: '',
        __level__: 0,
        __code__: 330283103,
        _indicatorId: '',
        fig: false

    }



    var initTerms = {
        initData: '',
        _indicator: '',
        processData: '',
        kv: '',
        theInitial: true,
        cleartButton: function(_id, _name) {
            $('.phase ul').append('<li class="button_d" data-id=' + _id + '>' + '<h2>' + _id + '</h2>' + '<h4>' + _name + '</h4>' + '</li>')
            if (this.theInitial) {
                $('.button_d').eq(0).addClass('active')
                $('.prev-button').addClass('active')
                switchPhase(_id)
                this.theInitial = false
            }
        },
        initTermsPages: function() {
            for (var i = 0; i < this.initData.terms.length; i++) {
                var _id = this.initData.terms[i].termID
                var _name = this.initData.terms[i].termName
                this.cleartButton(_id, _name)
            }
        },
        callBackMapData: [],
        init: function(_level, _code = '330283103', bench = false) {
            _level = _level || cblin.__level__
            cblin.fig = true
            var handleKeyValues = []
            var location = ''
            var locationClass = ''
            var chartType = ''
            for (let i = 0; i < cblin._indicator.indicators.length; i++) {
                handleKeyValues[i] = getTransformer(cblin._indicator.indicators[i].indicatorType)

                if (cblin._indicator.indicators[i].location === 'left') {
                    location = '.left-cnj'
                } else {
                    location = '.right-cnj'
                }

                if (cblin._indicator.indicators[i].type === '0') {
                    chartType = locationClass = 'type-big'
                } else if (cblin._indicator.indicators[i].type === '1') {
                    chartType = locationClass = 'type-middle'
                } else if (cblin._indicator.indicators[i].type === '2') {
                    chartType = locationClass = 'type-small'
                }

                // console.log('进来了')
                // if ($(location).find('.mouseMove').hasClass('draw_' + cblin._indicator.indicators[i].indicatorID)) {
                //     return
                // } else {
                $(location).append("<div class='information " + locationClass + "-parent'> <a target='_blank' href='" + cblin._indicator.indicators[i].theme['url'] + "'></a><div data-index= " + cblin._indicator.indicators[i].indicatorID + " class='mouseMove " + locationClass + " draw_" + cblin._indicator.indicators[i].indicatorID + " '></div></div>");
                // }

                api.getData('GetIndicatorData', {
                    indicatorID: cblin._indicator.indicators[i].indicatorID,
                    level: _level,
                    code: _code
                }, function() {
                    if (cblin._indicator.indicators[i].indicatorType === 'Text') {
                        if (initTerms.processData.indicatorData.length <= 0) {
                            return
                        }
                        draw.chartText(initTerms.processData, i)
                    } else {
                        if (initTerms.processData.indicatorData.length <= 0) {
                            return
                        }
                        draw.echart(handleKeyValues[i](initTerms.processData, cblin._indicator.indicators[i].indicatorName, cblin._indicator.indicators[i].type), i)

                    }
                    if (cblin._indicator.indicators[i].mapType === 'bar' || cblin._indicator.indicators[i].mapType === 'pie') {
                        // initTerms.callBackMapData = []
                        // initTerms.callBackMapData.push(callBackMap(initTerms.processData, cblin._indicator.indicators[i].mapType, _level, _code))
                        // // console.log(this.callBackMapData)
                        // us.addLayers(this.callBackMapData);
                    }
                })

            }

            console.log($('.mouseMove').find('div'))
        },
        handleKeyValue: null
    }

    var draw = {
        echart(_data, _i) {
            var _b = $('.draw_' + cblin._indicator.indicators[_i].indicatorID);
            var echart = echarts.init(_b[0]);
            var option = _data;
            echart.setOption(option);
        },
        chartText(_data, _i) {
            var _b = $('.draw_' + cblin._indicator.indicators[_i].indicatorID);
            for (var i = 0; i < _data.indicatorData.length; i++) {
                var _highlighted = _data.indicatorData[i].is_show == 1 ? 'highlighted' : ''
                _b.append('<div class="typeText"><span>' + _data.indicatorData[i].caption + '</span><span class=' + _highlighted + '>' + _data.indicatorData[i].value + '</span></div>')
            }
        }
    }

    function _getValue(item) {
        var _key = Object.keys(item).find(function(k) {
            return /F_TYPE/.test(k)
        })
        return item[_key]
    }

    /**
     * [callBackMap description]
     * @param  测试地址
     * @return {[type]}      [description]
     */
    var callBackMap = function(type) {
        switch (type) {
            case 'pie':
                return function(_data, _type, _level, _code) {
                    if (_type.indicatorType === 'Dashboard_PercentDashboard') {

                        function _getNewData(_deal) {
                            var _tag = true
                            var _all = ''
                            var _rt = []
                            var _arr = []
                            for (var k = 0; k < _data['indicatorData'][0].data.length; k++) {
                                _arr.push(_getValue(_data['indicatorData'][0].data[k]))
                            }
                            _arr.forEach(function(_x, _in) {
                                if (_tag) {
                                    _all = _arr[0] - _arr[1]
                                    _tag = false
                                } else {
                                    _all = _arr[0] - _all
                                }
                                _rt.push({ name: _data['indicatorData'][0].data[_in]['lable'], value: _all })
                            })
                            return _rt
                        }

                        return {
                            level: _level,
                            code: _code,
                            mapType: _type.mapType,
                            minScale: _data['indicatorData'][0].minScale,
                            maxScale: _data['indicatorData'][0].maxScale,
                            width: _data['indicatorData'][0].width,
                            center: _data['indicatorData'][0].center,
                            other: _data['indicatorData'][0].other,
                            data: _getNewData()
                        }
                    } else {
                        return {
                            level: _level,
                            code: _code,
                            mapType: _type.mapType,
                            minScale: _data['indicatorData'][0].minScale,
                            maxScale: _data['indicatorData'][0].maxScale,
                            width: _data['indicatorData'][0].width,
                            center: _data['indicatorData'][0].center,
                            other: _data['indicatorData'][0].other,
                            data: _data['indicatorData'][0].data.reduce(function(array, item) {
                                return array.concat({ name: item['lable'], value: _getValue(item) })
                            }, [])
                        }
                    }
                }
                break;

            case 'bar':
                return function(_data, _type, _level, _code) {
                    var _ds = []

                    function processing(i, __type__) {
                        var info = []
                        for (var j = 0; j < _data['indicatorData'].length; j++) {
                            let _content = _data['indicatorData'][j]['data'][i]

                            if (__type__ === 'data') {
                                info.push({
                                    value: _getValue(_content['data'][0]),
                                    name: _content['other'][0]['F_NAME']
                                })
                            } else {
                                info.push(_content['other'][0])
                            }
                        }

                        return info
                    }

                    for (var i = 0; i < _data['indicatorData'][0]['data'].length; i++) {
                        _ds.push({
                            level: _level,
                            code: _code,
                            mapType: _type,
                            minScale: _data['indicatorData'][0].minScale,
                            maxScale: _data['indicatorData'][0].maxScale,
                            width: 100,
                            center: ['29.55', '121.38'],
                            other: processing(i, 'other'),
                            data: processing(i, 'data')
                        })
                    }
                    return _ds
                }
        }

    }

    /**
     * [callBackMap description]
     * @param  正常测试
     * @return {[type]}      [description]
     */
    // var callBackMap = function (type) {
    //     switch(type) {
    //         case 'pie':
    //         return function(_count, _data, _level, _code) {
    //             return {
    //                 level: _level,
    //                 code: _code,
    //                 mapType: _data,
    //                 minScale: _count['indicatorData'][0].minScale,
    //                 maxScale: _count['indicatorData'][0].maxScale,
    //                 width: _count['indicatorData'][0].width,
    //                 center: _count['indicatorData'][0].center,
    //                 other: _count['indicatorData'][0].other,
    //                 data: _count['indicatorData'][0].data.reduce(function(array, item) {
    //                     return array.concat({ name: item['lable'], value: _getValue(item) })
    //                 }, [])
    //             }
    //         }
    //         break;

    //         case 'bar':
    //         return function(_count, _data, _level, _code) {
    //             function getData() {
    //                 let _ds = []
    //                 for (let i = 0; i < _count['indicatorData'].length; i++) {
    //                     let _data = _count['indicatorData'][i]
    //                     // for (let k = 0; k < _data['data'].length; k++ ) {
    //                     //    // console.log(_getValue(_data['data'][k]['other'][0]['F_NAME']))
    //                     //    _ds.push({name: _data['data'][k]['other'][0]['F_NAME'], value: _getValue(_data['data'][k]['data'][0])}) 
    //                     //     // console.log('arr:', _ds.psuh({name: its['other'][0]['F_NAME'], value: _getValue(its['data'][0])}) )
    //                     // }
    //                     _data['data'].reduce(function(arr, its) {
    //                         _ds.push({name: its['other'][0]['F_NAME'], value: _getValue(its['data'][0])})
    //                         return _ds
    //                     }, _ds)
    //                 }
    //                 return _ds
    //             }
    //             return {
    //                 level: _level,
    //                 code: _code,
    //                 mapType: _data,
    //                 minScale: _count['indicatorData'][0].minScale,
    //                 maxScale: _count['indicatorData'][0].maxScale,
    //                 // width: _count['indicatorData'][0].width,
    //                 // center: _count['indicatorData'][0].center,
    //                 width: 100,
    //                 center: ['29.55', '121.38'],
    //                 other: _count['indicatorData'][0]['data'][0].other,
    //                 data: getData()
    //             }
    //         }
    //     }

    // }


    // 数据结构转换
    var getTransformer = function(type) {
        switch (type) {
            // 普通饼图
            case 'Pie_PieChart':
                return function(raw, name) {
                    if (raw) {
                        var _indicatorData = raw['indicatorData'][0]
                        if (_indicatorData) {
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
                                        color: '#0088EB',
                                        fontSize: 12,
                                    }
                                },
                                tooltip: {
                                    confine: true,
                                },
                                legend: {
                                    orient: 'vertical',
                                    left: 'left',
                                    data: _indicatorData['data'].reduce(function(array, item) {
                                        return array.concat(item['lable'])
                                    }, [])
                                },
                                series: [{
                                    name: name,
                                    type: 'pie',
                                    radius: '55%',
                                    data: _indicatorData['data'].reduce(function(array, item) {
                                        return array.concat({ name: item['lable'], value: _getValue(item) })
                                    }, [])
                                }]
                            }
                        }
                    }

                    return null
                }
                break;
                // 环形饼图
            case 'Pie_DonutChart':
                return function(raw, name) {
                    if (raw) {
                        var _indicatorData = raw['indicatorData'][0]
                        if (_indicatorData) {
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
                                        color: '#0088EB',
                                        fontSize: 12,
                                    }
                                },
                                tooltip: {
                                    confine: true,
                                },

                                legend: {
                                    orient: 'vertical',
                                    left: 'left',
                                    data: _indicatorData['data'].reduce(function(array, item) {
                                        return array.concat(item['lable'])
                                    }, [])
                                },
                                series: [{
                                    name: name,
                                    type: 'pie',
                                    radius: ['50%', '70%'], // 与普通饼图的区别
                                    data: _indicatorData['data'].reduce(function(array, item) {
                                        return array.concat({ name: item['lable'], value: _getValue(item) })
                                    }, [])
                                }]
                            }
                        }
                    }

                    return null
                }
                break;
                // 多层饼图
            case 'Pie_MultiLevelPie':
                return function(raw, name, _type) {
                    if (raw) {
                        switch (_type) {
                            case '0':
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
                                            color: '#0088EB',
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
                                            fontSize: 10,
                                        },
                                        data: raw['indicatorData'].reduce(function(arr, id) {
                                            return arr.concat(id['data'].reduce(function(array, item) {
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
                                        data: raw['indicatorData'].reduce(function(arr, id) {
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
                                        data: raw['indicatorData'].reduce(function(arr, id) {
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

                            case '1':
                                return {
                                    // backgroundColor: '#fff',
                                    tooltip: {
                                        trigger: 'item',
                                        formatter: "{a} <br/>{b} : {c} ({d}%)",
                                        confine: true,
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
                                            color: '#0088EB',
                                            fontSize: 12,
                                        }
                                    },
                                    legend: {
                                        orient: 'horizontal',
                                        left: '10%',
                                        top: '70%',
                                        itemGap: 7,
                                        itemWidth: 15,
                                        itemHeight: 10,
                                        textStyle: {
                                            fontStyle: 'normal',
                                            fontWeight: 'bolder',
                                            fontFamily: 'sans-serif',
                                            color: '#999',
                                            fontSize: 10,
                                        },
                                        data: raw['indicatorData'].reduce(function(arr, id) {
                                            return arr.concat(id['data'].reduce(function(array, item) {
                                                return array.concat(item['lable'])
                                            }, []))
                                        }, [])
                                    },
                                    series: [{
                                        name: name,
                                        type: 'pie',
                                        radius: [0, '30%'],
                                        center: ['555%', '50%'],
                                        label: {
                                            normal: {
                                                position: 'inner'
                                            }
                                        },
                                        data: raw['indicatorData'].reduce(function(arr, id) {
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
                                        name: name,
                                        type: 'pie',
                                        radius: ['40%', '60%'],
                                        center: ['50%', '40%'],
                                        label: {
                                            normal: {
                                                show: false,
                                            }
                                        },
                                        data: raw['indicatorData'].reduce(function(arr, id) {
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
                        }

                    }

                    return null
                }
                break;
                // 垂直柱状图
            case 'Column_ColumnChart':
                return function(raw, name) {
                    if (raw) {
                        var _indicatorData = raw['indicatorData'][0]
                        if (_indicatorData) {
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
                                        color: '#0088EB',
                                        fontSize: 12,
                                    }
                                },
                                xAxis: {
                                    data: _indicatorData.reduce(function(arr, item) {
                                        return arr.concat(item['lable'])
                                    }, []),
                                    // 样式设计修改
                                    axisLabel: {
                                        inside: false,
                                        interval: 0,
                                        textStyle: {
                                            color: '#000'
                                        }
                                    },
                                    axisTick: {
                                        show: false
                                    },
                                    axisLine: {
                                        show: false
                                    },
                                    z: 10
                                },
                                yAxis: {
                                    axisLabel: {
                                        textStyle: {
                                            color: '#000'
                                        }
                                    },
                                    axisTick: {
                                        show: false
                                    },
                                    axisLine: {
                                        show: false
                                    },
                                },
                                // 缩放控制，作用不明
                                dataZoom: [{
                                    type: 'inside'
                                }],
                                series: [{
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: new echarts.graphic.linearGradient(
                                                0, 0, 0, 1, [
                                                    { offset: 0, color: '#83bff6' },
                                                    { offset: 1, color: '#188df0' }
                                                ]
                                            )
                                        },
                                        // hover:
                                        emphasis: {
                                            color: new echarts.graphic.linearGradient(
                                                0, 0, 0, 1, [
                                                    { offset: 0, color: '#188df0' },
                                                    { offset: 1, color: '#83bff6' }
                                                ]
                                            )
                                        }
                                    },
                                    data: _indicatorData['data'].reduce(function(arr, item) {
                                        return arr.concat(_getValue(item))
                                    }, [])
                                }],
                                color: ['rgba(244,32,18,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(33,150,243,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                            }
                        }
                    }

                    return null
                }
                break;
                // 累积柱状图
            case 'Column_CustomAxisLabel3':
                return function(raw, name, _type) {
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

                        function testDs() {
                            var _items = ''
                            var _stack = ''
                            var _name = ''
                            var cms = ''
                            for (let i = 0; i < raw['indicatorData'].length; i++) {
                                _stack = raw['indicatorData'][i].stack

                            }

                            cms = raw['indicatorData'][0]['data'].reduce(function(_arr, _item) {
                                _name = _item['other'][0]['F_NAME']
                                _items = _item['data'][0]['F_TYPE_1']

                                return _arr.concat({ name: _name, stack: _stack, type: 'bar', data: _item['data'][0]['F_TYPE_1'] })
                            }, [])
                            return cms
                        }

                        function test2() {
                            var contain = []

                            var _stack = ''
                            for (let i = 0; i < raw['indicatorData'].length; i++) {
                                var _data = raw['indicatorData'][i]['data']

                                _data.reduce(function(c, item, idx) {
                                    var _rawItem = raw['indicatorData'][i]
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
                        switch (_type) {
                            case '0':
                                return {
                                    legend: {
                                        data: raw['indicatorData'].reduce(function(arr, item) {
                                            return arr.concat(item.stack)
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
                                            color: '#0088EB',
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
                                            interval: 0,
                                            textStyle: {
                                                color: '#8e8e8e',
                                                fontSize: 10
                                            }
                                        },
                                        data: raw['indicatorData'].reduce(function(arr, item) {
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
                                    series: test2(),
                                    color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                }
                                break;

                            case '1':
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
                                            color: '#0088EB',
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
                                            interval: 0,
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
                                    series: test2(),
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
                // 水平累积条形图
            case 'Bar_PercentStackedBar':
                return function(raw) {

                }
                break;
                // 自定义条形图
            case 'Bar_CustomAxisLabel2':
                return function(raw) {

                }
                break;
                // 闪烁动画折线图
            case 'Line_FlashingLineChart':

                return function(raw, name, _type) {
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

                    function test2() {
                        var contain = []
                        var conso = []
                        var _stack = ''
                        var newconso = []
                        for (let i = 0; i < raw['indicatorData'].length; i++) {

                            conso = []
                            var _data = raw['indicatorData'][i]
                            _data['data'].reduce(function(_arr, item) {
                                conso.push(_getValue(item['data'][0]))
                            }, conso)

                            newconso.push({
                                name: raw['indicatorData'][i].stack,
                                type: 'line',
                                stack: raw['indicatorData'][i].stack,
                                data: conso
                            })
                        }
                        return newconso
                    }

                    if (raw) {
                        switch (_type) {
                            case '0':
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
                                            color: '#0088EB',
                                            fontSize: 12,
                                        }
                                    },
                                    tooltip: {
                                        // 根据需要改写
                                        trigger: 'axis',
                                        confine: true,
                                        // fomatter: function (params) {
                                        //   params = params[0]
                                        //   var date = new Date(params.name)
                                        //   return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + params.value[1]
                                        // },
                                        axisPointer: {
                                            animation: false
                                        }
                                    },
                                    grid: {
                                        top: '25%',
                                        left: '5%',
                                        right: '5%',
                                        bottom: '10%',
                                        containLabel: true
                                    },
                                    xAxis: [{
                                        type: 'category',
                                        nameLocation: 'end', //名称的位置
                                        nameTextStyle: { //名称的样式
                                            color: '#999',
                                            fontSize: '12px'
                                        },

                                        nameGap: 0, //名称与X轴的距离
                                        boundaryGap: false, //坐标的刻度是否在中间
                                        // min: '0', //坐标轴刻度最小值
                                        // max: 'dataMax', //坐标轴刻度的最大值
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
                                            interval: 0,
                                            textStyle: {
                                                color: '#8e8e8e',
                                                fontSize: 10
                                            }
                                        },
                                        data: _getAxig('other', 'F_NAME')
                                    }],
                                    yAxis: [{
                                        type: 'value', //类型数值轴
                                        // name:'(人)',    //坐标轴名称
                                        nameTextStyle: { //名称的样式
                                            color: '#999',
                                            fontSize: '12px'
                                        },
                                        nameGap: 3, //名称与Y轴的距离
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
                                                //formatter: '{value} °C',//标签内容内置的格式转化器比如这个表示在后面加一个c
                                                color: '#eaeaea',
                                                width: 0.5,
                                            },
                                        },
                                    }],
                                    series: test2(),

                                    color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']

                                }
                                break;

                            case '1':
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
                                            color: '#0088EB',
                                            fontSize: 12,
                                        }
                                    },
                                    tooltip: {
                                        // 根据需要改写
                                        trigger: 'axis',
                                        confine: true,
                                        // fomatter: function (params) {
                                        //   params = params[0]
                                        //   var date = new Date(params.name)
                                        //   return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + params.value[1]
                                        // },
                                        axisPointer: {
                                            animation: false
                                        }
                                    },
                                    xAxis: [{
                                        type: 'category',
                                        nameTextStyle: { //名称的样式
                                            color: '#999',
                                            fontSize: '12px'
                                        },
                                        nameGap: 0, //名称与X轴的距离
                                        boundaryGap: false, //坐标的刻度是否在中间
                                        // min: '0', //坐标轴刻度最小值
                                        // max: 'dataMax', //坐标轴刻度的最大值
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
                                            interval: 0,
                                            textStyle: {
                                                color: '#8e8e8e',
                                                fontSize: 10
                                            }
                                        },
                                        data: _getAxig('other', 'F_NAME')

                                    }],
                                    grid: {
                                        top: '25%',
                                        left: '5%',
                                        right: '5%',
                                        bottom: '10%',
                                        containLabel: true
                                    },
                                    yAxis: [{
                                        type: 'value', //类型数值轴
                                        // name:'(人)',    //坐标轴名称
                                        textStyle: { //名称的样式
                                            color: '#999',
                                            fontSize: '8px'
                                        },
                                        nameGap: 3, //名称与Y轴的距离
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
                                        boundaryGap: [0, '100%'],
                                    }],
                                    series: test2(),
                                    color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                }
                                break;
                        }
                    }

                    return null
                }
                break;
                // 带提示的面积图
            case 'Area_cutpoint':
                return function(raw) {
                    if (raw) {

                    }
                }
                break;
                // 标准散点图
            case 'Scatter':
                return function(raw) {

                }
                break;
                // 标准气泡图
            case 'Bubble':
                return function(raw) {

                }
                break;
                // 百分比圆环仪表图
            case 'Dashboard_PercentDashboard':
                return function(raw, name, _type) {

                    function conversion() {
                        var _p = _getValue(raw['indicatorData'][0].data[1]) / _getValue(raw['indicatorData'][0].data[0])
                        var _s = _p.toFixed(2) * 100
                        return _s
                    }
                    console.log(raw)
                    if (raw) {
                        switch (_type) {
                            case '0':
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
                                        data: [{ value: conversion(), name: raw['indicatorData'][0].data.lable }]
                                    }],
                                    color: ['rgba(244,32,18,0.8)', 'rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                }
                                break;

                            case '1':
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
                                            color: '#0088EB',
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
                                        name: raw['indicatorData'][0].data.lable,
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
                                        data: [{ value: conversion(), name: raw['indicatorData'][0].data.lable }]
                                    }],

                                }
                                break;
                        }

                    }
                }
                break;
                // 百分比刻度槽仪表盘
            case 'Dashboard_PercentScaleDashboard':
                return function(raw, name, _type) {
                    if (raw) {
                        switch (_type) {
                            case '0':
                                return {
                                    tooltip: {
                                        formatter: "{a} <br/>{b} : {c}%",
                                        confine: true,
                                    },
                                    toolbox: {
                                        feature: {
                                            show: false,
                                            restore: {},
                                            saveAsImage: {}
                                        }
                                    },
                                    series: [{
                                        pointer: {
                                            width: 2,
                                            shadowBlur: 5
                                        },
                                        splitNumber: 5,
                                        name: raw['indicatorData'][0].data.lable,
                                        type: 'gauge',
                                        data: [{ value: raw['indicatorData'][0].data[0]['F_TYPE_1'], name: raw['indicatorData'][0].data.lable }]
                                    }]
                                }
                                break;

                            case '1':
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
                                            color: '#0088EB',
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
                                        pointer: {
                                            width: 2,
                                            shadowBlur: 5
                                        },
                                        name: raw['indicatorData'][0].data.lable,
                                        type: 'gauge',
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
                                            }
                                        },
                                        data: [{ value: raw['indicatorData'][0].data[0]['F_TYPE_1'], name: raw['indicatorData'][0].data.lable }]
                                    }],
                                    color: ['rgba(244,32,18,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(33,150,243,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                }
                                break;
                        }
                    }
                }
                break;
                // 试管型仪表盘
            case 'Dashboard_TubeDashboard':
                return function(raw) {

                }
                break;
                // 热力图
            case 'Heat':
                return function(raw) {

                }
                break;
                // 迷你图
            case 'Sparklines':
                return function(raw) {

                }
                break;
                // 流向图
            case 'FlowMap':
                return function(raw) {

                }
                break;
                // 文字面板
        }
    }

    return {
        // init: api.getData('GetTerm'),
        Dc: initTerms.init,
        Mr: mapReturn.mr
    }
})