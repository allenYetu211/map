define("map", ["leaflet", "jquery"],
function(i, e) {
	function HashMap(){var length=0;var obj=new Object();this.isEmpty=function(){return length==0};this.containsKey=function(key){return(key in obj)};this.containsValue=function(value){for(var key in obj){if(obj[key]==value){return true}}return false};this.put=function(key,value){if(!this.containsKey(key)){length++}obj[key]=value};this.get=function(key){return this.containsKey(key)?obj[key]:null};this.remove=function(key){if(this.containsKey(key)&&(delete obj[key])){length--}};this.values=function(){var _values=new Array();for(var key in obj){_values.push(obj[key])}return _values};this.keySet=function(){var _keys=new Array();for(var key in obj){_keys.push(key)}return _keys};this.size=function(){return length};this.clear=function(){length=0;obj=new Object()}};
	
	var Ly = {
		map:{},
		tilelayer: {},
	    defZoom: 4,
	    defCenter: [35.59,108.29],
		init: function(mapDiv){
			Ly.map = i.map(mapDiv, {
				center: Ly.defCenter,
				zoom: Ly.defZoom,
				minZoom: 1,
				maxZoom: 18,	
				attributionControl: false,
				zoomControl: false
				//crs: L.CRS.EPSG4326
		    });
			Ly.y();
			Ly.ctrl();
			Ly.aMapZoom();
		},
		s:function(){
			a("http://t0.tianditu.com/vec_w/wmts", "tstsl0", "vec", 1);
	        a("http://t0.tianditu.com/cva_w/wmts", "tstsl1", "cva", 20);
		},
		y:function(){
			a("http://t0.tianditu.com/img_w/wmts", "tstsl0", "img", 1);
		    a("http://t0.tianditu.com/cia_w/wmts", "tstsl1", "cia", 20);
		},
		enlarge: function(){
		var z = this.map.getZoom();
		this.map.setZoom(++z);
		},
		narrow: function(){
			var z = this.map.getZoom();
			this.map.setZoom(--z);
		},
		ctrl:function(){
			var LatlngControl = i.Control.extend({
			    initialize: function (foo, options) {
			        i.Util.setOptions(this, options);
			    },
			    onAdd: function (map) {
			        var loc = i.DomUtil.create('div', 'leaflet-control-location');
			        loc.style.fontFamily = "Consolas,Arial";
			        loc.style.clear = "none";
			        loc.innerHTML= "Latitude: 28.9   Longitude: 138.9";
			        return loc;
			    }
			});
			this.map.addControl(new LatlngControl("latlngLocation", {position: 'bottomright'}));
			this.map.on("mousemove", function(e){
				//_lat = Number(e.latlng.lat).toFixed(2);
				//_lng = Number(e.latlng.lng).toFixed(2);
				$(".leaflet-control-location").html("纬度: " + Number(e.latlng.lat).toFixed(2) + "  经度: " + Number(e.latlng.lng).toFixed(2));
			});
		},
		call_mapEnlarge:null,
		call_mapNarrow:null,
		aMapZoom:function(){
			var _oldzoom = false;
			Ly.map.on("zoomstart",function(){
				_oldzoom = Ly.map.getZoom();
			});
			Ly.map.on("zoomend",function(e){
				_currzoom = Ly.map.getZoom();
				if(_currzoom>_oldzoom){   // 放大
					for(var i in layers){
						var o = layers[i];
						if(_currzoom > o.maxScale){
							Ly.map.removeLayer(o.layer);
						}
					}
					return;
				}else{  // 缩小
					for(var i in layers){
						var o = layers[i];
						if(_currzoom >= o.minScale){
							// 如果当前图层已经加载，则不重新加载。如果当前图层因放大时移除了图层，那么重新加载图层
							if(!Ly.map.hasLayer(o.layer))
								Ly.map.addLayer(o.layer);
							continue;
						}else{
							// 加载上一个级别的数据, 如果上级数据不存在那么移除该图层
							//Ly.map.removeLayer(o.layer);
							//te.addThemeMap(node, node.preCode);
							Ly.call_mapNarrow(o.level, o.code);
						}
					}
				}
			});
		},
		 addTileLayer: function(serviceUrl, tilePath){
			var wmts = new L.TileLayer.WMTS(serviceUrl + tilePath,
										{
										  style: "_null",
										  TILEMATRIXSET: "default028mms",
										  format: "image/png"		  			                                   
										});  
			wmts.setZIndex(100);
			Ly.map.addLayer(wmts);
			Ly.map.setView([29.55, 121.38], 13);
		}
	}
	function a(u, n,l,z){
		var lurl = u+"?service=wmts&request=GetTile&version=1.0.0&LAYER="+l+"&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles"
		var b;// = layerMaps.get(layername);
		b = L.tileLayer(lurl, {
				subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
		});//.addTo(Ly.map);
		b.setZIndex(z);
		Ly.map.addLayer(b);
	}
	var polyInfoLabel;
	function openPop(datas){
		if(polyInfoLabel) Ly.map.removeLayer(polyInfoLabel);
		polyInfoLabel = new L.Label();
		var info = datas.info;
		var contents = "";
		for(var k in info){
			contents += "<span>"+k+"：" + info[k] + "</span><br>";
		}
		polyInfoLabel.setContent("<div class='thematic-map-mousemove'>" +
				"<div class='thematic-map-mousemove-title'>"+datas.name+"</div>" +
				"<div class='thematic-map-mousemove-content'>" + contents+ "</div></div>");
		polyInfoLabel.setLatLng(datas.center);
		Ly.map.addLayer(polyInfoLabel);
	}
	function closePop(){
		if(polyInfoLabel) Ly.map.removeLayer(polyInfoLabel);
	}
	var layers = new Array();
	var Layers = {
		addLayer: function(o){
			layers.push(o);
		},
		removeLayer:function(id){
			//var g = layers.get(id);
			//if(g) Ly.map.removeLayer(g);
		},
		deleteLayer: function(id){
			//var g = layers.get(id);
			//if(g){
				//Ly.map.removeLayer(g);
				//layers.remove(id);
			//}
		},
		delLayers: function(){
			for(var i in layers){
				if(layers[i].layer)
					Ly.map.removeLayer(layers[i].layer);
			}
				
		}
	}
	return {
		Ly:Ly,
		loadMap: Ly.init,
		openPop: openPop,
		closePop: closePop,
		Layers: Layers
	}
});