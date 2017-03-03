/*
* 用户服务调度类
*/
define("point",["jquery","map","leaflet","statictable"],function(j,m,i,st){
	var map = m.getMap().map, g, Ly = m.getMap(), labels=[], infoLabel={};
	function a(treeNode){	
	    return b(treeNode);
	}
	function b(treeNode){
		var data = treeNode.datas;
		if(g) g="";
		if(infoLabel) map.removeLayer(infoLabel);
		labels=[];
		for(var n in data){
			var o = data[n];
			var label = c(o,treeNode);
			labels.push(label);
		
		}
	    g = i.layerGroup(labels);
		map.addLayer(g);
		return g;
	}
	function c(o,treeNode){
		var label = new i.Label();
		label.setContent("<div style=\"position: absolute;left:-"+Math.ceil(o.width/2)+"px;background:"+o.fillColor+";width:"+o.width+"px;height:"+o.width+"px;line-height:"+o.width+"px;border-radius: "+Math.ceil(o.width/2)+"px;color:#ffffff;margin-left:2px;font-weight:normal;font-size:10px;text-align: center;font-family:\"微软雅黑 \"\">"+
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
			infoLabel.setLatLng(e.target._latlng);
			map.addLayer(infoLabel);
			var center_str = e.target._latlng.lat+","+e.target._latlng.lng;
			st.selectTr(center_str,true);
		});
		label.on("mouseout",function(e){
			if(infoLabel) map.removeLayer(infoLabel);
			var center_str = e.target._latlng.lat+","+e.target._latlng.lng;
			st.selectTr(center_str,false);
		});
		label.on("dblclick",function(e){
			// 获取下一级数据
			treeNode.datas = o.childs;
			map.setView(e.target._latlng, o.zoom);
			require([
				"userservice"
			],
			function(h){
				h.addLayer(treeNode);
			})
		});
		return label;
	}
	return T = {
		addPoint: a
	}
});