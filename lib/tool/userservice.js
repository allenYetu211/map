/*
* 用户服务调度类
*/
define("userservice",["jquery","common"],function(j,common){
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
        //m.ma.call_mapNarrow = mapNarrow;
    }
    function mapNarrow(o){
        //alert(1);
		// 移除当前数据
		var currObj = common.themeLayersList.get(o.layerId);
		common.map.removeLayer(currObj.layer);
		// 加载上级数据
		o.data[0].mapnarrow(o);
    }
	function dblclick(o){
		o.maxScale++;
		common.map.setView(o.center, o.maxScale);
		var currObj = common.themeLayersList.get(o.layerId);
		common.map.removeLayer(currObj.layer);
		currObj.currdata = o;
		setTimeout(function () {
			o.dblclick(o);
	    },500)
	}
    function addLayer(o,u){
		if(common.themeLayersList.size() < 1){
			common.mapHelper.mapZoomChange(mapNarrow);
		}
        o.layer = u;
		var obj = common.themeLayersList.get(o.layerId);
		if(obj)
			common.map.removeLayer(obj.layer);
		common.map.addLayer(o.layer);
		common.themeLayersList.put(o.layerId, o);
    }
    function addLayers(id, datas){
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
		if(pieList.length>0)
			a({"mapType":"pie","data":pieList, "layerId": pieList[0].layerId, "minScale": pieList[0].minScale, "maxScale": pieList[0].maxScale});
		if(barList.length>0)
			a({"mapType":"bar","data":barList, "layerId": barList[0].layerId, "minScale": barList[0].minScale, "maxScale": barList[0].maxScale});
    }
	function removeLayerById(id){
		var currObj = common.themeLayersList.get(id);
		common.mapHelper.removeLayer(currObj.layer);
		common.themeLayersList.remove(id);
	}
	function removeAllLayers(){
		var list = common.themeLayersList;
		var keys = list.keySet();
		for(var i in keys){
			var layer = list.get(keys[i].layer);
			common.mapHelper.removeLayer(currObj.layer);
			common.themeLayersList.remove(keys[i]);
		}
	}
    return T = {
        addLayers: addLayers,
		removeLayerById: removeLayerById,
		removeAllLayers: removeAllLayers
    }
});