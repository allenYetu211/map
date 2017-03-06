define("map", ["leaflet", "jquery"],
function(i, e) {
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
			Ly.s();
			Ly.ctrl();
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
		addTileLayer: function(serviceUrl, tilePath){
			var wmts = new L.TileLayer.WMTS(serviceUrl + tilePath,
										{
										  style: "_null",
										  TILEMATRIXSET: "default028mms",
										  format: "image/png"		  			                                   
										});  
			Ly.map.addLayer(wmts);
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
	return {
		m:Ly,
		loadMap: Ly.init,
		getMap: function() {
			return Ly
		},
		openPop:openPop,
		closePop:closePop
	}
});