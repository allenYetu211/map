define("chartInformations", ['map', "jquery", "userservice", "translatePopup", 'local', 'api', 'common'], function(map, j, us, c, l, _API, common) {
    if (l._Lh !== 'Data_Display.html') {
        return
    }


    // require(["common"], function(common) {
    // common.mapHelper.vec()
    // });





    /**
     * Dom 操作集
     */
    $('.map1').on('click', function() {
        $('.map1').addClass('active')
        $('.map2').removeClass('active')
        $('.map1 img').attr('src', 'images/chart/mapmode1active.png')
        $('.map2 img').attr('src', 'images/chart/mapmode2.png')
        $('#top-sidebar, #left-sidebar, #right-sidebar, .popupMenuInformation, .formData , #controlPanel').removeClass('dark'),
            $('.logo img, .formData img').attr('src', 'images/chart/logo@2x.png')
        $('.tableTab').attr('src', 'images/chart/index_table_light.png')
        $('.swTable').attr('src', 'images/chart/sw-light.png')
        $('.zhTable').attr('src', 'images/chart/zh-light.png')
        $('.showFieldData img').attr('src', 'images/chart/sw-light.png')
        common.mapHelper.vec()
    })

    $('.map2').on('click', function() {
        $('.map1').removeClass('active')
        $('.map2').addClass('active')
        $('.map1 img').attr('src', 'images/chart/mapmode1.png')
        $('.map2 img').attr('src', 'images/chart/mapmode2active.png')
        $('#top-sidebar,#left-sidebar, #right-sidebar, .popupMenuInformation, .formData, #controlPanel').addClass('dark'),
            $('.logo img, .formData img').attr('src', 'images/chart/logodark@2x.png')
        $('.tableTab').attr('src', 'images/chart/index_table_dark.png')
        $('.swTable').attr('src', 'images/chart/sw-dark.png')
        $('.zhTable').attr('src', 'images/chart/zh-dark.png')
        $('.showFieldData img').attr('src', 'images/chart/sw-dark.png')
        common.mapHelper.img()

    })

    $('.zoomout').on('click', function() {
        map.Ly.enlarge()
    })

    $('.zoomin').on('click', function() {
        map.Ly.narrow()
    })

    $('.openCloseSidebar-left').on('click', function() {
        $('#left-sidebar').toggleClass('closed')
    })

    $('.openCloseSidebar-right').on('click', function(e) {
        e.stopPropagation()
            // console.log('执行次数')
        $('#right-sidebar').toggleClass('closed')
    })

    $('.prev-button').on('click', function() {
        storage.initCount--
            if (storage.initCount <= 1) {
                $('.prev-button').addClass('active')
            }
        if (storage.initCount < 1) {
            storage.initCount = 1
            return
        }
        $('.next-button').removeClass('active')

        $('#left-sidebar, #right-sidebar').find('.mouseMove').parents('.information').remove()
        $('.button_d')
            .eq(storage.initCount - 1)
            .addClass('active')
            .siblings()
            .removeClass('active')
        InvestigationStage.termID = storage.initCount
        sendRequest.GetIndicators('-1')
    })
    $('._tbmLaber').on('click', function() {
        console.log($(this).next())
        $(this).next().slideToggle().siblings('.cp-oninter').slideUp()
            // $(this)
    })

    $('.next-button').off().on('click', function() {
        storage.initCount++
            if (storage.initCount >= InvestigationStage.terms.length) {
                $('.next-button').addClass('active')
            }
        if (storage.initCount > $('.button_d').length) {
            storage.initCount = $('.button_d').length
            return
        }
        $('.prev-button').removeClass('active')
        $('#left-sidebar, #right-sidebar').find('.mouseMove').parents('.information').remove()
        $('.button_d')
            .eq(storage.initCount - 1)
            .addClass('active')
            .siblings()
            .removeClass('active')
            // switchPhase(storage.initCount)
        InvestigationStage.termID = storage.initCount
        sendRequest.GetIndicators('-1')



    })

    // $('body').on('click', '.mouseMove', function() {
    //     drawOn.draw($(this).data('index'))
    //     cblin._indicatorId = $(this).data('index')
    // })


    $('body').on('click', 'button._isMap', function() {
        sendRequest.GetIndicators('-1', 330283)
        us.Layers.delLayers();
        map.Ly.addTileLayer('http://124.207.115.117:8089/ReadTile.ashx?Layer=', 'D:\\\\ZJDATA\\\\切片数据\\\\gask_xgt')
    })

    $('.left-cnj,.right-cnj').on('click', ' .mouseMove', function(e) {

        if (!$(this).hasClass('_isMap')) {
            return
        }
        e.stopPropagation()
        map.Layers.delLayers();
        // console.log($('.isMap'))
        if ($(this).hasClass('drawMap')) {
            $(this).removeClass('drawMap')
            map.Layers.delLayers();
            return

        } else {
            $('._isMap, .mouseMove').removeClass('drawMap')
            $(this).addClass('drawMap')
        }

        storage.indicatorID = $(this).data('index')
        storage.mbMapType = $(this).data('type')
        storage.mbMapSizeType = $(this).data('sizemap')
        storage.mbMapName = $(this).data('name')
        drawOn.draw($(this).data('index'))
    })


    $('.layer').on('click', function() {
        $('.CatalogPopup').toggleClass('open')
    })

    $('body').on('click', '._option', function(e) {
        e.stopPropagation()
        if ($(this).hasClass('open')) {
            $(this).removeClass('open')
            console.log($(this).parents('li').find('ul').remove())
        } else {
            $(this).addClass('open')
            sendRequest.GetDataByCatalogID($(this).data('id'), $(this))
        }
    })

    $('body').on('click', '.clickChoice', function() {
        if ($(this).hasClass('active')) {
            $(this).find('img').attr('src', 'images/chart/icon_mapnotchoice@2x.png')
            $(this).removeClass('active')
            map.Ly.map.off('click')
        } else {
            $(this).find('img').attr('src', 'images/chart/icon_mapchoice@2x.png')
            $(this).addClass('active')
            storage.tn = $(this).data('tn')
            map.Ly.map.off('click').on('click', function(e) {
                storage.maplayerPoint = e.layerPoint
                sendRequest.GetPointData(e.latlng)
            })
        }
    })



    $('body').on('click', '.basemap', function() {
        var newData = $(this).data('tp').replace(/\//g, '\\\\');
        map.Ly.addTileLayer('http://124.207.115.117:8089/ReadTile.ashx?Layer=', newData);
    })


    $('.clearmap').on('click', function() {
        map.Ly.map.off('click')
        $('.clickChoice').find('img').attr('src', 'images/chart/icon_mapnotchoice@2x.png')
    })

    $('.popupMenuInformation ._close').on('click', function() {
        $('.popupMenuInformation').removeClass('open')
    })

    $('.selectSearchbar').on('click', function() {
        if ($('.searchbar').val().trim() == '') return
        sendRequest.IndiatorSearch($('.searchbar').val())
        $('.filedCondition').show()
    })

    $('.searchbar').on('keydown', function(e) {
        if (e.keyCode == 13) {
            if ($('.searchbar').val().trim() == '') return
            sendRequest.IndiatorSearch($('.searchbar').val())
            $('.filedCondition').show()
        }
        if (e.keyCode == 8) {
            if ($('.searchbar').val().length <= 1) {
                sendRequest.GetIndicators()
            }
        }
    })

    $('.searchbar-Emptied').on('click', function() {
        $('.searchbar').val('')
        sendRequest.GetIndicators()
    })

    $('body').on('click', '._valName', function() {
        var arr = []
        arr.push($(this).data('centerx'))
        arr.push($(this).data('centery'))
        common.mapHelper.__setView(arr, $(this).data('minscale'))
        common.map.panTo(arr);
        sendRequest.GetIndicators($(this).data('serarchid'), $(this).data('code'))
        $('.filedCondition').hide()
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
            surveyCode: l._Lg('___surveyCode'),
            surveyLevel: l._Lg('___surveyLeve')
        }
        /**
         * 阶段列表
         */
    var InvestigationStage = {
            list: '',
            termID: ''
        }
        /**
         * 仓库存处数据信息。
         */
    var storage = {
            chartData: '',
            menuList: '',
            menuListLevel: '',
            menuListArr: [],
            sendCount: '',
            requestCount: -1,
            menuNewData: [],
            tn: '',
            mapDataList: [],
            maplayerPoint: '',
            menuListTrdata: '',
            indicatorID: '',
            mapType: '',
            mapCbData: '',
            mbMapType: '',
            mbMapSizeType: '',
            mbMapName: '',
            initCount: 1,
            searchlist: '',
            _stage_: '',
            UserLogin_surveyCode: '',
            flag: true
        }
        /**
         *   api 请求地址
         * 
         * */
        // var api = {
        //     getmainData: function(address, theInput, fn) {
        //         $.ajax({
        //             type: 'POST',
        //             // 服务端跨域
        //             // url: "/thememap/THService/MainManage.asmx/" + address,
        //             // 本地跨域
        //             url: "http://122.224.94.108:8002/THService/MainManage.asmx/" + address,
        //             data: theInput,
        //             contentType: "application/x-www-form-urlencoded",
        //             success: function(data) {
        //                 var translateData = JSON.parse(data)
        //                 fn(translateData)
        //             },
        //             erroer: function(error) {
        //                 console.log('error:', error)
        //             }
        //         })
        //     },
        //     getData: function(address, theInput, fn) {
        //         var theInput_ = theInput || ''
        //         $.ajax({
        //             type: 'POST',
        //             // 服务端跨域
        //             // url: "/thememap/THService/DataShow.asmx/" + address,
        //             // 本地跨域
        //             url: "http://122.224.94.108:8002/THService/DataShow.asmx/" + address,
        //             data: theInput_,
        //             contentType: "application/x-www-form-urlencoded",
        //             success: function(data) {
        //                 var translateData = JSON.parse(data)
        //                 fn(translateData)
        //             },
        //             erroer: function(error) {
        //                 console.log('error:', error)
        //             }
        //         })
        //     },

    //     getDataManage: function(address, theInput_, fn) {
    //         $.ajax({
    //             type: 'POST',
    //             // 服务端跨域
    //             // url: "/thememap/THService/DataManage.asmx/" + address,
    //             // 本地跨域
    //             url: "http://122.224.94.108:8002/THService/DataManage.asmx/" + address,
    //             data: theInput_,
    //             contentType: "application/x-www-form-urlencoded",
    //             success: function(data) {
    //                 var translateData = JSON.parse(data)
    //                 fn(translateData)
    //             },
    //             erroer: function(error) {
    //                 console.log('error:', error)
    //             }
    //         })
    //     },

    //     getDevelopment: function(address, theInput_, fn) {
    //         $.ajax({
    //             type: 'POST',
    //             // 服务端跨域
    //             // url: "/thememap/THService/ReportManage.asmx/" + address,
    //             // 本地跨域
    //             url: "http://122.224.94.108:8002/THService/ReportManage.asmx/" + address,
    //             data: theInput_,
    //             contentType: "application/x-www-form-urlencoded",
    //             success: function(data) {
    //                 var translateData = JSON.parse(data)
    //                 fn(translateData)
    //             },
    //             erroer: function(error) {
    //                 console.log('error:', error)
    //             }
    //         })
    //     },
    //     getCetCatgory: function(address, theInput_, fn) {
    //         $.ajax({
    //             type: 'POST',
    //             // 服务端跨域
    //             // url: "/thememap/THService/ReportManage.asmx/" + address,
    //             // 本地跨域
    //             url: "http://122.224.94.108:8002/THService/TaskManage.asmx/" + address,

    //             data: theInput_,
    //             contentType: "application/x-www-form-urlencoded",
    //             success: function(data) {
    //                 var translateData = JSON.parse(data)
    //                 fn(translateData)
    //             },
    //             erroer: function(error) {
    //                 console.log('error:', error)
    //             }
    //         })
    //     },


    //     postFormData: function(address, thInput_, fn) {
    //         $.ajax({
    //             type: 'POST',
    //             // 服务端跨域
    //             // url: "/thememap/THService/ReportManage.asmx/" + address,
    //             // 本地跨域
    //             cache: false,
    //             url: "http://122.224.94.108:8002/THService/ReportManage.asmx/" + address,
    //             data: thInput_,
    //             contentType: 'multipart/form-data',
    //             mimeType: 'multipart/form-data',
    //             processData: false,
    //             contentType: false,
    //             success: function(data) {
    //                 var translateData = JSON.parse(data)
    //                 fn(translateData)
    //             },

    //             erroer: function(error) {
    //                 console.log('error:', error)
    //             }
    //         })
    //     }

    // }

    /**
     * 用户登录
     */
    $('._login').on('click', function() {
        _callUserCode.user = $('.mapUser').val()
        _callUserCode.pasw = $('.mapPasw').val()
        storage.flag = true
        _callUserCode.sendUser(false)
    })

    var _callUserCode = {
        user: '',
        pasw: '',
        sueryCode: '',
        sendUser: function(flag) {
            this.pasw = md5('123456')
            var _request = {
                user: 'liufang',
                pasw: this.pasw
            }
            if (flag) {
                storage.flag = false
            }

            sendRequest.UserLogin(_request)
            return this.sueryCode
        }
    }

    /**
     * 地图回传
     */

    var mapCall = {
            callLevelCode: function(_level, _code) {
                userPermissions.surveyCode = _code
                userPermissions.surveyLevel = _level
                sendRequest.DrawMap(_level, _code)
            }
        }
        /**
         * 发送请求
         */

    var sendRequest = {
        // UserLogin: function(req) {
        //     _API._G('DataShow.asmx/UserLogin', {
        //         userName: req.user,
        //         userPwd: req.pasw
        //     }, function(translateData) {
        //         map.Ly.addTileLayer('http://124.207.115.117:8089/ReadTile.ashx?Layer=', 'D:\\\\ZJDATA\\\\切片数据\\\\gask_xgt')
        //             // userPermissions.surveyCode = translateData.surveyInfo.surveyCode
        //             // userPermissions.surveyLevel = translateData.surveyInfo.surveyLevel
        //             // userPermissions.userID = translateData.userID
        //             // storage.UserLogin_surveyCode = translateData.surveyInfo.surveyCode
        //         require(['infor_reported'], function(_in_) {
        //             _in_.S(translateData.surveyInfo.surveyCode)
        //         })
        //         sendRequest.GetTerm()
        //         if (storage.flag) {

        //             // var _cms = new c._cookie
        //             // $('.formData').hide();
        //             // $('#right-sidebar, #left-sidebar').removeClass(' closed');
        //         }
        //     })
        // },

        GetMapInfo: function() {
            _API._G('DataShow.asmx/GetMapInfo', {
                userID: l._Lg('___userID')
            }, function(data) {
                console.log(data)
            })
        },



        GetTerm: function() {
            _API._G('DataShow.asmx/GetTerm', {}, function(translateData) {
                InvestigationStage.terms = translateData.terms
                InvestigationStage.termID = translateData.terms[0].termID
                storage._stage_ = translateData
                sendRequest.GetIndicators('-1')
                InvestigationStage.terms.forEach(function(_val) {
                    draw.createButton(_val.termID, _val.termName)
                })
            })
        },

        _inforGetTerm: function(fn) {
            var _data = ''
            api.getData('GetTerm', {}, function(translateData) {
                fn(translateData)
            })
        },



        GetIndicators: function(_searchID = '-1', surveyCode) {
            _API._G('DataShow.asmx/GetIndicators', {
                termID: InvestigationStage.termID,
                surveyCode: surveyCode || userPermissions.surveyCode,
                isNextLevel: '0', // 测试默认为0
                searchID: _searchID
            }, function(translateData) {
                storage.chartData = translateData.indiator
                toDealWith.tsData()
            })
        },


        DrawMap: function(level, code) {
            _API._G('DataShow.asmx/GetIndicatorData', {
                indicatorID: storage.indicatorID,
                level: level,
                code: code
            }, function(translateData) {
                storage.mapCbData = translateData
                drawOn.mapDraw()
            })
        },


        GetCatalog: function() {
            _API._G('DataShow.asmx/GetCatalog', {}, function(translateData) {
                storage.menuList = translateData
                sendRequest.GetTerm()
                draw.menuListParent()
            })
        },



        GetDataByCatalogID: function(_id, _t) {
            _API._G('DataShow.asmx/GetDataByCatalogID', {
                catalogID: _id
            }, function(translateData) {
                storage.menuListTrdata = translateData
                storage.menuListTrdata.datas.forEach(function(_val) {
                    var _span = ''
                    if (_val.type == 1) {
                        _span = '<span class="clickChoice" data-tn="' + _val.tableName + '"  ><img src="images/chart/icon_mapnotchoice@2x.png" alt=""></span>'
                    } else {
                        _span = ''
                    }
                    var _ct = '<ul><li class="js_ontp" data-tn="' + _val.tableName + '" data-tp="' + _val.tilePath + '">' + _val.name + '<div class="right-options"> ' + _span + '<span class="basemap" data-tp="' + _val.tilePath + '"><img src="images/chart/icon_mapsort@2x.png" alt=""></span> <span class=""><img src="images/chart/icon_mapfold@2x.png" alt=""></span></div></li></ul>'
                    _t.parents('li').append(_ct)

                })
            })

        },


        GetPointData: function(latlng) {
            _API._G('DataShow.asmx/GetPointData', {
                x: toDealWith.lon2Mercator(latlng.lng),
                y: toDealWith.lat2Mercator(latlng.lat),
                tableName: storage.tn
            }, function(translateData) {
                if (translateData.errcode) {
                    return
                }
                storage.mapDataList = translateData

                if (storage.mapDataList.pointData.length !== 0) {
                    draw.mapList()
                }
            })
        },

        IndiatorSearch: function(_val) {
            _API._G('DataShow.asmx/IndiatorSearch', {
                content: _val
            }, function(translateData) {
                storage.searchlist = translateData;
                l._Ls('___selecte', '')
                toDealWith.searchlist()
            })
        }
    }


    /**
     * 处理数据
     */
    var toDealWith = {
        lon2Mercator: function(lon) {
            return lon * 20037508.34 / 180;
        },
        lat2Mercator: function(lat) {
            var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
            return y * 20037508.34 / 180;
        },
        /**
         * 错误代码
         */
        concatMenu: function() {
            var _im = ''
            var assignObj = ''
            storage.menuList.catalog.forEach(function(_val, _index) {

                var infor = []

                storage.menuListArr.forEach(function(_vs, _is) {


                    _vs.datas.forEach(function(_v, _i) {
                        if (_v.id === _val.id - 1) {

                            if (_im !== '') {

                                if (_im.pId < _v.pId) {
                                    assignObj = Object.assign(_im, { datas: _v })
                                } else {
                                    assignObj = Object.assign(_v, { datas: _im })
                                }
                                infor.push(assignObj)
                            }
                            _im = _v
                        }
                    });


                });
                storage.menuNewData.push({ level: _val, datas: infor[0] })
            });
            draw.menuList();
        },
        /**
         * 错误代码 ^^^
         */
        tsData: function() {
            $('.information').remove()
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
                var is_map = _t.indiatorInfo.is_map === 1 ? '_isMap' : '_hide'
                var vs = _t.indiatorInfo.is_map === 1 ? 'maps' : ''
                $(location).append("<div class='information " + sizeType + "-parent'>" +
                    "<button data-sizemap=" + _t.indiatorInfo.size_type + " data-name=" + _t.indiatorInfo.name + " data-type=" + _t.indiatorInfo.type + " data-index=" + _t.indiatorInfo.id + " class=" + is_map + "></button> " +
                    "<button class='introduceButton' target='_blank' data-id='" + _t.indiatorInfo.id + "'></button>" +
                    "<div data-index= " + _t.indiatorInfo.id + " class='mouseMove " + is_map + " " + sizeType + " draw_" + _t.indiatorInfo.id + " '  data-sizemap=" + _t.indiatorInfo.size_type + " data-name=" + _t.indiatorInfo.name + " data-type=" + _t.indiatorInfo.type + " data-index=" + _t.indiatorInfo.id + " ></div></div>");


                // $(location).append("<div class='information " + sizeType + "-parent'><a target='_blank' href='" + _t.indiatorInfo.id + "'></a><div data-index= " + _t.indiatorInfo.id + " class='mouseMove " + sizeType + " draw_" + _t.indiatorInfo.id + " '></div></div>");

                switch (_t.indiatorInfo.type) {
                    case 'Text':
                        draw.text(_t, ".draw_" + _t.indiatorInfo.id)
                        break;
                    case 'Table':
                        draw.table(_t.indiatorData, ".draw_" + _t.indiatorInfo.id, _t.indiatorInfo.name)
                        break;
                    default:
                        if (typeof draw._default(_t.indiatorInfo.type) === 'function') {
                            var __default__ = draw._default(_t.indiatorInfo.type)
                            if (_t.indiatorInfo.type === 'Pie_MultiLevelPie') {
                                console.log(_t)
                                    // console.log('__default__', __default__(_t.indiatorData, _t.indiatorInfo.name, _t.indiatorInfo.size_type))
                            }

                            var _tsDefault = __default__(_t.indiatorData, _t.indiatorInfo.name, _t.indiatorInfo.size_type)

                            draw.echart(_tsDefault, ".draw_" + _t.indiatorInfo.id)
                        }

                        break;
                }
            }
        },

        searchlist: function() {
            $('.filedCondition').html('')
            storage.searchlist.result.forEach(function(_val) {

                var ct = ''

                for (var key in _val) {
                    ct = '<div>按&nbsp;<span> ' + key + ' </span>&nbsp;搜索'
                    _val[key].forEach(function(_val_) {
                        ct += '<p class="_valName" data-maxScale="' + _val_.maxScale + '" data-minScale="' + _val_.minScale + '" data-centerX="' + _val_.center[0] + '" data-centerY="' + _val_.center[1] + '" data-code="' + _val_.code + '" data-serarchID="' + _val_.searchID + '"> ' + _val_.name + '</p>'
                    })
                    ct += '</div>'

                }

                $('.filedCondition').append(ct)

            })
        }
    }


    /**
     * 处理数据，渲染面板图表
     */
    var draw = {

        menuListParent: function() {
            storage.menuList.catalog.forEach(function(_val) {
                var _ct = '<li class="js_ontp"><div class="catalogParse" >' + _val.name + '<div class="right-options"><span><img src="images/chart/icon_bigmapsort@2x.png" alt=""></span> <span class="_option" data-id=" ' + _val.id + '"><img src="images/chart/icon_bigmapfold@2x.png" alt=""></span></div></div>';

                $('#CatalogPopup-ul').append(_ct)

            })
        },
        createButton: function(_id, _name) {
            $('.phase ul').append('<li class="button_d" data-id=' + _id + '>' + '<h2>' + _id + '</h2>' + '<h4>' + _name + '</h4>' + '</li>')
            $('.button_d').eq(0).addClass('active')
            $('.prev-button').addClass('active')
        },
        mapList: function() {
            $('.popupMenuInformation-child').html('')
            storage.mapDataList.pointData.forEach(function(_val) {
                var _child = '<div><span>' + _val.title + '</span><span>' + _val.value + '</span></div>';
                $('.popupMenuInformation-child').append(_child)
            })
            $('.popupMenuInformation').addClass('open');
            $('.popupMenuInformation').css({ top: storage.maplayerPoint.y, left: storage.maplayerPoint.x })

        },
        /**
         * 错误代码
         */
        menuList: function() {
            storage.menuNewData.forEach(function(_vals) {
                var _ontpClass = ''
                if (_vals.datas.tableName !== '') {
                    _ontpClass = 'notPointer'
                } else {
                    // _ontpClass = 'notPointer'
                }
                var _ct = '<li class="js_ontp"><div class="js_ontp catalogParse ' + _ontpClass + '" data-tn="' + _vals.datas.tableName + '"  data-tp="' + _vals.datas.tilePath + '">' + _vals.level.name + '<div class="right-options"><span><img src="images/chart/icon_bigmapsort@2x.png" alt=""></span> <span class="_option"><img src="images/chart/icon_bigmapfold@2x.png" alt=""></span></div></div>'
                recursion(_vals.datas)

                var info = ''

                function recursion(_val) {
                    var _onChildClass = ''
                    if (_val.tableName !== '') {
                        _onChildClass = 'notPointer'
                    } else {
                        // _ontpClass = 'notPointer'
                    }

                    _ct += '<ul><li class="js_ontp ' + _onChildClass + '" data-tn="' + _vals.tableName + '" data-tp="' + _val.tilePath + '">' + _val.name + '<div class="right-options"><span><img src="images/chart/icon_mapsort@2x.png" alt=""></span> <span class="_option"><img src="images/chart/icon_mapfold@2x.png" alt=""></span></div></li>'


                    for (var key in _val) {


                        if (key === 'datas') {
                            recursion(_val[key])
                            return
                        }
                    }
                    _ct += '</ul>'

                }
                _ct += '</li>'
                $('#CatalogPopup-ul').append(_ct)

            })
        },
        /**
         * 错误代码 ^^^
         */
        text: function(_data, _pClass) {
            var _daInfor = _data.indiatorInfo
            $(_pClass).append('<div class="typeTexttitle"><span>' + _daInfor.name + '</span></div>')
            _data.indiatorData.forEach(function(_val) {

                var high_lighted = _val.is_show == '1' ? 'highlighted' : ''
                $(_pClass).append('<div class="typeText"><span class="left">' + _val.caption + '</span><span class="right  ' + high_lighted + '">' + _val.value + '</span></div>')
            })
        },
        table: function(_data, _pClass, name) {
            var ct = '<h4 class="table-titles">' + name + '</h4><table  align="center"><tr class="_column">'

            _data.column.forEach(function(_val) {
                ct += '<th>' + _val + '</th>'
            })
            ct += '</tr> '

            _data.data.forEach(function(_vals) {
                ct += '<tr>'
                _vals.forEach(function(_vs) {

                    ct += '<td valign="middle" ' + _vs.emissions + '=' + _vs.count + '>' + _vs.value + '</td>'
                })

                ct += '</tr>'
            })

            ct += '<table>'

            $(_pClass).append(ct)
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
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
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
                                            color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
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
                case 'Column_ColumnChart':
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
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(item.stack)
                                            }, [])
                                        },
                                        legend: {
                                            show: true,
                                            align: 'left',
                                            top: '78%',
                                            width: '90%',
                                            itemWidth: 8,
                                            itemHeight: 8,
                                            height: '50px',
                                            x: 'center',
                                            textStyle: {
                                                color: '#8e8e8e',
                                                fontSize: 10
                                            },
                                            data: ['奉化市'],
                                        },
                                        tooltip: {
                                            trigger: 'axis',
                                            confine: true,
                                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                            }
                                        },

                                        grid: {
                                            top: '18%',
                                            left: '5%',
                                            right: '5%',
                                            bottom: '25%',
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
                                            splitLine: {
                                                lineStyle: {
                                                    color: '#eaeaea',
                                                    width: 0.5,
                                                },
                                            },
                                        }],
                                        series: Dashboard(),
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
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
                                            show: true,
                                            align: 'left',
                                            top: '78%',
                                            width: '90%',
                                            itemWidth: 8,
                                            itemHeight: 8,
                                            height: '50px',
                                            x: 'center',
                                            textStyle: {
                                                color: '#8e8e8e',
                                                fontSize: 10
                                            },
                                            data: ['奉化市'],
                                        },
                                        grid: {
                                            top: '18%',
                                            left: '5%',
                                            right: '5%',
                                            bottom: '25%',
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
                                                show: true,
                                                lineStyle: {
                                                    color: '#eaeaea',
                                                    width: 0.5,
                                                },
                                            },
                                            axisTick: {
                                                show: false,
                                            },
                                            axisLabel: {
                                                inside: false,
                                                interval: 1,
                                                margin: 5,
                                                textStyle: {
                                                    color: '#8e8e8e',
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
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
                                    }
                                    break;

                            }

                        }
                    }
                    break;

                    /**
                     * 折线图
                     */



                    /**
                     * 水平柱状图
                     */
                case 'Bar_PercentStackedBar':
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

                            function legendData() {
                                var infos = []
                                raw[0].data.forEach(function(_val) {
                                    infos.push(_val.other[0]['F_NAME'])
                                })
                                return infos
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
                                            show: true,
                                            align: 'left',
                                            top: '78%',
                                            width: '90%',
                                            itemWidth: 8,
                                            itemHeight: 8,
                                            height: '50px',
                                            x: 'center',
                                            textStyle: {
                                                color: '#8e8e8e',
                                                fontSize: 10
                                            },
                                            data: legendData()
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
                                            top: '18%',
                                            left: '5%',
                                            right: '5%',
                                            bottom: '25%',
                                            containLabel: true
                                        },
                                        xAxis: [{
                                            type: 'value',

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
                                            }
                                        }],
                                        yAxis: [{
                                            type: 'category',
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(item.stack)
                                            }, []),

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
                                            splitLine: {
                                                lineStyle: {
                                                    color: '#eaeaea',
                                                    width: 0.5,
                                                },
                                            },
                                        }],
                                        series: Dashboard(),
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
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
                                            show: true,
                                            align: 'left',
                                            top: '78%',
                                            width: '90%',
                                            itemWidth: 8,
                                            itemHeight: 8,
                                            height: '50px',
                                            x: 'center',
                                            textStyle: {
                                                color: '#8e8e8e',
                                                fontSize: 10
                                            },
                                            data: legendData()
                                        },
                                        grid: {
                                            top: '18%',
                                            left: '5%',
                                            right: '5%',
                                            bottom: '25%',
                                            containLabel: true
                                        },
                                        xAxis: [{
                                            type: 'value',
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
                                            }
                                        }],
                                        yAxis: [{

                                            type: 'category',
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(item.stack)
                                            }, []),
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
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
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
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
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
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)']
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
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
                                        animationType: 'scale',
                                        animationEasing: 'elasticOut',
                                        animationDelay: function animationDelay(idx) {
                                            return Math.random() * 200;
                                        }
                                    }
                                    break;

                                case 1:
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
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(item['data'].reduce(function(array, item) {
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
                                            name: name,
                                            type: 'pie',
                                            radius: ['40%', '60%'],
                                            center: ['50%', '40%'],
                                            label: {
                                                normal: {
                                                    show: false,
                                                }
                                            },
                                            data: raw.reduce(function(arr, id) {
                                                return arr.concat(id['data'].reduce(function(array, item) {
                                                    return array.concat({ name: item['lable'], value: _getValue(item) })
                                                }, []))
                                            }, [])
                                        }],
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
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

                    // 扇子形饼图
                case 'Pie_DonutChart':
                    return function(raw, name, sizeType) {
                        if (raw) {
                            function pie_DonutChart() {
                                var info = []
                                raw[0].data.forEach(function(_val) {
                                    info.push({ name: _val.lable, value: _getValue(_val) })
                                })
                                return info
                            }
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
                                            radius: [25, '55%'],
                                            center: ['33%', '53%'],
                                            roseType: 'radius',
                                            label: {
                                                normal: {
                                                    show: false
                                                },
                                                emphasis: {
                                                    show: false
                                                }
                                            },
                                            lableLine: {
                                                normal: {
                                                    show: false
                                                },
                                                emphasis: {
                                                    show: false
                                                }
                                            },
                                            // data: raw.reduce(function(arr, id) {
                                            //     return arr.concat({
                                            //         name: id['other'].reduce(function(str, item) {
                                            //             if (item['F_NAME']) {
                                            //                 return str + item['F_NAME']
                                            //             } else {
                                            //                 return str
                                            //             }
                                            //         }, ''),
                                            //         value: id['data'].reduce(function(sum, item) {
                                            //             return sum + Number(_getValue(item))
                                            //         }, 0)
                                            //     })
                                            // }, [])
                                            data: pie_DonutChart()
                                        }],
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
                                        animationType: 'scale',
                                        animationEasing: 'elasticOut',
                                        animationDelay: function animationDelay(idx) {
                                            return Math.random() * 200;
                                        }
                                    }
                                    break;

                                case 1:
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
                                            data: raw.reduce(function(arr, item) {
                                                return arr.concat(item['data'].reduce(function(array, item) {
                                                    return array.concat(item['lable'])
                                                }, []))
                                            }, [])
                                        },
                                        series: [{
                                            name: name,
                                            type: 'pie',
                                            radius: [30, '30%'],
                                            center: ['55%', '50%'],
                                            roseType: 'radius',
                                            label: {
                                                normal: {
                                                    show: false
                                                },
                                                emphasis: {
                                                    show: false
                                                }
                                            },
                                            lableLine: {
                                                normal: {
                                                    show: false
                                                },
                                                emphasis: {
                                                    show: false
                                                }
                                            },
                                            data: pie_DonutChart()
                                        }],
                                        color: ['rgba(33,150,243,0.8)', 'rgba(244,32,18,0.8)', 'rgba(156,38,176,0.8)', 'rgba(2,188,212,0.8)', 'rgba(233,30,99,0.8)', 'rgba(63,81,181,0.8)', 'rgba(76,175,80,0.8)', 'rgba(249,227,32,0.8)', 'rgba(255,152,0,0.8)', 'rgba(96,125,139,0.8)'],
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

                case 'Table':
                    break;


            }
        }
    }


    /**
     * 绘制地图图表
     */
    var drawOn = {
        // 点击按钮绘制地图图标
        draw: function(_id) {
            var mapInArroy = []
            var mapChart = '';
            storage.chartData.forEach(function(val) {
                if (val.indiatorInfo.id === _id) {
                    storage.mapType = val.indiatorInfo.map_type
                    var _rtMap = callBackMap(val.indiatorInfo.map_type)
                    us.addLayers(_rtMap(val))
                }
            })
        },

        // 地图回传重绘制
        mapDraw: function() {
            var _rtMap = callBackMap(storage.mapType)
            console.log('storage.mapCbData', storage.mapCbData)
            if (storage.mapCbData.indiatorData.length === 0) return
            console.log('storage.mapCbData_', _rtMap(storage.mapCbData))
            us.addLayers(_rtMap(storage.mapCbData))


            // 清空对应面板图表重新绘制
            $('.draw_' + storage.indicatorID).html('').removeAttr('_echarts_instance_', 'style')
            var __default__ = draw._default(storage.mbMapType)
            var _tsDefault = __default__(storage.mapCbData.indiatorData, storage.mbMapName, storage.mbMapSizeType)
            draw.echart(_tsDefault, ".draw_" + storage.indicatorID)
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

                        return [{
                            level: userPermissions.surveyLevel,
                            code: userPermissions.surveyCode,
                            mapType: _data.indiatorInfo.map_type,
                            minScale: _data.indiatorData.minScale,
                            maxScale: _data.indiatorData.maxScale,
                            width: _data.indiatorData.width,
                            center: _data.indiatorData.center,
                            other: _data.indiatorData.other,
                            data: _getNewData(),
                            isNext: _data.indiatorInfo.isNext
                        }]
                    } else {
                        return [{
                            level: userPermissions.surveyLevel,
                            code: userPermissions.surveyCode,
                            mapType: _data.indiatorInfo.map_type,
                            minScale: _data.indiatorData[0].minScale,
                            maxScale: _data.indiatorData[0].maxScale,
                            width: _data.indiatorData[0].width,
                            center: _data.indiatorData[0].center,
                            other: _data.indiatorData[0].other,
                            data: _data.indiatorData[0].data.reduce(function(array, item) {
                                return array.concat({ name: item['lable'], value: _getValue(item) })
                            }, []),
                            isNext: _data.indiatorInfo.isNext
                        }]
                    }
                }
                break;

            case 'bar':
                return function(_data) {
                    var _ds = []

                    function processing(i, __type__) {
                        var info = []
                        for (var j = 0; j < _data.indiatorData[i].data.length; j++) {
                            let _content = _data.indiatorData[i].data[j]
                            if (__type__ === 'data') {
                                info.push({
                                    value: _getValue(_content.data[0]),
                                    name: _content['other'][0]['F_NAME']
                                })
                            } else {
                                info = _content.other
                            }
                        }

                        return info
                    }

                    function _processing() {
                        var arr = []
                        _data.indiatorData.reduce(function(_ar, _it) {
                            arr.push({ value: _getValue(_it.data[0].data[0]), name: _it.stack })
                        }, arr)

                        return arr
                    }

                    function redeme(i) {
                        var infor = []
                        for (var k = 0; k < _data.indiatorData.length; k++) {
                            var _val = _getValue(_data.indiatorData[k].data[i].data[0])
                            var _st = _data.indiatorData[k].stack
                            infor.push({ value: _val, name: _st })
                        }
                        return infor
                    }
                    for (var i = 0; i < _data.indiatorData[0].data.length; i++) {
                        var _mc = _data.indiatorData[0]
                        _ds.push({
                            level: userPermissions.surveyLevel,
                            code: _mc.data[i].other[1]['F_CODE'],
                            mapType: storage.mapType,
                            minScale: _mc.minScale,
                            maxScale: _mc.maxScale,
                            center: _mc.data[i].center,
                            other: _mc.data[i].other,
                            data: redeme(i),
                            isNext: _data.indiatorInfo.isNext
                        })
                    }
                    return _ds
                }
        }

    }

    sendRequest.GetCatalog()
    if (l._Lg('___selecte') !== '') {
        $('.searchbar').val(l._Lg('___selecte'))
        $('.filedCondition').show()
        sendRequest.IndiatorSearch(l._Lg('___selecte'))

    }


    return {
        Mp: mapCall.callLevelCode,
        // api: api,
        cl: userPermissions,
        dr: draw,
        tl: InvestigationStage,
        st: sendRequest._inforGetTerm,
        su: _callUserCode
    }
})