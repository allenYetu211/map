function HashMap(){  
    //定义长度  
    var length = 0;  
    //创建一个对象  
    var obj = new Object();  
  
    /** 
    * 判断Map是否为空 
    */  
    this.isEmpty = function(){  
        return length == 0;  
    };  
  
    /** 
    * 判断对象中是否包含给定Key 
    */  
    this.containsKey=function(key){  
        return (key in obj);  
    };  
  
    /** 
    * 判断对象中是否包含给定的Value 
    */  
    this.containsValue=function(value){  
        for(var key in obj){  
            if(obj[key] == value){  
                return true;  
            }  
        }  
        return false;  
    };  
  
    /** 
    *向map中添加数据 
    */  
    this.put=function(key,value){  
        if(!this.containsKey(key)){  
            length++;  
        }  
        obj[key] = value;  
    };  
  
    /** 
    * 根据给定的Key获得Value 
    */  
    this.get=function(key){  
        return this.containsKey(key)?obj[key]:null;  
    };  
  
    /** 
    * 根据给定的Key删除一个值 
    */  
    this.remove=function(key){  
        if(this.containsKey(key)&&(delete obj[key])){  
            length--;  
        }  
    };  
  
    /** 
    * 获得Map中的所有Value 
    */  
    this.values=function(){  
        var _values= new Array();  
        for(var key in obj){  
            _values.push(obj[key]);  
        }  
        return _values;  
    };  
  
    /** 
    * 获得Map中的所有Key 
    */  
    this.keySet=function(){  
        var _keys = new Array();  
        for(var key in obj){  
            _keys.push(key);  
        }  
        return _keys;  
    };  
  
    /** 
    * 获得Map的长度 
    */  
    this.size = function(){  
        return length;  
    };  
  
    /** 
    * 清空Map 
    */  
    this.clear = function(){  
        length = 0;  
        obj = new Object();  
    };  
}


//墨卡托转经纬度 

function mercator2lonlat(mercator){ 
    var lonlat={x:0,y:0};   
    var x = mercator.x/20037508.34*180; 
    var y = mercator.y/20037508.34*180; 
    y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
    lonlat.x = x;   lonlat.y = y;   return lonlat;
    }

//经纬度转墨卡托 

function lonlat2mercator(lonlat)
{   
    var mercator={x:0,y:0}; 
    var x = lonlat.x *20037508.34/180;  
    var y = Math.log(Math.tan((90+lonlat.y)*Math.PI/360))/(Math.PI/180);
    y = y *20037508.34/180; 
    mercator.x = x; 
    mercator.y = y; 
    return mercator ; 
} 


function lon2Mercator(lon){
	  return lon *20037508.34/180;
}
function lat2Mercator(lat){
    var y = Math.log(Math.tan((90+lat)*Math.PI/360))/(Math.PI/180);
   return y *20037508.34/180; 
}


