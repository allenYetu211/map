/*
 wGIS, a JavaScript library
 (c) 2015, zheng jinwei | nmc.gis@163.com
*/
function getScript(a) {
    var b, c = document;
    c.body ? (b = c.createElement("script"), b.charset = "utf-8", b.src = a, c.body.appendChild(b)) :c.write('<script src="' + a + '" type="text/javascript" charset="utf-8"></script>');
}

function getLink(a) {
    if (document.getElementsByTagName("head")[0]) {
        var b = document.createElement("link");
        b.setAttribute("rel", "stylesheet"), b.setAttribute("type", "text/css"), b.setAttribute("href", a), 
        document.getElementsByTagName("head")[0].appendChild(b);
    } else {
        document.write('<link rel="stylesheet" type="text/css" href="' + a + '">');
    }
}


getScript(basePath+"lib/leaflet/leaflet.js");
getLink(basePath+"lib/leaflet/leaflet.css");
//getScript("http://cdn-geoweb.s3.amazonaws.com/terraformer/1.0.4/terraformer.min.js");
//getScript("http://cdn-geoweb.s3.amazonaws.com/terraformer-wkt-parser/1.0.0/terraformer-wkt-parser.min.js");

$(function(){
//初始化地图
var map = L.map("map", {
	center: [35.59,108.29],
	zoom: 4,
	minZoom: 1,
	maxZoom: 18,	
	attributionControl: false,
	zoomControl: false
	//crs: L.CRS.EPSG4326
});
L.tileLayer("http://t{s}.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
	subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
}).addTo(map);
});

//getLink(config.css + "?v=" + config.version + "&key=" + config.key), getScript(config.script + "?v=" + config.version + "&key=" + config.key);