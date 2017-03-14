/*
* 用户服务调度类
*/
define("bar",["jquery","map","leaflet","echarts","config", "chart"],function(j,m,i,ec,conf,dr){
	var map = m.Ly.map, labels=[], infoLabel={}, CONFIG = conf.CONFIG, div_index=0;	
	function a(o){	
	    return b(formaterdData(o.data));
	}
	function formaterdData(o){
		for(var j in o){
			var data = o[j];
			var dataAxis = new Array();
			for(var i in data.data){
				data.data[i].itemStyle = getItemStyle(i);
				dataAxis.push(data.data[i].name);
			}
			data.option = createPieOption(data.data, dataAxis);
		}
		return o;
	}
	function getItemStyle(index){
		var color = CONFIG.getColor(index);
		return {normal:{"color":color}, emphasis:{"color":color}};
	}
	function createPieOption(data, dataAxis){		
		var barOption = {
				xAxis: {data: dataAxis,axisLabel: {inside: false,margin: 1,textStyle: {color: '#000000'}},axisTick: {show: false},axisLine: {show: false}},
				yAxis: {axisLine: {show: false},axisTick: {show: false},splitLine: {show:false},axisLabel: {show:false}},
				dataZoom: [{type: 'inside'}],
				tooltip:{show:false,},
				series: [{type: 'bar', label: {normal: {show: false,position: 'inside'}}, data: data}]
			};
		return barOption;
	}
	function b(data){
		//if(g) map.removeLayer(g);
		if(infoLabel) map.removeLayer(infoLabel);
		labels=[];
		for(var n in data){
			var o = data[n];
			var label = new i.Label();
			o.width = o.hasOwnProperty('width')?o.width:100;
			o.height = o.hasOwnProperty('height')?o.height:100;
			var offsetVal = Math.ceil(o.width/2)-5;
			label.setContent("<div id=\"chart_bar"+div_index+"\" style=\"position: absolute;left:-"+offsetVal+"px;top:-"+offsetVal+"px;width:"+o.width+"px;height:"+o.height+"px;text-align: center;\"></div>");
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
				infoLabel.setLatLng(e.target._latlng);
				map.addLayer(infoLabel);
			});
			label.on("mouseout",function(e){
				if(infoLabel) map.removeLayer(infoLabel);
			});
			label.on("dblclick",function(e){				
				o.call_dblclick(o);
			});
			labels.push(label);
			c(o.option, "chart_bar"+div_index);
			div_index++;
		}
	    var g = i.layerGroup(labels);
		map.addLayer(g);
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
		addBar: a
	}
});