var Ly = {
	map: {},
	tilelayer: {},
	defZoom: 5,
	defCenter: [35.59,108.29],
	init: function(mapDiv){
		this.map = L.map(mapDiv, {
		    center: this.defCenter,
		    zoom: this.defZoom,
		    minZoom: 1,
		    maxZoom: 17,	
		    attributionControl: false,
		    zoomControl: false
			//crs: L.CRS.EPSG4326
		});
		//tilelayer = L.tileLayer('http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {subdomains: ["01", "02", "03","04"]}).addTo(this.map);
        this.tilelayer = L.tileLayer("http://t{s}.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
        }).addTo(this.map);
      /*  tilelayer1 = L.tileLayer("http://t{s}.tianditu.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
        }).addTo(this.map);
        tilelayer2 = L.tileLayer("http://t{s}.tianditu.cn/ibo_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=ibo&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
        }).addTo(this.map);
        //this.addCookie("map", m)*/
    
	},
	changeTilelayer: function(m){
		tilelayer.options.subdomains = ["0", "1", "2", "3"];
		if(m == "d"){
			tilelayer.options.subdomains = ["01", "02", "03","04"];
			tilelayer.setUrl('http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}');
			$(".leaflet-control-mapsource").html("地图数据 &copy;AutoNavi").css({'color': '#444'});
			$(".leaflet-control-location").css({'color': '#444'});
		} else if(m == "t") {
			tilelayer.setUrl('http://services.arcgisonline.com/arcgis/services/World_Physical_Map/MapServer/WMTS/WMSServer?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=0&STYLE=_null&TILEMATRIXSET=default028mms&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng');
			$(".leaflet-control-mapsource").html("地图数据 &copy;googleMap").css({'color': '#444'});
			$(".leaflet-control-location").css({'color': '#444'});
		} else if(m == "s") {
			tilelayer.setUrl('http://mt{s}.google.cn/vt/lyrs=s,r&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}');
			$(".leaflet-control-mapsource").html("地图数据 &copy;googleMap").css({'color': '#FFF'});
			$(".leaflet-control-location").css({'color': '#FFF'});
		} else {
			tilelayer.setUrl('http://mt{s}.google.cn/vt/lyrs=m,r&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}');
		}
	},
	latlngControl: function(){
//		if(!this.browser.versions.mobile){
			var LatlngControl = L.Control.extend({
			    initialize: function (foo, options) {
			        L.Util.setOptions(this, options);
			    },
			    onAdd: function (map) {
			        var loc = L.DomUtil.create('div', 'leaflet-control-location');
			        loc.style.fontFamily = "Consolas,Arial";
			        loc.style.clear = "none";
			        loc.innerHTML= "Latitude: 28.9   Longitude: 138.9";
			        return loc;
			    }
			});
			this.map.addControl(new LatlngControl("latlngLocation", {position: 'bottomright'}));
			this.map.on("mousemove", function(e){
				$(".leaflet-control-location").html("Latitude: " + Number(e.latlng.lat).toFixed(6) + "  Longitude: " + Number(e.latlng.lng).toFixed(6));
			});
//		}
	},
	mapSourceControl: function(){
//		if(!this.browser.versions.mobile){
			var MapSourceControl = L.Control.extend({
			    initialize: function (foo, options) {
			        L.Util.setOptions(this, options);
			    },
			    onAdd: function (map) {
			        var loc = L.DomUtil.create('div', 'leaflet-control-mapsource');
			        loc.style.fontFamily = "Consolas,Arial";
			        loc.style.clear = "none";
			        loc.innerHTML= "地图数据 &copy;google";
			        return loc;
			    }
			});
			this.map.addControl(new MapSourceControl("mapSource", {position: 'bottomright'}));
//		}
	},
	pointsLayer: {},
	addPoints: function (points){
		this.map.removeLayer(this.pointsLayer);
		this.pointsLayer = L.layerGroup();
		for(var i in points) {
			var point = points[i];
			var popupIcon = L.icon({iconUrl: (point[10] == 0 ? './images/levelIcon/' : './images/icon_n/') +point[6], iconSize: [22, 19]});
			L.marker([point[7], point[8]], {icon: popupIcon}).addTo(this.pointsLayer)
			.bindPopup("<p style='font-weight: bold; margin: 0px; height: 30px; line-height: 30px; background-color: #372D83; color: #FFF; padding: 0px 20px 0px 10px; border-radius: 4px 4px 0px 0px; overflow: hidden;'>" + point[0]+point[1]+point[4]+point[3]+"预警</p><div style='padding: 5px 10px; color: #FFF;'>"+point[9]+"</div>", {maxWidth: 240});
		}
		this.pointsLayer.addTo(this.map);
	},
	removePoints: function(){
		this.map.removeLayer(this.pointsLayer);
	},
	layers: {},
	fangda: function(){
		var z = this.map.getZoom();
		this.map.setZoom(++z);
	},
	suoxiao: function(){
		var z = this.map.getZoom();
		this.map.setZoom(--z);
	},
	measure: function(){
		this.cancelMagnify();
		this.cancelShrink();
		var map = this.map;
		var layer = L.layerGroup();
		layer.addTo(this.map);
		var measurePoints = [];
		var totalDistance = 0;
		var start = false;
		var lines;
		var tempLine;
		var markers = [];
		var cc = function(e){
			map.doubleClickZoom.disable();
			start = true;
			if(measurePoints.length > 0) {
				if(e.latlng.lat != measurePoints[measurePoints.length - 1].lat && e.latlng.lng != measurePoints[measurePoints.length - 1].lng){
					measurePoints.push(e.latlng);
					if (measurePoints.length == 2) {
						lines = new L.Polyline(measurePoints, {"color": "red", "weight": 1});
						lines.addTo(layer);
					}
					var s = L.circleMarker(e.latlng, {color: "red"});
					s.setRadius(1);
					if(measurePoints.length >= 2){
						var d = measurePoints[measurePoints.length - 1].distanceTo(measurePoints[measurePoints.length - 2]);
						totalDistance += d;
						var txt = (d / 1000).toFixed(3) + "（公里）";//, className: "leaflet-label-tffq"
//						s.bindLabel(txt, {noHide: true, direction: 'right', clickable: true});
						s.bindLabel(txt, {noHide: true, direction: 'right', clickable: true, className: "leaflet-label-tffq"});
					}
					s.addTo(layer);
					markers.push(s);
					lines.setLatLngs(measurePoints);
				}
			} else {
				measurePoints.push(e.latlng);
				var s = L.circleMarker(e.latlng, {color: "red"});
				s.setRadius(1);
//				s.bindLabel("起点", {noHide: true, direction: 'right'});
				s.bindLabel("起点", {noHide: true, direction: 'right', className: "leaflet-label-tffq"});
				s.addTo(layer);
				markers.push(s);
			}
			
		};
		addOrRemoveLine(0);
		var mm = function(e){
			if (start) {
				if(tempLine != null){
					layer.removeLayer(tempLine);
				}
				tempLine = new L.Polyline([measurePoints[measurePoints.length - 1], e.latlng], {"color": "red", "weight": 1});
				tempLine.addTo(layer);
			}
		};
		var dc = function(e){
			if (measurePoints.length > 1) {
				if(markers.length > 1) {
					var m = markers[markers.length - 1];
					var lab = m.getLabel();
					var tt = document.createTextNode(m.getLabel()._content + "  总长度：" + (totalDistance / 1000).toFixed(3) + "（公里）");
					lab._container.innerHTML = "";
					lab._container.appendChild(tt);
					var span = document.createElement("span");
					span.innerHTML = "【关闭】";
					span.style.color = "#00ff40";
					lab._container.appendChild(span);
					L.DomEvent.addListener(span,"click",function(){
						map.removeLayer(layer);
					});
				}
				start = false;
				map.off("click",cc).off("mousemove",mm).off("dblclick",dc);
				$(".measure").removeAttr("id");
				addOrRemoveLine(1);
			}
		};
		var mu = function(e){
			map.doubleClickZoom.enable();
		};
		map.on("click",cc).on("mousemove",mm).on("dblclick", dc).on("mouseup",mu);
		this.cancelMeasure = function(){
			map.off("click",cc).off("mousemove",mm).off("dblclick",dc).off("mouseup",mu);
		};
	},
	cancelMeasure: function(){},
	magnify: function(){
		this.cancelMeasure();
		this.cancelShrink();
		var map = this.map;
		var start = false;
		var nwPoint;
		var rect;
		var md = function(e){
			start = true;
			nwPoint = e.latlng;
			map.dragging.disable();
			map.off("dragstart").off("drag").off("dragend");
		}
		var mm = function(e) {
			if(start){
				if(rect != null){
					map.removeLayer(rect);
				}
				var sw = [nwPoint.lat, e.latlng.lng];
				var ne = [e.latlng.lat, nwPoint.lng];
				rect = new L.rectangle([sw, ne], {"color": "red", "weight": 1});
				rect.addTo(map);
			}
		}
		var mu = function(e){
			start = false;
			if(rect != null){
				map.removeLayer(rect);
			}
			if(nwPoint.lat != e.latlng.lat && e.latlng.lng != nwPoint.lng){
				var sw = [nwPoint.lat, e.latlng.lng];
				var ne = [e.latlng.lat, nwPoint.lng];
				map.fitBounds([sw, ne]);
			}
			/*
			var center = [(nwPoint.lat + e.latlng.lat)/2, (nwPoint.lng + e.latlng.lng)/2];
			var z = map.getZoom();
			map.setView(center, ++z);
			*/
			map.off("mousedown", md).off("mousemove", mm).off("mouseup", mu);
			map.dragging.enable();
		}
		map.on("mousedown", md).on("mousemove", mm).on("mouseup", mu);
		this.cancelMagnify = function(){
			map.off("mousedown", md).off("mousemove", mm).off("mouseup", mu);
		};
	},
	cancelMagnify: function(){},
	shrink: function(n){
		this.cancelMagnify();
		this.cancelMeasure();
		var num = n ? n : 2;
		var map = this.map;
		var start = false;
		var nwPoint;
		var rect;
		var md = function(e){
			start = true;
			nwPoint = e.latlng;
			map.dragging.disable();
			map.off("dragstart").off("drag").off("dragend");
		}
		var mm = function(e) {
			if(start){
				if(rect != null){
					map.removeLayer(rect);
				}
				var sw = [nwPoint.lat, e.latlng.lng];
				var ne = [e.latlng.lat, nwPoint.lng];
				rect = new L.rectangle([sw, ne], {"color": "red", "weight": 1});
				rect.addTo(map);
			}
		}
		var mu = function(e){
			start = false;
			if(rect != null){
				map.removeLayer(rect);
			}
			if(nwPoint.lat != e.latlng.lat && e.latlng.lng != nwPoint.lng) {
				var center = [(nwPoint.lat + e.latlng.lat)/2, (nwPoint.lng + e.latlng.lng)/2];
				var z = map.getZoom();
				z-=num;
				map.setView(center, (z < 3)?3:z);
			}
			map.off("mousedown", md).off("mousemove", mm).off("mouseup", mu);
			map.dragging.enable();
		}
		map.on("mousedown", md).on("mousemove", mm).on("mouseup", mu);
		this.cancelShrink = function(){
			map.off("mousedown", md).off("mousemove", mm).off("mouseup", mu);
		}
	},
	cancelShrink: function(){}

};

