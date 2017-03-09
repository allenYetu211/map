function printObject (obj) {
  function _p (_obj, index, len, _level) {
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
    } else if (Object.prototype.toString.call( _obj ) === '[object Array]') {
      str += '[\n' + _obj.reduce(function (str, item, idx) {
        return str + space + _p(item, idx, _obj.length - 1, _level + 1)
      }, '') + space + ']'
    } else if (Object.prototype.toString.call( _obj ) === '[object Object]') {
      str += '{\n' + Object.keys(_obj).reduce(function (str, key, idx) {
        return str + space + key + ': ' + _p(_obj[key], idx, Object.keys(_obj).length - 1, _level + 1)
      }, '') + space + '}'
    } else {
      str += '???'
    }

    return str + (index <  len ? ',' : '') + '\n'
  }

  // console.log(_p(obj, 0, 0, 0))
}


define(['map',"jquery", "userservice"], function(map, j, us) {

    function addThemeMap(o){
        // console.log('{' + o + '}')
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



  // $('body').on('click', '#bottom-sidebar .button_d', function(el) {

  //   if ($(this).hasClass('active')) {
  //     return
  //   }

  //   $(this).addClass('active').siblings().removeClass('active');
  //   $('#left-sidebar, #right-sidebar').find('.mouseMove').parents('.information').remove()

  //   api.getData('GetIndicatorCount', {
  //     termID: el.target.dataset.id
  //   })

  // })
  $('.map1').on('click', function () {
    $('#left-sidebar, #right-sidebar').removeClass('dark')
  })

  $('.map2').on('click', function () {
    $('#left-sidebar, #right-sidebar').addClass('dark')
  })

  $('.zoomout').on('click', function () {
    map.Ly.enlarge()
  })

   $('.zoomin').on('click', function () {
    map.Ly.narrow()
  })

  $('.openCloseSidebar-left').on('click', function () {
    $('#left-sidebar').toggleClass('close')
  })
   
   $('.openCloseSidebar-right').on('click', function () {
    $('#right-sidebar').toggleClass('close')
  })

  $('.prev-button').on('click', function () {
    controlStage.initCount--
    if (controlStage.initCount <= 1) {
      $('.prev-button').addClass('active')
    }
    if (controlStage.initCount < 1) {
      controlStage.initCount = 1
      return
    }
    $('.next-button').removeClass('active')
    $('#left-sidebar, #right-sidebar').find('.mouseMove').parents('.information').remove()
    $('.button_d')
    .eq(controlStage.initCount - 1)
    .addClass('active')
    .siblings()
    .removeClass('active')
    switchPhase(controlStage.initCount)
  })

  $('.next-button').on('click', function () {
    controlStage.initCount++
    if (controlStage.initCount >= 8) {
      $('.next-button').addClass('active')
    }
    if (controlStage.initCount > $('.button_d').length) {
      controlStage.initCount = $('.button_d').length
      return
    }
    $('.prev-button').removeClass('active')
    $('#left-sidebar, #right-sidebar').find('.mouseMove').parents('.information').remove()
    $('.button_d')
    .eq(controlStage.initCount - 1)
    .addClass('active')
    .siblings()
    .removeClass('active')
    switchPhase(controlStage.initCount)
  })

  var controlStage = {
    initCount : 1
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
            console.log(map)
              // console.log(encodeURI(encodeURI(data)))
            initTerms.initTermsPages()
          } else if (address === 'GetIndicatorCount') {
            initTerms._indicator = JSON.parse(data)
            initTerms.init()
            initTerms.callBackMapData = []
          } else if (address === 'GetIndicatorData') {
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



  var testData2 = {
    success: true,
    indicatorData: [{
      minScale: 11,
      maxScale: 13,
      stack: "第一类",
      other: [{
        F_NAME: "尚田镇1",
        label: "名称"
      }, {
        F_CODE: "330283103",
        label: "编码"
      }, {
        F_CENTER: "POINT (121.38 29.55)",
        label: "中心点"
      }],
      data: [{
        F_TYPE_1: "3333",
        lable: "人口数量"
      }, {
        F_TYPE_1: "1619",
        lable: "人口数量"
      }, {
        F_TYPE_1: "222",
        lable: "人口数量"
      }]
    }, {
      minScale: 11,
      maxScale: 13,
      stack: "第二类",
      other: [{
        F_NAME: "尚田镇2",
        label: "名称"
      }, {
        F_CODE: "330283103",
        label: "编码"
      }, {
        F_CENTER: "POINT (121.38 29.55)",
        label: "中心点"
      }],
      data: [{
        F_TYPE_2: "2321",
        lable: "土地面积"
      }, {
        F_TYPE_2: "3322",
        lable: "土地面积"
      }, {
        F_TYPE_2: "22662",
        lable: "土地面积"
      }]
    }, {
      minScale: 11,
      maxScale: 13,
      stack: "第一类",
      other: [{
        F_NAME: "尚田镇3",
        label: "名称"
      }, {
        F_CODE: "330283103",
        label: "编码"
      }, {
        F_CENTER: "POINT (121.38 29.55)",
        label: "中心点"
      }],
      data: [{
        F_TYPE_3: "2331",
        lable: "农业数量"
      }, {
        F_TYPE_3: "321",
        lable: "农业数量"
      }, {
        F_TYPE_3: "4312",
        lable: "农业数量"
      }]
    }]
  }


var testData3 = {
    success: true,
  indicatorData: [{
      minScale: 11,
      maxScale: 13,
      stack: "第一类",
      other: [{
        F_NAME: "土地",
        F_VILLGAE : '村1',
        label: "名称"
      }, {
        F_CODE: "330283103",
        label: "编码"
      }, {
        F_CENTER: "POINT (121.38 29.55)",
        label: "中心点"
      }],
       data: [{
        F_TYPE_1: "1111"
      }, {
        F_TYPE_1: "1211"

      }, {
        F_TYPE_1: "1311"
      }]
    },{
      minScale: 11,
      maxScale: 13,
      stack: "第一类",
      other: [{
        F_NAME: "土地2",
        F_VILLGAE : '村2',
        label: "名称"
      }, {
        F_CODE: "330283103",
        label: "编码"
      }, {
        F_CENTER: "POINT (121.38 29.55)",
        label: "中心点"
      }],
      data: [{
        F_TYPE_2: "2111"
      }, {
        F_TYPE_2: "2211"

      }, {
        F_TYPE_2: "2311"
      }]
    },{
      minScale: 11,
      maxScale: 13,
      stack: "第一类",
      other: [{
        F_NAME: "土地3",
        F_VILLGAE : '村3',
        label: "名称"
      }, {
        F_CODE: "330283103",
        label: "编码"
      }, {
        F_CENTER: "POINT (121.38 29.55)",
        label: "中心点"
      }],
      data: [{
        F_TYPE_3: "3111"
      }, {
        F_TYPE_3: "3211"

      }, {
        F_TYPE_3: "3311"
      }]
    }]
  }
  function switchPhase(theId) {
    api.getData('GetIndicatorCount', {
      termID: theId
    })
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
    callBackMapData : [],
    init: function(_level = '0', _code = '330283103') {
      var handleKeyValues = []
      var location = ''
      var locationClass = ''
      var chartType = ''
      for (let i = 0; i < this._indicator.indicators.length; i++) {

        handleKeyValues[i] = getTransformer(this._indicator.indicators[i].indicatorType)

        if (this._indicator.indicators[i].location === 'left') {
          location = '.left-cnj'
        } else {
          location = '.right-cnj'
        }

        if (this._indicator.indicators[i].type === '0') {
          chartType = locationClass = 'type-big'
        } else if (this._indicator.indicators[i].type === '1') {
          chartType = locationClass = 'type-middle'
        } else if (this._indicator.indicators[i].type === '2') {
          chartType = locationClass = 'type-small'
        }
        

        if ($(location).find('.mouseMove').hasClass('draw_' + this._indicator.indicators[i].indicatorID)) {
          return
        } else {

          $(location).append("<div class='information " + locationClass + "-parent'> <a href='" + this._indicator.indicators[i].theme['url'] + "'></a><div class='mouseMove " + locationClass + " draw_" + this._indicator.indicators[i].indicatorID + " '></div></div>");
        }

        api.getData('GetIndicatorData', {
          indicatorID: this._indicator.indicators[i].indicatorID,
          level: _level,
          code: _code
        }, () => {
          if (this._indicator.indicators[i].indicatorType === 'Text') {
            draw.chartText(this.processData, i)
          } else if (this._indicator.indicators[i].indicatorType === 'Column_CustomAxisLabel3' ||this._indicator.indicators[i].indicatorType ===  'Line_FlashingLineChart') {
            draw.echart(handleKeyValues[i](testData3, this._indicator.indicators[i].indicatorName, this._indicator.indicators[i].type), i)
          }  else {
            draw.echart(handleKeyValues[i](this.processData, this._indicator.indicators[i].indicatorName, this._indicator.indicators[i].type), i)
          }
          this.callBackMapData.push(callBackMap(this.processData, this._indicator.indicators))
          console.log(this.callBackMapData)
          us.addLayers(this.callBackMapData);
        })
      }
    },
    handleKeyValue: null
  }

  var draw = {
      echart(_data, _i) {
        var _b = $('.draw_' + initTerms._indicator.indicators[_i].indicatorID);
        var echart = echarts.init(_b[0]);
        var option = _data;
        echart.setOption(option);
      },
      chartText(_data, _i) {
        var _b = $('.draw_' + initTerms._indicator.indicators[_i].indicatorID);
        for (var i = 0; i < _data.indicatorData[0].data.length; i++) {
          for (var k in _data.indicatorData[0].data[i]) {
            if (k !== 'lable') {
              _b.append('<div class="typeText"><span>' + _data.indicatorData[0].data[i].lable + '</span><span>' + _data.indicatorData[0].data[i][k] + '</span></div>')
            }
          }
        }
      }
    }

  var callBackMap = function (_count, _data) {
    function _getValue(item) {
            var _key = Object.keys(item).find(function(k) {
              return /F_TYPE/.test(k)
            })
            return item[_key]
          }
    return {
      mapType: _data[0].mapType,
      minScale: _count['indicatorData'][0].minScale,
      maxScale: _count['indicatorData'][0].maxScale,
      width: _count['indicatorData'][0].width,
      center: _count['indicatorData'][0].center,
      other: _count['indicatorData'][0].other,
       data: _count['indicatorData'][0].data.reduce(function(array, item) {
            return array.concat({ name: item['lable'], value: _getValue(item) })
          }, [])
    }
  }

  // 数据结构转换
  var getTransformer = function(type) {
    switch (type) {
      // 普通饼图
      case 'Pie_PieChart':
        return function(raw, name) {
          function _getValue(item) {
            var _key = Object.keys(item).find(function(k) {
              return /F_TYPE/.test(k)
            })
            return item[_key]
          }
          if (raw) {
            var _indicatorData = raw['indicatorData'][0]
            if (_indicatorData) {
              return {
                title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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

          function _getValue(item) {
            var _key = Object.keys(item).find(function(k) {
              return /F_TYPE/.test(k)
            })

            return item[_key]
          }
          if (raw) {
            var _indicatorData = raw['indicatorData'][0]
            if (_indicatorData) {
              return {
                title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
          function _getValue(item) {
            var _key = Object.keys(item).find(function(k) {
              return /F_TYPE/.test(k)
            })
            return item[_key]
          }
          if (raw) {
            switch (_type) {
              case '0':
                return {
                  // backgroundColor: '#fff',
                  tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                  },
                  title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
                    left: '70%',
                    top: '17%',
                    textStyle: {
                      color: '#333',
                      fontStyle: 'normal',
                      fontWeight: 'bolder',
                      fontFamily: 'sans-serif',
                      color: '#999',
                      fontSize: 12,
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
                    radius: ['53%', '77%'],
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
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                  },
                  title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
                    left: 'left',
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
                    radius: ['40%', '55%'],
                    center: ['55%', '50%'],
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
          function _getValue(item) {
            var _key = Object.keys(item).find(function(k) {
              return /F_TYPE/.test(k)
            })

            return item[_key]
          }

          if (raw) {
            var _indicatorData = raw['indicatorData'][0]
            if (_indicatorData) {
              return {
                title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
                xAxis: {
                  data: _indicatorData.reduce(function(arr, item) {
                    return arr.concat(item['lable'])
                  }, []),
                  // 样式设计修改
                  axisLabel: {
                    inside: false,
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

            function _getValue(item) {
              var _key = Object.keys(item).find(function(k) {
                return /F_TYPE/.test(k)
              })
              return item[_key]
            }

            function _getAxig(_type, attr) {
              return raw['indicatorData'].reduce(function(arr, item) {
                var _items = ''
                item[_type].forEach(function(_item) {
                  if (_item[attr] !== undefined) {
                    _items = _item[attr]
                  }
                })
                return arr.concat(_items)
              }, [])
            }

            switch (_type) {
              case '0':
                return {
                legend: {
                    data: _getAxig('other', 'F_VILLGAE')
                },
                  title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
                      show : true,
                      lineStyle:{
                        color : '#d1d1d1',
                        width : 1,
                      },
                    },
                    axisTick: {
                      show : false,
                    },
                    axisLabel: {
                      margin:5,
                      textStyle:{
                        color : '#8e8e8e',
                        fontSize: 10
                      }
                    },
                    data: _getAxig('other', 'F_NAME')
                  }],
                  yAxis: [{
                    type: 'value',
                    axisLine: {
                      show : false
                    },
                    axisTick: {
                      show : false
                    },
                    axisLabel: {
                      inside : true,
                      interval : 1,
                      margin:5,
                      textStyle:{
                        color : '#D4D4D4',
                        fontSize: 10
                      }
                    },
                    splitLine:{
                      lineStyle:{
                        color : '#eaeaea',
                        width : 0.5,
                      },
                    },
                  }],
                  series: raw['indicatorData'].reduce(function(arr, item) {
                    var _items = ''
                    var _lable = ''
                    var _name = ''
                    for (let i = 0; i < item['other'].length; i++) {
                      if (item['other'][i]['F_VILLGAE'] !== undefined) {
                          _name = item['other'][i]['F_VILLGAE']
                      }
                    }
                    _items = item['data'].reduce(function(_arr, _item) {
                        _lable = _item['lable']
                        return _arr.concat(_getValue(_item))
                      }, [])
                    return arr.concat({ name: _name, stack: item['stack'], type: 'bar', data: _items })
                  }, []),
                  color: ['rgba(244,32,18,0.8)','rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                }
                break;

              case '1':
                 return {
                  title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
                      show : true,
                      lineStyle:{
                        color : '#d1d1d1',
                        width : 1,
                      },
                    },
                    axisTick: {
                      show : false,
                    },
                    axisLabel: {
                      margin:5,
                      textStyle:{
                        color : '#8e8e8e',
                        fontSize: 10
                      }
                    },
                    data: _getAxig('other', 'F_NAME')
                  }],
                  yAxis: [{
                    type: 'value',
                    axisLine: {
                      show : false
                    },
                    axisTick: {
                      show : false
                    },
                    axisLabel: {
                      inside : true,
                      interval : 1,
                      margin:5,
                      textStyle:{
                        color : '#D4D4D4',
                        fontSize: 10
                      }
                    },
                    splitLine:{
                      lineStyle:{
                        color : '#eaeaea',
                        width : 0.5,
                      },
                    },
                  }],
                  series: raw['indicatorData'].reduce(function(arr, item) {
                    var _items = ''
                    var _lable = ''
                    var _name = ''
                    for (let i = 0; i < item['other'].length; i++) {
                      if (item['other'][i]['F_VILLGAE'] !== undefined) {
                          _name = item['other'][i]['F_VILLGAE']
                      }
                    }
                    _items = item['data'].reduce(function(_arr, _item) {
                        _lable = _item['lable']
                        return _arr.concat(_getValue(_item))
                      }, [])
                    return arr.concat({ name: _name, stack: item['stack'], type: 'bar', data: _items })
                  }, []),
                  barGap:'0%',
                  barCategoryGap: '50%',
                  barMaxWidth: '30%',
                  color: ['rgba(244,32,18,0.8)','rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
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
                var _items = ''
                item[_type].forEach(function(_item) {
                  if (_item[attr] !== undefined) {
                    _items = _item[attr]
                  }
                })
                return arr.concat(_items)
              }, [])
            }
          function _getValue(item) {
            var _key = Object.keys(item).find(function(k) {
              return /F_TYPE/.test(k)
            })

            return item[_key]
          }
          if (raw) {
            switch (_type) {
              case '0':
                return {
                  title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
                    // 根据需要改写
                    trigger: 'axis',
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
                      show : true,
                      lineStyle:{
                        color : '#d1d1d1',
                        width : 1,
                      },
                    },
                    axisTick: {
                      show : false,
                    },
                    axisLabel: {
                      margin:5,
                      textStyle:{
                        color : '#8e8e8e',
                        fontSize: 10
                      }
                    },
                    data: _getAxig('other', 'F_NAME'),
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
                      show : false
                    },
                    axisTick: {
                      show : false
                    },
                    axisLabel: {
                      inside : true,
                      interval : 1,
                      margin:5,
                      textStyle:{
                        color : '#D4D4D4',
                        fontSize: 10
                      }
                    },
                    splitLine:{
                      lineStyle:{
                      //formatter: '{value} °C',//标签内容内置的格式转化器比如这个表示在后面加一个c
                        color : '#eaeaea',
                        width : 0.5,
                      },
                    },
                  }],
                  series: raw['indicatorData'].reduce(function(arr, item) {
                    var _items = ''
                    var _lable = ''
                    var _name = ''
                    for (let i = 0; i < item['other'].length; i++) {
                      if (item['other'][i]['F_VILLGAE'] !== undefined) {
                          _name = item['other'][i]['F_VILLGAE']
                      }
                    }
                    _items = item['data'].reduce(function(_arr, _item) {
                        _lable = _item['lable']
                        return _arr.concat(_getValue(_item))
                      }, [])
                    return arr.concat({ name: _name, type: 'line', data: _items })
                  }, []),

                    color: ['rgba(244,32,18,0.8)','rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                  
                }
                break;

              case '1':
                return {
                  title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
                    // 根据需要改写
                    trigger: 'axis',
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
                      show : true,
                      lineStyle:{
                        color : '#d1d1d1',
                        width : 1,
                      },
                    },
                    axisTick: {
                      show : false,
                    },
                    axisLabel: {
                      margin:5,
                      textStyle:{
                        color : '#8e8e8e',
                        fontSize: 10
                      }
                    },
                     data: _getAxig('other', 'F_NAME'),

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
                      show : false
                    },
                    axisTick: {
                      show : false
                    },
                    axisLabel: {
                      inside : true,
                      interval : 1,
                      margin:5,
                      textStyle:{
                        color : '#D4D4D4',
                        fontSize: 10
                      }
                    },
                    splitLine:{
                      lineStyle:{
                        color : '#eaeaea',
                        width : 0.5,
                      },
                    },
                    boundaryGap: [0, '100%'],
                  }],
                   series: raw['indicatorData'].reduce(function(arr, item) {
                    var _items = ''
                    var _lable = ''
                    var _name = ''
                    for (let i = 0; i < item['other'].length; i++) {
                      if (item['other'][i]['F_VILLGAE'] !== undefined) {
                          _name = item['other'][i]['F_VILLGAE']
                      }
                    }
                    _items = item['data'].reduce(function(_arr, _item) {
                        _lable = _item['lable']
                        return _arr.concat(_getValue(_item))
                      }, [])
                    return arr.concat({ name: _name, type: 'line', data: _items })
                  }, []),
                  color: ['rgba(244,32,18,0.8)','rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
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
          if (raw) {
            switch (_type) {
              case '0':
                return {
                  tooltip: {
                    formatter: "{a} <br/>{b} : {c}%"
                  },
                  toolbox: {
                    feature: {
                      restore: {},
                      saveAsImage: {}
                    }
                  },
                  series: [{
                    splitNumber: 10,
                    name: raw['indicatorData'][0].data.lable,
                    type: 'gauge',
                    data: [{ value: raw['indicatorData'][0].data[0]['F_TYPE_1'], name: raw['indicatorData'][0].data.lable }]
                  }],
                  color: ['rgba(244,32,18,0.8)','rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                }
                break;

              case '1':
                return {
                  title: {
                    text: name,
                    subtext: '',
                    x: 'left',
                    left:10,
                    top:10,
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
                    formatter: "{a} <br/>{b} : {c}%"
                  },
                  toolbox: {
                    show : false,
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
                        color: [[0.2, 'rgba(76,175,80,0.8)'],[0.8, 'rgba(33,150,243,1)'],[1, 'rgba(233,30,99,1)']],
                      },
                    },
                    axisTick: { // 坐标轴小标记
                      length: 8, // 属性length控制线长
                      lineStyle: { // 属性lineStyle控制线条样式
                        color: 'rgba(0,0,0,0.3)',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 1,
                        width:1
                      }
                    },
                    axisLabel: {
                      textStyle:{
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 10,
                      }
                      
                    },
                    splitLine: { // 分隔线
                      length: 12, // 属性length控制线长
                      lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 2,
                      }
                    },
                    pointer:{
                      width:3,
                      length: '80%',
                    },
                    itemStyle:{
                      normal:{
                        color:'rgba(244,32,18,1)',
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
                    color: ['rgba(244,32,18,0.8)','rgba(33,150,243,0.8)', 'rgba(233,30,99,0.8)', 'rgba(156,38,176,0.8)', 'rgba(63,81,181,0.8)', 'rgba(2,188,212,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
                    data: [{ value: raw['indicatorData'][0].data[0]['F_TYPE_1'], name: raw['indicatorData'][0].data.lable }]
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
                    formatter: "{a} <br/>{b} : {c}%"
                  },
                  toolbox: {
                    feature: {
                      show : false,
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
                    left:10,
                    top:10,
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
                    formatter: "{a} <br/>{b} : {c}%"
                  },
                  toolbox: {
                    show : false,
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
                        color: [[0.2, 'rgba(76,175,80,0.8)'],[0.8, 'rgba(33,150,243,1)'],[1, 'rgba(233,30,99,1)']],
                      },
                    },
                    axisTick: { // 坐标轴小标记
                      length: 8, // 属性length控制线长
                      lineStyle: { // 属性lineStyle控制线条样式
                        color: 'rgba(0,0,0,0.3)',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 1,
                        width:1
                      }
                    },
                    axisLabel: {
                      textStyle:{
                        color: 'rgba(0,0,0,0.4)',
                        fontSize: 10,
                      }
                    },
                    splitLine: { // 分隔线
                      length: 12, // 属性length控制线长
                      lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 2,
                      }
                    },
                    pointer:{
                      width:3,
                      length: '80%',
                    },
                    itemStyle:{
                      normal:{
                        color:'rgba(244,32,18,1)',
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
                        color : 'rgba(96,125,139,0.8)',
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
      case 'Text':
        return function(raw) {
          if (raw) {
            return {
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              legend: {
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
              }],
              yAxis: [{
                type: 'value'
              }],
              series: [{
                name: '直接访问',
                type: 'bar',
                data: [320, 332, 301, 334, 390, 330, 320]
              }, {
                name: '邮件营销',
                type: 'bar',
                stack: '广告',
                data: [120, 132, 101, 134, 90, 230, 210]
              }, {
                name: '联盟广告',
                type: 'bar',
                stack: '广告',
                data: [220, 182, 191, 234, 290, 330, 310]
              }, {
                name: '视频广告',
                type: 'bar',
                stack: '广告',
                data: [150, 232, 201, 154, 190, 330, 410]
              }, {
                name: '搜索引擎',
                type: 'bar',
                data: [862, 1018, 964, 1026, 1679, 1600, 1570],
                markLine: {
                  lineStyle: {
                    normal: {
                      type: 'dashed'
                    }
                  },
                  data: [
                    [{ type: 'min' }, { type: 'max' }]
                  ]
                }
              }, {
                name: '百度',
                type: 'bar',
                barWidth: 5,
                stack: '搜索引擎',
                data: [620, 732, 701, 734, 1090, 1130, 1120]
              }, {
                name: '谷歌',
                type: 'bar',
                stack: '搜索引擎',
                data: [120, 132, 101, 134, 290, 230, 220]
              }, {
                name: '必应',
                type: 'bar',
                stack: '搜索引擎',
                data: [60, 72, 71, 74, 190, 130, 110]
              }, {
                name: '其他',
                type: 'bar',
                stack: '搜索引擎',
                data: [62, 82, 91, 84, 109, 110, 120]
              }]
            };
          }
        }
        break;
    }
  }

  return {
    init: api.getData('GetTerm'),
  }
})