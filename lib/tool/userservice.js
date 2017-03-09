/*
* 用户服务调度类
*/
define("userservice",["jquery","map","staticchart","somoselect","statictable","chart"],function(j,m,sc,ss,st,dr){
	function a(o){
		if(typeof o.center === "undefined"){
			// console.log('when draw in map ,center is not undefined');
			return;
		}
		switch (o.mapType){
			case "render":
			    // console.log("adding render thememap");
				require([
                "render"
				],
				function(r){
					var u = r.addRender();
					addLayer(o,u);
				});
				break;
			case "point":
				// console.log("adding point thememap");
				require([
                "point"
				],
				function(r){
					var u = r.addPoint(o);
					addLayer(o,u);
				});
				break;
			case "graduatedSymbols":
				// console.log("adding point2 thememap");
				require([
                "point2"
				],
				function(r){
					var u = r.addPoint(o);
					addLayer(o,u);
				});
				break;
			case "pie":
				// console.log("adding pie thememap");
				require([
                "pie"
				],
				function(r){
					var u = r.addPie(o);
					addLayer(o,u);
				});
				m.Ly.call_mapNarrow = mapNarrow;
				break;
			case "bar":
				// console.log("adding bar thememap");
				require([
                "bar"
				],
				function(r){
					var u = r.addBar(o);
					addLayer(o,u);
				});
				break;
		}
	}
	function mapNarrow(){
		alert(1);
	}
	function dblclick(o){
		m.Layers.delLayers();
		/*
		o.maxScale++
		 console.log(o.maxScale)
		m.Ly.map.setView(o.center, o.maxScale);
		setTimeout(function () {
			o.level++
			dr.Dc(o.level, o.code)
		},500)
		m.Layers.delLayers();
		*/
	}
	function addLayer(o,u){
		o.layer = u;
		m.Layers.addLayer(o);
	}
	function addLayers(datas){
		for(var i in datas){
			datas[i].call_dblclick = dblclick;
			a(datas[i]);
		}
	}
	return T = {
		addLayers: addLayers
	}
});