/*****************************************/

function addWMTS(url){
	  var funcLayer = new L.TileLayer.Functional(function (view) {				  
		 // var url = 'http://114.242.219.4:12226/ReadTile.ashx?Layer=F:/%E5%88%87%E7%89%87%E5%85%83%E6%95%B0%E6%8D%AE/%E7%94%98%E8%82%83/%E5%88%87%E7%89%87/%E6%A3%AE%E6%9E%97%E8%B5%84%E6%BA%90%E5%88%86%E5%B8%83%E5%9B%BE_%E7%94%98%E8%82%83%E7%AC%AC%E4%BA%94%E6%AC%A1%E4%B8%80%E7%B1%BB%E6%B8%85%E6%9F%A5%E6%A3%AE%E6%9E%97%E8%B5%84%E6%BA%90%E5%88%86%E5%B8%83%E5%9B%BE&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=_null&TILEMATRIXSET=default028mms&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&FORMAT=image%2Fpng'
		//var url = '图_林科院全国第二次森林资源分布图&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=_null&TILEMATRIXSET=default028mms&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&FORMAT=image%2Fpng'
		  var url = url.replace('{z}', view.zoom)
				        .replace('{x}', view.tile.row)
				        .replace('{y}', view.tile.column)
				        .replace('{s}', view.subdomain);
				    return url;
				}, {
					opacity: 0.9,
					subdomains: '1234'
				});		
	//map.addLayer(funcLayer);
	return funcLayer;
		
	}

