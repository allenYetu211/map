require.config({
    //urlArgs: "v=3.0",
    baseUrl: "lib",
    paths: {
        "jquery": "jquery/jquery-1.11.1.min",
        // "jquery": "jquery/jquery-3.1.1.min",
        "leaflet": "leaflet/leaflet",
        "map": "leaflet/map",
        "userservice": "tool/userservice",
        "pie": "tool/pie",
        "config": "tool/config",
        "bar": "tool/bar",
        "common": "tool/common",
        "markercluster":"tool/markercluster",
		"surveydata":"tool/surveydata",

        "chart": "theChart/drawChart",
        "chartInformations": "theChart/Data_Display",
        "mapIntroduce": "theChart/introduceMap",
        "dataAdmin": "theChart/Data_Manage",
        "development": "theChart/Report_Development-F",
        "dataLaySth": "theChart/Report_Development-R",
        "translatePopup": "theChart/translatePopup",
        "infor_reported": "theChart/Data_Collection",
        "mainInface": "theChart/mainInface",
        "login": "theChart/login",
        // "corejs": "theChart/corejs",
        "local": "theChart/localStorage",
        "api": "theChart/api",
        "User_Manage": "theChart/User_Manage",
        "info": "theChart/Task_Assignment-S",
        "info_direction": "theChart/Task_Assignment-F",

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

require(["map", "common", "echarts", "chartInformations", "mapIntroduce", "dataAdmin", "development", "dataLaySth", "translatePopup", "infor_reported", "mainInface", "login", "local", "api","info","info_direction","User_Manage"],
    //require(["map", "menutree", "floattool", "lefttool", "drag", "echarts", "somoselect", "statictable", "chart", "chartInformations"],
    function(c, common, t) {
        var mapHelper = new c("map", {
            basemap: 'vec'
        });
        common.mapHelper = mapHelper;
        common.map = mapHelper.map;
    });