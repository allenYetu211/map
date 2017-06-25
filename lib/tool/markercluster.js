/*
* 点聚类
*/
define("markercluster",["jquery","map","leaflet","surveydata", "common"],function(j,m,L,sd, common){
	var marker = {
		map: common.map,
		config:{
			call_click: null
		},
		g:[],
		l:[],
		group:{},
		markerList:[],
		markers:null,
		pop:null,
		termPop:null,
		init:function(fksurvey, con){
			this.config = $.extend({}, this.config, con);
			if(this.map){
				this.c(fksurvey);
			    return;
			}
			this.s();
			this.c(fksurvey);
		},
		c:function(fksurvey){
			var _this = this;
			if(_this.markers)
			    _this.map.removeLayer(_this.markers);
			var data = sd.SURVEY_DATA;
			console.log(data);
			_this.markerList = [];
			_this.markers = new L.MarkerClusterGroup();
			for (var i = 0; i < data.length; i++) {
				var a = data[i];
				if(typeof a.CENTER != "undefined" && "" != a.CENTER  && ( a.SURVEY == fksurvey || a.SURVEY == 1)){
					var title = a.CODE;
					var myIcon = L.divIcon({className: 'l-map-icon-red',iconSize: [18, 23]});
					var marker = _this.createMarker(a,a.CENTER, { title: title,icon:myIcon,CATEGORY: a.CATEGORY});
					_this.markers.addLayer(marker);
					_this.markerList.push(marker);
				}
			}
			_this.map.addLayer(_this.markers);
			_this.selectMarker();
		},
		selectMarker:function(selMarker, category){
			_this = this;
			if(selMarker){
				var m;
				for(var a in _this.markerList){
				   if(selMarker == _this.markerList[a].options.title && category == _this.markerList[a].options.CATEGORY){
				   	  console.log(m);
				   	  m = _this.markerList[a];
				   	  _this.r(m);
				   }
				}
			}
		},
		remove: function(){
			var _this = this;
			if(_this.markers)
			    _this.map.removeLayer(_this.markers);
		},
		r:function(m){
			this.markers.zoomToShowLayer(m, function () {
				m.openPopup();
			});
		},
		openPop:function(center, data){
			if(_this.pop)
					_this.map.removeLayer(_this.pop);
			var content = "<div class='thematic-map-mousemove'>";
			for(var i = 0; i < data.length; i++){
				content += "<div class='thematic-map-mousemove-title'>"+data[i]+"</div>";
			}	
			content += "</div></div>";
			_this.pop = new L.popup({className:"nytj-pop"});
			_this.pop.setContent(content);
			_this.pop.setLatLng(center);
			_this.map.addLayer(_this.pop);
		},
		createMarker:function(a,center, option){
			var _this = this;
			var marker = new L.Marker(center, option);
			
			var content = "";
			marker.on('click',function(e){
				console.log('marker', marker);
				if(_this.pop)
					_this.map.removeLayer(_this.pop);
				_this.config.call_click(e);
			});
			/*
			marker.bindPopup("<div class='thematic-map-mousemove'>" +
					"<div class='thematic-map-mousemove-title'>"+a.NAME+"</div>" +
					"<div class='thematic-map-mousemove-content'>" +a.CODE+
					//"<span>省编码：" + data.F_CODE +"</span><br>" +contents+
					"</div></div>",{className:"nytj-pop"});
					*/
			/*
			marker.on("mouseover",function(e){
				if(_this.pop)
					_this.map.removeLayer(_this.pop);
				_this.pop = new L.popup({className:"nytj-pop"});
				_this.pop.setContent("<div class='thematic-map-mousemove'>" +
						"<div class='thematic-map-mousemove-title'>"+a.NAME+"</div>" +
						"<div class='thematic-map-mousemove-content'>" +a.CODE+
						//"<span>省编码：" + data.F_CODE +"</span><br>" +contents+
						"</div></div>");
				_this.pop.setLatLng(e.target.getLatLng());
				_this.map.addLayer(_this.pop);
			});
			marker.on("mouseout",function(e){
				if(_this.pop)
					_this.map.removeLayer(_this.pop);
			});
			*/
			return marker;
		}
	}
	return T= {MARKER:marker};
});