//*************************卷帘
function divide(layer,type){
	map = Ly.map;	
	 var l_parent = layer._container, handle = document.getElementById('handle'), dragging = false;
	 if(type == 1){
		 $('#map').css('cursor', 'url('+basePath+'images/Horz_Fsh.cur), move'); 		
	    handle.onmousedown = function () {
	        dragging = true;
	        return false;
	    };
	    document.onmouseup = function () {
	        dragging = false;
	    };
	    document.onmousemove = function (e) {
	        if (!dragging)
	            return;
	        setDivide(e.x);
	    };
	    map.on('contextmenu', function (e) {
	    });
	    map.on("zoomend", function (e) {
	      //  l_parent = getLayer(map._layers)._container;
	        setDivide(parseInt(handle.style.left));
	    });
	    map.on("moveend", function (e) {
	       // l_parent = getLayer(map._layers)._container;
	        setDivide(parseInt(handle.style.left));
	    });
	    map.on("drag", function (e) {
	        //l_parent = getLayer(map._layers)._container;
	        setDivide(parseInt(handle.style.left));
	    });
	    map.on("mousemove", function (e) {
	       // l_parent = getLayer(map._layers)._container;
	        setDivide(e.containerPoint.x);
	    });
	    //setDivide(300);
	}else{
		  map.off('contextmenu', function (e) {
		    });
		    map.off("zoomend", function (e) {
		      //  l_parent = getLayer(map._layers)._container;
		        setDivide(parseInt(handle.style.left));
		    });
		    map.off("moveend", function (e) {
		       // l_parent = getLayer(map._layers)._container;
		        setDivide(parseInt(handle.style.left));
		    });
		    map.off("drag", function (e) {
		        //l_parent = getLayer(map._layers)._container;
		        setDivide(parseInt(handle.style.left));
		    });
		    map.off("mousemove", function (e) {
		       // l_parent = getLayer(map._layers)._container;
		        setDivide(e.containerPoint.x);
		    });
	}
	    function setDivide(x) {
	    	if(type == 1){
	        x = Math.max(0, Math.min(x, map.getSize()['x']));
	        handle.style.left = (x) + 'px';
	        var layerX = map.containerPointToLayerPoint(x, 0).x;
	        l_parent.style.clip = 'rect(-99999px ' + layerX + 'px 999999px -99999px)';
	    	}
	    }


	 
}






