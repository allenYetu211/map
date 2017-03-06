require.config({
	//urlArgs: "v=3.0",
	baseUrl:"lib",
	paths: {
		"jquery": "jquery/jquery-1.11.1.min",
		"leaflet": "leaflet/leaflet",
		"map": "leaflet/map",
		"ztree": "ztree/jquery.ztree.all",
		"mousewheel": "perfect/jquery.mousewheel",
		"perfect": "perfect/perfect-scrollbar",
		"menutree": "tool/menutree",
		"floattool": "tool/floattool",
		"lefttool": "tool/lefttool",
		"userservice": "tool/userservice",
		"render":"tool/render",
		"point":"tool/point",
		"point2":"tool/point2",
		"pie":"tool/pie",
		"drag": "tool/drag",
		"config":"tool/config",
		"bar":"tool/bar",
		"somoselect":"tool/somoselect",
		"statictable":"tool/statictable",
		"staticchart":"tool/staticchart",
		"chart":"theChart/drawChart"
	},	
	shim: {
		"sumoselect": ["jquery","perfect","mousewheel"],
		'echarts':{
            exports:'echarts/echarts' 
        }
	},
	waitSeconds: 0
});
require(["map", "menutree", "floattool", "lefttool","drag","echarts","somoselect","statictable", "chart"],
function(c, t, a, b, d,echarts,s,st,ch) {
	// console.log(ch)
	c.loadMap("map","t");
	// t.initTree("ywdtTree");
	b.initEvent();
	a.loadFloatTool()
	// d.dragBox("box",function(e){
	// 	console.log(e.width());
	// 	console.log(e.height());
	// 	console.log(e);
	// 	var $o = e[0], $img = e.find("img");
	// 	$img.css({width: e.width(),
	// 	height:e.height()});
	// 	console.log()
	// });
	// d.dragBox("main_table",function(e){
	// });
	// d.dragBox("main_char",function(e){
	// });
	
	
});