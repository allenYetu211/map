/*
* 用户服务调度类
*/
define("userservice",["jquery","map","menutree","staticchart","somoselect","statictable"],function(j,m,t,sc,ss,st){
	function a(o){
		console.log(o);
		switch (o.ftype){
			case "render":
			    console.log("adding render thememap");
				require([
                "render"
				],
				function(r){
					var u = r.addRender();
					var oo = {k:o.id, v:u}
					t.putLayer(oo);
				});
				break;
			case "point":
				console.log("adding point thememap");
				sc.chart(o.option,o.children);
				ss.selecter("ss",{title:"专题",datas:[{value:o.id,text:o.name}]});
				//ss.addOption("ss",[{value:2,text:"sss"}]);
				st.table("ss",{name:'测试名称',code:'编码',center:'中心点'},o.datas);
				require([
                "point"
				],
				function(r){
					var u = r.addPoint(o);
					var oo = {k:o.id, v:u}
					t.putLayer(oo);
				});
				break;
			case "point2":
				console.log("adding point2 thememap");
				sc.chart(o.option,o.children);
				ss.selecter("ss",{title:"专题",datas:[{value:o.id,text:o.name}]});
				//ss.addOption("ss",[{value:2,text:"sss"}]);
				st.table("ss",{name:'测试名称',code:'编码',center:'中心点'},o.datas);
				require([
                "point2"
				],
				function(r){
					var u = r.addPoint(o);
					var oo = {k:o.id, v:u}
					t.putLayer(oo);
				});
				break;
			case "pie":
			console.log("adding pie thememap");
				require([
                "pie"
				],
				function(r){
					var u = r.addPie();
					var oo = {k:o.id, v:u}
					t.putLayer(oo);
				});
				break;
		}
	}
	return T = {
		addLayer: a
	}
});