/*******************************************/
var onLoadLayer2=null;
//目录查询信息
function menuCate(fname1,fvalue1,fname2,fvalue2,fname3,fvalue3,searchword,areaId,areaCode){
	searchNameTwokong();checkfun();
	//initIdsValue();
	//celar_tc_befor();

	searchMapData(fname1,fvalue1,fname2,fvalue2,fname3,fvalue3,searchword,areaId,areaCode);

	 clearSmallName();
	 _listenerChangeMenu();
	//$(".map_total").show();	
	//$(".map_leftList").click();
	 hideLeftMenuBox();
	
}

var __layer = null;
function showwmts(id){
		if (__layer == null){	 
			var url = 'http://114.242.219.4:12226/ReadTile.ashx?Layer=F:/%E5%88%87%E7%89%87%E5%85%83%E6%95%B0%E6%8D%AE/%E7%94%98%E8%82%83/%E5%88%87%E7%89%87/%E6%A3%AE%E6%9E%97%E8%B5%84%E6%BA%90%E5%88%86%E5%B8%83%E5%9B%BE_%E7%94%98%E8%82%83%E7%AC%AC%E4%BA%94%E6%AC%A1%E4%B8%80%E7%B1%BB%E6%B8%85%E6%9F%A5%E6%A3%AE%E6%9E%97%E8%B5%84%E6%BA%90%E5%88%86%E5%B8%83%E5%9B%BE&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=_null&TILEMATRIXSET=default028mms&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&FORMAT=image%2Fpng';
			__layer=addWMTS(url); 
			Ly.map.addLayer(__layer);
		}else{
			Ly.map.removeLayer(__layer);	
			__layer = null;
		}
	  
}



