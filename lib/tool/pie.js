/*
* 用户服务调度类
*/
define("pie",["jquery","map","leaflet","echarts","config"],function(j,m,i,ec,conf){
	var map = m.Ly.map, g, labels=[], infoLabel={}, div_index=0;
	
	function a(o){	
	    return b(formaterdData(o));
	}
	function formaterdData(o){
		o.option = createPieOption(o.data);
		var oo = new Array();
		oo.push(o);
		return oo;
	}
	function createPieOption(data){
		var pieOption = {
			color: conf.CONFIG.COLOR,
			series : [
				{
					name: '访问来源',
					type: 'pie',
					radius : '98%',
					center: ['50%', '50%'],
					animation:false,
					data:data,
					itemStyle: {
						normal:{
						  label:{show:false},
						  labelLine:{show:false}
						},
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};
		return pieOption;
	}
	function b(data){
		if(g) map.removeLayer(g);
		if(infoLabel) map.removeLayer(infoLabel);
		labels=[];
		for(var n in data){
			var o = data[n];
			var label = new i.Label();
			o.width = o.hasOwnProperty('width')?o.width:60;
			var offsetVal = Math.ceil(o.width/2)-5;
			label.setContent("<div id=\"chart_pie"+div_index+"\" style=\"position: absolute;left:-"+offsetVal+"px;top:-"+offsetVal+"px;width:"+o.width+"px;height:"+o.width+"px;border-radius: "+Math.ceil(o.width/2)+"px;text-align: center;\"></div>");
			label.setLatLng(o.center);
			label.options.className = "theme-map-point";
			label.options.direction = "testd";
			label.options.clickable = true;
			
			label.on("mouseover",function(e){
				if(infoLabel) map.removeLayer(infoLabel);
				var info = o.other, c="";
				for(var k in info){
					var kvalue = getLabelValue(info[k]);
					if(kvalue.indexOf("POINT")<0)
						c += "<span>" + info[k].label + " : " + getLabelValue(info[k]) +"</span><br/>";
				}
				infoLabel = new i.Label();
				infoLabel.setContent("<div class='thematic-map-mousemove'>" +
							"<div class='thematic-map-mousemove-content'>" +c+
							"</div></div>");
				console.log(e);
				infoLabel.setLatLng(e.target._latlng);
				map.addLayer(infoLabel);
			});
			label.on("mouseout",function(e){
				if(infoLabel) map.removeLayer(infoLabel);
			});
			label.on("dblclick",function(e){				
				b(o.childs);
				// i.setView(e.target._latlng, o.zoom);
			});
			labels.push(label);
			c(o.option, "chart_pie"+div_index);
		}
	    var g = i.layerGroup(labels);
		map.addLayer(g);
		div_index++;
		return g;
	}
	function getLabelValue(o){
		for(var key in o){
			if( key !== "label")
				return o[key];
		}
	}
	function c(options,divId){
		require(['echarts'],function (echarts) {
			// 基于准备好的dom，初始化echarts图表
			var myChart = echarts.init(document.getElementById(divId)); 		   
			// 为echarts对象加载数据 
			myChart.setOption(options); 
		});
	}
	return T = {
		addPie: a
	}
});