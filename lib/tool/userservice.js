/*
* 用户服务调度类
*/
define("userservice",["jquery","map","staticchart","somoselect","statictable","chart"],function(j,m,sc,ss,st,dr){
	function a(o){
		/*
		if(typeof o.center === "undefined"){
			// console.log('when draw in map ,center is not undefined');
			return;
		}
		*/
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
		m.Ly.call_mapNarrow = mapNarrow;
	}
	function mapNarrow(){
		//alert(1);
	}
function dblclick(o){
  require(["map"],function(m){
   o.maxScale++;
   console.log(o.maxScale)
   m.Ly.map.setView(o.center, o.maxScale);
  });  
  setTimeout(function () {
   require(["chart","map"],
   function(dr){
    o.level++
    console.log(o.level)
    dr.Dc(o.level, o.code)
   });
  },500)
  m.Layers.delLayers();
 }
	function addLayer(o,u){
		o.layer = u;
		m.Layers.addLayer(o);
	}
	function addLayers(datas){
		var pieList = new Array();
		var barList = new Array();
		for(var i in datas){
			var o = datas[i];
			if(typeof o.center === "undefined"){
				continue;
			}
			o.call_dblclick = dblclick;
			switch (o.mapType){
				case "pie":
					pieList.push(o);
				break;
				case "bar":
					barList.push(o);
				break;
			}
		}
		a({"mapType":"pie","data":pieList});
		a({"mapType":"bar","data":barList});
	}
	return T = {
		addLayers: addLayers
	}
});