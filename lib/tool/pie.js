/*
* 用户服务调度类
*/
define("pie",["jquery","map","leaflet","echarts"],function(j,m,i,ec){
	var map = m.getMap().map, g, Ly = m.getMap(), labels=[], infoLabel={};
	var options =  {
			series : [
				{
					name:'访问来源',
					type:'pie',
					radius : '55%',
					center: ['50%', '60%'],
					itemStyle:{
						normal: {
							label:{
								show:false
							},
							labelLine : {
								  show : false
							}
						}
					},
					data:[
						{value:335, name:'直接访问'},
						{value:310, name:'邮件营销'},
						{value:234, name:'联盟广告'},
						{value:135, name:'视频广告'},
						{value:1548, name:'搜索引擎'}
					]
				}
			]
		};
	function a(){	 
		var data = [{   "center":[40,100],"count":32,"fillColor":"#3ce","width":30,"info":{"name":"1测试名称","code":"测试编码"},
						"zoom": 7,
		                "childs":[{"center":[40.35,100.35],"count":3,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"测试编码"}}]
					},
					{   "center":[39,110],"count":57,"fillColor":"#3ce","width":50,"info":{"name":"测试名称","code":"1测试编码"},
						"zoom": 7,
		                "childs":[{"center":[39.35,110.35],"count":4,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"测试编码"}}]
					}];
	    return b(data);
	}
	function b(data){
		if(g) map.removeLayer(g);
		if(infoLabel) map.removeLayer(infoLabel);
		labels=[];
		for(var n in data){
			var o = data[n];
			var label = new i.Label();
			label.setContent("<div id=\"chart_pie"+n+"\" style=\"position: absolute;left:-"+Math.ceil(o.width/2)+"px;background:"+o.fillColor+";width:"+o.width+"px;height:"+o.width+"px;line-height:"+o.width+"px;border-radius: "+Math.ceil(o.width/2)+"px;color:#ffffff;margin-left:2px;font-weight:normal;font-size:10px;text-align: center;font-family:\"微软雅黑 \"\">"+
							o.count+"</div>");
			label.setLatLng(o.center);
			label.options.className = "theme-map-point";
			label.options.direction = "testd";
			label.options.clickable = true;
			
			label.on("mouseover",function(e){
				if(infoLabel) map.removeLayer(infoLabel);
				var info = o.info, c="";
				for(var k in info)
					c += "<span>" + k + " : " + info[k] +"</span><br/>";
				infoLabel = new i.Label();
				infoLabel.setContent("<div class='thematic-map-mousemove'>" +
							//"<div class='thematic-map-mousemove-title'>""</div>" +
							"<div class='thematic-map-mousemove-content'>" +c+
							//"<span>省编码：" + data.F_CODE +"</span><br>" +contents+
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
				i.setView(e.target._latlng, o.zoom);
			});
			labels.push(label);
			c(options, "chart_pie"+n);
		}
	    g = i.layerGroup(labels);
		map.addLayer(g);
		return g;
	}
	function c(options,divId){
		require(['echarts'],function (echarts) {
			console.log(echarts);
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