/***********************************/
var shpfileP =null;
var shpfileW =null;

/**
 * 显示或隐边界
 * @param key
 * @param showOrHide
 */
function showProvince(key,showOrHide){
	var _layer = provinceMap.get("p"+key+"00");
	if(_layer ==null)
		return;
	if(showOrHide == 1){
		//shpfileP.addTo(Ly.map);
		//shpfileW.addTo(Ly.map);
		_layer.setStyle(selectStyle);		
	}else{		
		_layer.setStyle(province_style);
		//Ly.map.removeLayer(shpfileP); //删除：
		//Ly.map.removeLayer(shpfileW); //删除：
	}
}


function addOrRemoveLine(showOrHide){
	if(showOrHide == 1){
		shpfileP.addTo(Ly.map);
		shpfileW.addTo(Ly.map);		
	}else{				
		Ly.map.removeLayer(shpfileP); //删除：
		Ly.map.removeLayer(shpfileW); //删除：
	}
}



function showshpfile(){

map = Ly.map;

	if (shpfileP == null){
		if(shpfileP ==null){
			shpfileP = new L.Shapefile(basePath+'data/s.zip',{onEachFeature:function(feature, layer) {
  	if (feature.properties) {		
			/*
  		layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: selectProvince				
			});
			
	
			//layer.bindPopup(feature.properties['ADCODE99'],{maxHeight:200});
			//var _plays = Ly.featureGroup
		
			layer.bindPopup(Object.keys(feature.properties).map(function(k){
				return k + ": " + feature.properties[k] ;
			}).join("<br />"),{maxHeight:200});
			*/
			provinceMap.put("p"+feature.properties['ADCODE'], layer);
			
  	}
		
	},style: province_style,select:0});
	}
		shpfileP.addTo(map);
	}else{
		//map.removeLayer(shpfileP); //删除：
		shpfileP =null;

	}
}

function showCFile(){
	 shpfileW = new L.Shapefile(basePath+'data/g.zip',{onEachFeature:function(feature, layer) {
		 },style: province_style,select:0});
	 		shpfileW.addTo(Ly.map);
			provinceMap.put("p10000000", shpfileW);
}


province_style = {        
        weight: 0.1,
        opacity: 1,
        color: '#666',
        dashArray: '3',
        fillOpacity: 0
 
}

selectStyle={   
        weight: 2,
        opacity: 1,
        color: 'blue',
        dashArray: '3',
        fillOpacity: 0
   
}

function highlightFeature(e) {
	e.target.setStyle(selectStyle);
			//var layer = e.target;
		
			//layer.setStyle(selectStyle);
			//	layer.bringToFront();

		

			//info.update(layer.feature.properties);
}
function resetHighlight(e) {
	e.target.setStyle(province_style);
		//var layer = e.target;
		//layer.setStyle(province_style);
}  

function selectProvince(e) {
			var layer = e.target;
			var _select =layer.options.select;			
			map.fitBounds(e.target.getBounds());
		//	pushOrPoP(layer);
			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}
			//alert(e.target.options.name);
		}
  
var selectProvonce = new Array();
function pushOrPoP(_layer){
	var _is = 0;
	selectProvonce.forEach(function(value, index) {	
		if(value == _layer){
			 selectProvonce.splice(index, 1);
			 _is = 1;
		}			
	});
	
	if(_is ==0){
		selectProvonce.push(_layer);
		_layer.setStyle(selectStyle);
	}else{
		_layer.setStyle(province_style);
	}
	

}  
  
var provinceMap = new HashMap(); 
var layerMaps = new HashMap(); 
var onLoadLayer = new HashMap(); 
var layerIdMetaId = new HashMap(); 
var currLayer = {};
var currentMinBianma=1;
var currentMaxBianma=17;
var layerProp = null;