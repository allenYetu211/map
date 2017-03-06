/*
* 用户服务调度类
*/
define("userservice",["jquery","map","staticchart","somoselect","statictable"],function(j,m,sc,ss,st){
	function a(o){
		switch (o.mapType){
			case "render":
			    console.log("adding render thememap");
				require([
                "render"
				],
				function(r){
					var u = r.addRender();
					addLayer(o,u);
				});
				break;
			case "point":
				console.log("adding point thememap");
				require([
                "point"
				],
				function(r){
					var u = r.addPoint(o);
					addLayer(o,u);
				});
				break;
			case "graduatedSymbols":
				console.log("adding point2 thememap");
				require([
                "point2"
				],
				function(r){
					var u = r.addPoint(o);
					addLayer(o,u);
				});
				break;
			case "pie":
				console.log("adding pie thememap");
				require([
                "pie"
				],
				function(r){
					var u = r.addPie(o);
					addLayer(o,u);
				});
				break;
			case "bar":
				console.log("adding bar thememap");
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
	function addLayer(o,u){
		o.layer = u;
		m.Layers.addLayer(o);
	}
	function addLayers(datas){
		for(var i in datas)
			a(datas[i]);
	}
	return T = {
		addLayers: addLayers
	}
});