define("menutree",["jquery","ztree","perfect","map","mousewheel"],function(j,z,f,p){
	function HashMap(){  
		//定义长度  
		var length = 0;  
		//创建一个对象  
		var obj = new Object();  
	  
		/** 
		* 判断Map是否为空 
		*/  
		this.isEmpty = function(){  
			return length == 0;  
		};  
	  
		/** 
		* 判断对象中是否包含给定Key 
		*/  
		this.containsKey=function(key){  
			return (key in obj);  
		};  
	  
		/** 
		* 判断对象中是否包含给定的Value 
		*/  
		this.containsValue=function(value){  
			for(var key in obj){  
				if(obj[key] == value){  
					return true;  
				}  
			}  
			return false;  
		};  
	  
		/** 
		*向map中添加数据 
		*/  
		this.put=function(key,value){  
			if(!this.containsKey(key)){  
				length++;  
			}  
			obj[key] = value;  
		};  
	  
		/** 
		* 根据给定的Key获得Value 
		*/  
		this.get=function(key){  
			return this.containsKey(key)?obj[key]:null;  
		};  
	  
		/** 
		* 根据给定的Key删除一个值 
		*/  
		this.remove=function(key){  
			if(this.containsKey(key)&&(delete obj[key])){  
				length--;  
			}  
		};  
	  
		/** 
		* 获得Map中的所有Value 
		*/  
		this.values=function(){  
			var _values= new Array();  
			for(var key in obj){  
				_values.push(obj[key]);  
			}  
			return _values;  
		};  
	  
		/** 
		* 获得Map中的所有Key 
		*/  
		this.keySet=function(){  
			var _keys = new Array();  
			for(var key in obj){  
				_keys.push(key);  
			}  
			return _keys;  
		};  
	  
		/** 
		* 获得Map的长度 
		*/  
		this.size = function(){  
			return length;  
		};  
	  
		/** 
		* 清空Map 
		*/  
		this.clear = function(){  
			length = 0;  
			obj = new Object();  
		};  
	}
	var ml = new HashMap();
	var IDMark_Switch = "_switch",
		IDMark_Icon = "_ico",
		IDMark_Span = "_span",
		IDMark_Input = "_input",
		IDMark_Check = "_check",
		IDMark_Edit = "_edit",
		IDMark_Remove = "_remove",
		IDMark_Ul = "_ul",
		IDMark_A = "_a";
    var z,u;
    var te = {
		showIconForTree: function(treeId, treeNode){
			return !treeNode.isParent;
		},
		onClick: function(e,treeId, treeNode) {
			if(treeNode.open){
				j(".ztree li a.level0[title='"+ treeNode.name +"']").removeClass("checkedNode");
			    z.expandNode(treeNode);
			}else{
				if(treeNode.ischild){
					j(".ztree li a.level0[title='"+ treeNode.name +"']").addClass("checkedNode");
					z.expandNode(treeNode);
				}else{
					te.addNodes(treeNode);
				}
			}
		},
		onCheck: function (e,treeId, treeNode){
		    var treeObj = z;
			if(treeNode.checked){
				if(treeNode.ftype == "point"){
					var newNodes = [{name:"",id:2211, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#e65414", info:"0-14岁人口(人)"},
									{name:"",id:2212, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#44b9b0",info:"15-64岁人口(人)"},
									{name:"",id:2213, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#d1c87f",info:"64岁以上人口(人)"}];
					te.addLegendNodes(treeNode, newNodes);
					var data = [{   "center":[40,100],"count":32,"fillColor":"#3ce","width":30,"info":{"name":"1测试名称","code":"测试编码"},
						"zoom": 7,
		                "childs":[{"center":[40.35,100.35],"count":3,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"测试编码"}}]
					},
					{   "center":[39,110],"count":57,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"1测试编码"},
						"zoom": 7,
		                "childs":[{"center":[39.35,110.35],"count":4,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"测试编码"}}]
					},
					{   "center":[37,110],"count":57,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"1测试编码"}},
					{   "center":[37,100],"count":57,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"1测试编码"}},
					{   "center":[36,100],"count":57,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"1测试编码"}},
					{   "center":[37,98],"count":57,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"1测试编码"}},
					{   "center":[37,120],"count":57,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"1测试编码"}},
					{   "center":[40,120],"count":5,"fillColor":"#3ce","width":30,"info":{"name":"测试名称","code":"1测试编码"}}
					];
					treeNode.datas = data;
					
					var option = {"backgroundColor":{"backgroundColor":"#ffffff"},"calculable":true,"legend":{"data":["数量"]},"series":[{"data":["144"],"name":"数量","type":"bar"}],"title":{"subtext":"","text":""},"toolbox":{"feature":{"magicType":{"show":true,"type":["line","bar"]},"restore":{"show":true},"saveAsImage":{"show":true}},"show":true},"tooltip":{"trigger":"axis"},"xAxis":[{"data":["奉化市"],"type":"category"}],"yAxis":[{"type":"value"}]};
					treeNode.option = option;
				}
				if(treeNode.ftype == "point2"){
					var newNodes = [{name:"",id:2211, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#0000FF", info:"< 1075043",radius:4},
									{name:"",id:2212, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#0000FF",info:"1075043 - 3383757",radius:6},
									{name:"",id:2213, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#0000FF",info:"3383757 - 5270347",radius:8},
									{name:"",id:2213, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#0000FF",info:"5270347 - 7445877",radius:10},
									{name:"",id:2213, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#0000FF",info:"7445877 - 9258762",radius:12},
									{name:"",id:2213, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#0000FF",info:"9258762 - 12821468",radius:14},
									{name:"",id:2213, pId: treeNode.id,iconSkin:"icon01",nocheck:true,color:"#0000FF",info:">= 12821468",radius:16}
									];
					te.addLegendNodes(treeNode, newNodes);
					var data = [
					{"center":[36.88,115.84],"count":57,"fillColor":"rgb(0, 0, 255)","width":14.5,"info":{"name":"河北省","code":"1测试编码"}},
					{"center":[37.76,112.37],"count":57,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"山西省","code":"1测试编码"}},
					{"center":[44.05,118.83],"count":57,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"内蒙古自治区","code":"1测试编码"}},
					{"center":[43.29,126.42],"count":57,"fillColor":"rgb(0, 0, 255)","width":7.5,"info":{"name":"吉林省","code":"1测试编码"}},
					{"center":[47.35,128.34],"count":57,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"黑龙江省","code":"1测试编码"}},
					{"center":[33.07,119.66],"count":56,"fillColor":"rgb(0, 0, 255)","width":18,"info":{"name":"江苏省","code":"1测试编码"}},
					{"center":[29.16,120.08],"count":56,"fillColor":"rgb(0, 0, 255)","width":14.5,"info":{"name":"浙江省","code":"1测试编码"}},
					{"center":[31.95,117.20],"count":56,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"安徽省","code":"1测试编码"}},
					{"center":[26.08,117.97],"count":56,"fillColor":"rgb(0, 0, 255)","width":14.5,"info":{"name":"福建省","code":"1测试编码"}},
					{"center":[27.61,115.00],"count":56,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"江西省","code":"1测试编码"}},
					{"center":[36.33,118.19],"count":56,"fillColor":"rgb(0, 0, 255)","width":18,"info":{"name":"山东省","code":"1测试编码"}},
					{"center":[33.88,113.68],"count":56,"fillColor":"rgb(0, 0, 255)","width":18,"info":{"name":"河南省","code":"1测试编码"}},
					{"center":[30.99,112.07],"count":56,"fillColor":"rgb(0, 0, 255)","width":14.5,"info":{"name":"湖北省","code":"1测试编码"}},
					{"center":[27.89,110.97],"count":56,"fillColor":"rgb(0, 0, 255)","width":14.5,"info":{"name":"湖南省","code":"1测试编码"}},
					{"center":[23.35,113.47],"count":56,"fillColor":"rgb(0, 0, 255)","width":25,"info":{"name":"广东省","code":"1测试编码"}},
					{"center":[23.50,108.34],"count":56,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"广西壮族自治区","code":"1测试编码"}},
					{"center":[30.02,107.60],"count":56,"fillColor":"rgb(0, 0, 255)","width":7.5,"info":{"name":"重庆市","code":"1测试编码"}},
					{"center":[30.61,102.29],"count":56,"fillColor":"rgb(0, 0, 255)","width":21.5,"info":{"name":"四川省","code":"1测试编码"}},
					{"center":[33.77,108.37],"count":56,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"陕西省","code":"1测试编码"}},
					{"center":[34.92,104.78],"count":56,"fillColor":"rgb(0, 0, 255)","width":7.5,"info":{"name":"甘肃省","code":"1测试编码"}},
					{"center":[37.27,106.18],"count":56,"fillColor":"rgb(0, 0, 255)","width":4,"info":{"name":"宁夏回族自治区","code":"1测试编码"}},
					{"center":[40.18,116.43],"count":56,"fillColor":"rgb(0, 0, 255)","width":4,"info":{"name":"北京市","code":"1测试编码"}},
					{"center":[39.31,117.34],"count":56,"fillColor":"rgb(0, 0, 255)","width":4,"info":{"name":"天津市","code":"1测试编码"}},
					{"center":[26.81,106.87],"count":56,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"贵州省","code":"1测试编码"}},
					{"center":[32.27,83.57],"count":56,"fillColor":"rgb(0, 0, 255)","width":4,"info":{"name":"西藏自治区","code":"1测试编码"}},
					{"center":[35.74,96.00],"count":56,"fillColor":"rgb(0, 0, 255)","width":4,"info":{"name":"青海省","code":"1测试编码"}},
					{"center":[41.36,84.90],"count":56,"fillColor":"rgb(0, 0, 255)","width":7.5,"info":{"name":"新疆维吾尔自治区","code":"1测试编码"}},
					{"center":[24.97,101.44],"count":56,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"云南省","code":"1测试编码"}},
					{"center":[19.18,109.94],"count":56,"fillColor":"rgb(0, 0, 255)","width":7.5,"info":{"name":"海南省","code":"1测试编码"}},
					{"center":[23.84,121.80],"count":56,"fillColor":"rgb(0, 0, 255)","width":8,"info":{"name":"台湾省","code":"1测试编码"}},
					{"center":[41.39,123.50],"count":56,"fillColor":"rgb(0, 0, 255)","width":11,"info":{"name":"辽宁省","code":"1测试编码"}}
					];
					treeNode.datas = data;
					var option = {"backgroundColor":{"backgroundColor":"#ffffff"},"calculable":true,"legend":{"data":["数量"]},"series":[{"data":["144"],"name":"数量","type":"bar"}],"title":{"subtext":"","text":""},"toolbox":{"feature":{"magicType":{"show":true,"type":["line","bar"]},"restore":{"show":true},"saveAsImage":{"show":true}},"show":true},"tooltip":{"trigger":"axis"},"xAxis":[{"data":["奉化市"],"type":"category"}],"yAxis":[{"type":"value"}]};
					treeNode.option = option;
				}
				// 加载专题图
				require([
                "userservice"
				],
				function(h){
					h.addLayer(treeNode);
				})
				
			}else{
				var nodes = treeObj.getNodesByParam("pId", treeNode.id, null);
				for (var i=0, l=nodes.length; i < l; i++) {
					treeObj.removeNode(nodes[i]);
				}
				mp.rl(treeNode.id);
			}
		},
		addDiyDom: function (treeId, treeNode){
			if(treeNode.open ){
			   j(".ztree li a.level0[title='"+ treeNode.name +"']").addClass("checkedNode");
			}
			if (treeNode.parentNode && treeNode.parentNode.id!=2) return;
			var aObj = j("#" + treeNode.tId + IDMark_A);
			if (treeNode.pId == 222) {
				te.addDiyDom1(treeNode);
			} 
			if(treeNode.iconSkin == "icon03"){
				aObj.addClass("legend-img");
				aObj.append("<img src='data:image/jpg;base64,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'>");
			}
		},
		addDiyDom1: function (treeNode) {
			var aObj = j("#" + treeNode.tId + IDMark_A),
				marginSize=0,
				width = treeNode.hasOwnProperty('radius')?treeNode.radius:13;
			style = "background:"+treeNode.color+";"+
					"width:"+treeNode.radius+"px;"+
					"height:"+treeNode.radius+"px;";
			if(treeNode.hasOwnProperty('radius')){
				marginSize = (16-treeNode.radius)/2;
				style += "border-radius:"+treeNode.radius+"px;"+
							"margin-top:"+marginSize+"px;"+
						  "margin-left:"+marginSize+"px;"
			}
			//var editStr = "<span class='legend' style='background: "+treeNode.color+"'></span><span class='legend-info'>"+treeNode.info+"</span>";
			
			var editStr = "<div class='legend_line' style='height:16px;line-height:16px;'><div style='"+style+"'></div><span>"+treeNode.info+"</span></div>";
			aObj.append(editStr);
			var btn = j("#diyBtn_"+treeNode.id);
			if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
		},
		nodeHover: function(){
		    j(".node_name").hover(function(){				
				var node = z.getNodeByParam("name",j(this).text(), null);
				if(typeof node.introduce === "undefined"){
					return;
				}
				//console.log(node);
				var top = j(this).offset().top;
				j(".subject-brief").css({top: top+"px"});
				j('.subject-brief').empty();
				j('.subject-brief').append("<div class='brief-header'><span class='brief-title'>"+node.name+"</span></div>");
				j('.subject-brief').append("<div class='brief-body'><div class='brief-title'>描述:</div><div class='brief-content'><p>"+node.introduce+"</p></div>"
				+"<div class='brief-title'>时间:</div><div class='brief-content'><p>"+node.dataTime+"</p></div>"
				+"<div class='brief-title'>提供单位:</div><div class='brief-content'><p>"+node.dataFrom+"</p></div>"
				+"</div>");
				j('.subject-brief').show();
			},function(){
				j('.subject-brief').hide();
			});
		},
		addLegendNodes:function(treeNode, newNodes){
			if(treeNode.hasOwnProperty("children") && treeNode.children.length>0){
        		return;
        	}else{
				newNodes = z.addNodes(treeNode, newNodes);
				var nodes = z.getNodesByParam("pId", treeNode.id, null);
				for (var i=0, l=nodes.length; i < l; i++) {
					te.addDiyDom1(nodes[i]);
				}
        	}
		},
		addNodes:function(treeNode){
			
			var newNodes = [
			{ id:111, pId:treeNode.id, name:"测绘地理信息机构",iconSkin:"icon01",dataFrom:"国家测绘地理信息局",dataTime:"2016",introduce:"主管测绘地理信息事业的行政机构。",ischild:true}];
			z.addNodes(treeNode, newNodes);
			treeNode.ischild = true;
			z.updateNode(treeNode);
			te.nodeHover();
			/*
			$.ajax({
				url:"userCtrl/menudata",
				data:{menuid: treeNode.id},
				async:false,
				success:function(newNodes){
				   console.log(newNodes);
				   z.addNodes(treeNode, newNodes);
				}
			});
			*/
		},
		onExpand: function(event, treeId, treeNode){
			console.log("展开"+treeNode);
			//var aObj = j("#" + treeNode.tId + IDMark_A);
			//aObj.addClass("cursNode");
		},
		onCollapse: function(event, treeId, treeNode){
			console.log("折叠"+treeNode);
			//var aObj = j("#" + treeNode.tId + IDMark_A);
			//aObj.removeClass("cursNode");
		}
	}
	var mp = {
		a: function(o){
			console.log(o);
			ml.put(o.k,o.v);
		},
		r:function(){},
		rl: function(id){
			var g = ml.get(id);
			if(g){
				p.getMap().map.removeLayer(g);
			}
		}
	}
	var mt = {
		conf:{
			view: {
				showIcon: te.showIconForTree,
				showLine: false,
				dblClickExpand:false,
				addDiyDom: te.addDiyDom
			},
			check: {
				enable: true
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				onClick: te.onClick,
				onCheck: te.onCheck,
				onExpand: te.onExpand,
				onCollapse: te.onCollapse
			}
		},
		zNodes:[
			{ id:1, pid:0, name:"地理信息机构", open:true,nocheck:true,ischild:true},
			{ id:11, pId:1, name:"随意勾选 1-1", open:true,nocheck:true,ischild:true},
			{ id:111, pId:11, name:"测绘地理信息机构",iconSkin:"icon01",ftype:"render",dataFrom:"国家测绘地理信息局",dataTime:"2016",introduce:"主管测绘地理信息事业的行政机构。",ischild:false},
			{ id:112, pId:11, name:"点统计",iconSkin:"icon01",ischild:true,ftype:"point"},
			{ id:12, pId:1, name:"随意勾选 1-2", open:true,nocheck:true,ischild:true},
			{ id:121, pId:12, name:"户口登记在外省人口",iconSkin:"icon01",ischild:true, ftype:'point2'},
			{ id:122, pId:12, name:"随意勾选 1-2-2",iconSkin:"icon01",ischild:true},
			{ id:2, pId:0, name:"文化教育", checked:true, open:true,nocheck:true,ischild:true},
			{ id:21, pId:2, name:"随意勾选 2-1",nocheck:true, idchild: false,ischild:false},
			{ id:22, pId:2, name:"第六次人口普查", open:true,nocheck:true,ischild:true},
			{ id:221, pId:22, name:"人口年龄结构", checked:false,iconSkin:"icon01",ischild:true, ftype:"pie"},
			//{ id:2211, pId:221, name:"",iconSkin:"icon03",nocheck:true, info:"<7.67",ischild:true},
			{ id:222, pId:22, name:"人口老年比例",iconSkin:"icon01",open:true, checked:true,ischild:true},
			{ id:2221, pId:222, name:"",iconSkin:"icon01",nocheck:true, info:"<7.67",ischild:true},
			{ id:2222, pId:222, name:"",iconSkin:"icon01",nocheck:true, info:"7.67-9.73",ischild:true},
			{ id:2223, pId:222, name:"",iconSkin:"icon01",nocheck:true, info:"0.73-11.53",ischild:true},
			{ id:23, pId:2, name:"随意勾选 2-3",iconSkin:"icon01"},
			{ id:3, pId:0, name:"文化教育1", checked:true, open:true,nocheck:true,ischild:true},
			{ id:3301, pId:3, name:"随意勾选 1-1", open:true,nocheck:true,ischild:true},
		],
		init: function(tree){
			z = j.fn.zTree.init(j("#"+tree), mt.conf, mt.zNodes);
			j('#Default').perfectScrollbar({minScrollbarLength:100,suppressScrollX: true});
			te.nodeHover();
			p.m.map.on("zoomend",function(e){
				var nodes = z.getCheckedNodes(true);
				for(var i in nodes){
					var node = nodes[i];
					console.log(node);
					mp.rl(node.id);
					addTheme(node);
				}
			});
		}
	};
	function addTheme(node){
		require([
		"userservice"
		],
		function(h){
			h.addLayer(node);
			
		})
	}
	return T = {
		initTree: mt.init,
		putLayer: mp.a
	}
});