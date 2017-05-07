define("map", ["leaflet", "jquery", "common"],
    function(L, e, common) {
        var MapHelper = function(mapDiv, options) {
            var _this = this;
            _this.defaults = {
                center: [35.59, 108.29],
                zoom: 4,
                minZoom: 1,
                maxZoom: 18,
                basemap: 'vec',
                pointSelectLayer: null
            };
            _this.options = $.extend({}, this.defaults, options);
            _this.map = null;
            _this.mapDiv = mapDiv;
            _this.initMap().ctrl();
        }
        MapHelper.prototype.initMap = function() {
            var _this = this;
            _this.map = L.map(_this.mapDiv, {
                center: this.options.center,
                zoom: this.options.zoom,
                minZoom: this.options.minZoom,
                maxZoom: this.options.maxZoom,
                attributionControl: false,
                zoomControl: false
                    //crs: L.CRS.EPSG4326
            });
            if ('vec' == _this.options.basemap)
                _this.vec();
            else if ('img' == _this.options.basemap)
                _this.img();
            return _this;
        }
        MapHelper.prototype.ctrl = function() {
            var _this = this;
            var LatlngControl = L.Control.extend({
                initialize: function(foo, options) {
                    L.Util.setOptions(this, options);
                },
                onAdd: function(map) {
                    var loc = L.DomUtil.create('div', 'leaflet-control-location');
                    loc.style.fontFamily = "Consolas,Arial";
                    loc.style.clear = "none";
                    loc.innerHTML = "Latitude: 28.9   Longitude: 138.9";
                    return loc;
                }
            });
            _this.map.addControl(new LatlngControl("latlngLocation", { position: 'bottomright' }));
            _this.map.on("mousemove", function(e) {
                $(".leaflet-control-location").html("纬度: " + Number(e.latlng.lat).toFixed(2) + "  经度: " + Number(e.latlng.lng).toFixed(2));
            });
            return _this;
        }
        MapHelper.prototype.addMarker = function(point) {
            var _this = this;
            _this.removeMarker();
            _this.options.pointMarkerLayer = L.marker(point);
            _this.options.pointMarkerLayer.addTo(_this.map);
            return _this;
        }
        MapHelper.prototype.removeMarker = function() {
            var _this = this;
            if (_this.options.pointMarkerLayer)
                _this.removeLayer(_this.options.pointMarkerLayer);
            return _this;
        }
        MapHelper.prototype.lon2Mercator = function(lon) {
            return lon * 20037508.34 / 180;
        }
        MapHelper.prototype.lat2Mercator = function(lat) {
            var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
            return y * 20037508.34 / 180;
        }
        MapHelper.prototype.getXMercator = function(pointer) {
            return this.lon2Mercator(pointer.lng);
        }
        MapHelper.prototype.getYMercator = function(pointer) {
            return this.lat2Mercator(pointer.lat);
        }
        MapHelper.prototype.vec = function() {
            var _this = this;
            _this.addTdt("http://t0.tianditu.com/vec_w/wmts", "tstsl0", "vec", 1);
            _this.addTdt("http://t0.tianditu.com/cva_w/wmts", "tstsl1", "cva", 999);
        }
        MapHelper.prototype.img = function() {
            var _this = this;
            _this.addTdt("http://t0.tianditu.com/img_w/wmts", "tstsl0", "img", 1);
            _this.addTdt("http://t0.tianditu.com/cia_w/wmts", "tstsl1", "cia", 999);
        }
        MapHelper.prototype.addLayer = function(layerObj) {
            var _this = this;
            _this.map.addLayer(layerObj);
            return _this;
        }
        MapHelper.prototype.removeLayer = function(layerObj) {
            var _this = this;
            if (layerObj)
                _this.map.removeLayer(layerObj);
            return _this;
        }
        MapHelper.prototype.enlarge = function() {
            var _this = this,
                z = _this.map.getZoom();
            _this.map.setZoom(++z);
            return _this;
        }
        MapHelper.prototype.narrow = function() {
            var _this = this,
                z = _this.map.getZoom();
            _this.map.setZoom(--z);
            return _this;
        }
        MapHelper.prototype.__getZoom = function() {
            var z = this.map.getZoom()
            return z
        }
        MapHelper.prototype.addTdt = function(u, n, l, z) {
            var _this = this;
            var lurl = u + "?service=wmts&request=GetTile&version=1.0.0&LAYER=" + l + "&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
            var b; // = layerMaps.get(layername);
            b = L.tileLayer(lurl, {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
            }); //.addTo(Ly.map);
            b.setZIndex(z);
            _this.map.addLayer(b);
        }
        MapHelper.prototype.addTileLayer = function(options) {
            console.log('options:', options)
            var _this = this;
            var wmts = new L.TileLayer.WMTS(options.serviceUrl + options.tilePath, {
                //  layer: lg_qp.layerName,
                style: "_null",
                TILEMATRIXSET: "default028mms",
                format: "image/png"
            });
            wmts.setZIndex(options.zindex);
            _this.map.addLayer(wmts);
            _this.map.setView(options.center, options.zoom);
            common.tileLayersList.put(options.id, wmts);
            return wmts;
        }

        //  添加定位点 
        MapHelper.prototype.__setView = function(center, zoom) {
            this.map.setView(center, zoom)
            return this
        }
        MapHelper.prototype.removeTileLayerById = function(id) {
            var _this = this;
            var layer = common.tileLayersList.get(id);
            _this.removeLayer(layer);
            return _this;
        }
        MapHelper.prototype.removeAllTileLayers = function() {
            var _this = this;
            var keys = common.tileLayersList.keySet();
            for (var i in keys) {
                _this.removeLayer(common.tileLayersList.get(keys[i]));
            }
            return _this;
        }
        MapHelper.prototype.changeLayerZIndex = function(layerObj, zindex) {
            var _this = this;
            layerObj.setZIndex(zindex);
            return _this;
        }

        MapHelper.prototype.pointSelect = function(call_click) {
            var _this = this;
            _this.cancelPointSelect();
            _this.map.on('click', call_click);
            return _this;
        }

        MapHelper.prototype.cancelPointSelect = function(call_click) {
            var _this = this;
            _this.map.off('click', call_click);
            _this.removeLayer(_this.options.pointSelectLayer);
            return _this;
        }
        MapHelper.prototype.addMarkerPop = function(e, datas) {
            var _this = this,
                latlng = e.latlng;
            $("#map").css("cursor", "pointer");
            var title = datas.title,
                data = datas.data,
                map = _this.options.map,
                pointSelectLayer = _this.options.pointSelectLayer;
            var out = '<div style="position: relative; font: 11px/22px &quot;宋体&quot;;width: 300px; min-height: 255px; height: 100%; text-align: center;  background-color: rgb(255, 255, 255); padding: 0px; z-index: 10;">' +
                '<table cellspacing="0" style="width: 100%; border-collapse:collapse; text-align:left;">' +
                '<tbody>' +
                '<tr>' +
                '<td colspan="2" style="padding: 3px 3px 3px 10px; font: bold 13px &quot;宋体&quot;; color: rgb(255, 255, 255); border: 1px solid #337FE5; cursor: move; background-color:#337FE5;">' +
                '<span id="dialogTitle">' + title + '</span>' +
                '</td>' +
                '</tr>';
            if (data.length > 0)
                for (i in data) {
                    out += '<tr>' +
                        '<td style=" border: 1px solid #EFF3FA; padding: 2px 5px 2px 5px;width:30%;">' + data[i].title + '</td>' +
                        '<td style=" border: 1px solid #EFF3FA; padding: 2px 5px 2px 5px;">' + data[i].value + '</td></tr>';
                }
            else
                out += '<tr><td colspan="2">暂无数据!</td></tr>'
            out += '</tbody></table></div>';

            _this.removeLayer(pointSelectLayer);
            pointSelectLayer = L.marker(latlng).addTo(_this.map);
            pointSelectLayer.bindPopup(out, { className: "pointsel-prop" }).openPopup();
            _this.options.pointSelectLayer = pointSelectLayer;
            $(".leaflet-popup.leaflet-zoom-animated").css('z-index', '999');

            $(".leaflet-container a.leaflet-popup-close-button").bind('click', function() {
                _this.removeLayer(pointSelectLayer);
            });
            return _this;
        }
        MapHelper.prototype.mapZoomChange = function(_mapNarrow) {
            var _this = this,
                layers = common.themeLayersList;
            var _oldzoom = false;
            _this.map.on("zoomstart", function() {
                _oldzoom = _this.map.getZoom();
            });
            _this.map.on("zoomend", function(e) {
                _currzoom = _this.map.getZoom();
                if (_currzoom > _oldzoom) { // 放大
                    var key = layers.keySet();
                    for (var i in key) {
                        console.log(layers.get(key[i]));
                        var o = layers.get(key[i]);
                        if (_currzoom > o.maxScale) {
                            _this.map.removeLayer(o.layer);
                        }
                    }
                    return;
                } else { // 缩小
                    var key = layers.keySet();
                    for (var i in key) {
                        var o = layers.get(key[i]);
                        if (_currzoom >= o.minScale) {
                            // 如果当前图层已经加载，则不重新加载。如果当前图层因放大时移除了图层，那么重新加载图层
                            if (!_this.map.hasLayer(o.layer))
                                _this.map.addLayer(o.layer);
                            continue;
                        } else {
                            // 加载上一个级别的数据, 如果上级数据不存在那么移除该图层
                            //Ly.map.removeLayer(o.layer);
                            //te.addThemeMap(node, node.preCode);
                            _mapNarrow(o);
                        }
                    }
                }
            });
        }

        return MapHelper;
    });