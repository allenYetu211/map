require.config({
    //urlArgs: "v=3.0",
    baseUrl: "lib",
    paths: {
        "jquery": "jquery/jquery-1.11.1.min",
        // "jquery": "jquery/jquery-3.1.1.min",
        "leaflet": "leaflet/leaflet",
        "map": "leaflet/map",
        "ztree": "ztree/jquery.ztree.all",
        "mousewheel": "perfect/jquery.mousewheel",
        "perfect": "perfect/perfect-scrollbar",
        "menutree": "tool/menutree",
        "floattool": "tool/floattool",
        "lefttool": "tool/lefttool",
        "userservice": "tool/userservice",
        "render": "tool/render",
        "point": "tool/point",
        "point2": "tool/point2",
        "pie": "tool/pie",
        "drag": "tool/drag",
        "config": "tool/config",
        "bar": "tool/bar",
        "somoselect": "tool/somoselect",
        "statictable": "tool/statictable",
        "staticchart": "tool/staticchart",

        "markercluster": "tool/markercluster",
        "surveydata": "tool/surveydata",

        "chart": "theChart/drawChart",
        "chartInformations": "theChart/chartinformations",
        "mapIntroduce": "theChart/introduceMap",
        "dataAdmin": "theChart/dataAdmin",
        "development": "theChart/development",
        "dataLaySth": "theChart/dataLaySth",
        "info": "theChart/info",
        "translatePopup": "theChart/translatePopup",
        "infor_reported": "theChart/infor_reported",
        "mainInface": "theChart/mainInface",
        "login": "theChart/login",
        "local": "theChart/localStorage",
        "api": "theChart/api",

        "bootstrap": "sqlToolJs/bootstrap.min",
        "bootstrapSelect": "sqlToolJs/bootstrap-select.min",
        "bootbox": "sqlToolJs/bootbox",
        "bootstrapSlider": "sqlToolJs/bootstrap-slider.min",
        "bootstrapDatepicker": "sqlToolJs/bootstrap-datepicker.min",
        "selectize": "sqlToolJs/selectize.min",
        "jQueryExtendext": "sqlToolJs/jQuery.extendext.min",
        "sqlParser": "sqlToolJs/sql-parser",
        "doT": "sqlToolJs/doT",
        "interact": "sqlToolJs/interact",
        "queryBuilder": "sqlToolJs/query-builder",
        "sqlBuilder": "sqlToolJs/sql-builder"
    },
    shim: {
        "sumoselect": ["jquery", "perfect", "mousewheel"],
        'echarts': {
            exports: 'echarts/echarts'

        },
        "bootstrap": {
            deps: ["jquery", ""],
            exports: "_"
        },
        "sqlBuilder": {
            deps: ["jquery"],
            exports: "sq"
        },
        "queryBuilder": {
            deps: ["jquery"],
            exports: 'qb'
        },
        "translatePopup": {
            deps: ["jquery"],
            exports: 'tl'
        }
    },
    waitSeconds: 0
});
require(["map", "menutree", "floattool", "lefttool", "drag", "echarts", "somoselect", "statictable", "chartInformations", "mapIntroduce", "dataAdmin", "development", "dataLaySth", "translatePopup", "infor_reported", "mainInface", "login", "local", "api"],
    //require(["map", "menutree", "floattool", "lefttool", "drag", "echarts", "somoselect", "statictable", "chart", "chartInformations"],
    function(c, t, a, b, d, echarts, s, st, ch, ma) {
        // console.log(ch)
        c.loadMap("map", "t");
        // t.initTree("ywdtTree");
        b.initEvent();
        a.loadFloatTool()
            // ma.load()
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