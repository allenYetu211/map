/*
* 用户服务调度类
*/
define("statictable",["jquery","map","mousewheel","perfect"],function(j,m){
	function a(sel, columns,datas){
		console.log(datas);
		j("#main_table_content").remove();
		var tablebody = "<div id=\"main_table_content\" class=\"table-body ps-container\" style=\"border-left-width: 1px; border-left-style: solid; border-left-color: rgb(237, 237, 237);\">"+
						"<table>"+
						"<thead>"+
						"</thead><tbody></tbody>"+
						"</table>"+
						"</div>";
		j("#"+sel).append(tablebody);	
		b(sel, columns);
		c(sel,datas,columns);
		
		//j('#main_table_content').perfectScrollbar({minScrollbarLength:100});
		var $container = j('#main_table_content');
		 $container.perfectScrollbar();
		 $container.scroll(function(e) {
			$("#main_table_content table thead").css({
			   "position":"",
			   "top":""
		    });
			var scrollTop = $container.scrollTop();
			console.log(scrollTop);
		   if($container.scrollTop() === 0 || $container.scrollTop() == 0) {
			 //$status.text('it reaches the top!');
		   }else if ($container.scrollTop() === ($container.prop('scrollHeight') - $container.height())) {
			    $("#main_table_content table thead").css({
				   "position":"absolute",
				   "top":$container.scrollTop()+"px"
			    });
		   }else {
			   $("#main_table_content table thead").css({
				   "position":"absolute",
				   "top":$container.scrollTop()+"px"
			   });
		   }
		 });
	}
	// adding thead
	function b(sel, columns){
		//j("#"+sel).find("div.table-body table thead").append("<tr><th><div style=\"width: 24px;\">序号</div><div class=\"separator-line\"></div></th><th><div style=\"width: 24px;\">行政区划</div></th><th><div style=\"width: 24px;\">行政区划</div></th></tr>");
		var $tr = j("<tr></tr>");
		$tr.append("<th><div style=\"width:24px\">序号</div><div class=\"separator-line\"></div></th>");
		for(var k in columns){
			$tr.append("<th><div style=\"width:50px;\">"+columns[k]+"</div><div class=\"separator-line\"></div></th>");
		}
		j("#"+sel).find("div.table-body table thead").append($tr);
	}
	// adding tbody
	function c(sel,datas,columns){
		for(var i in datas){
			var d = datas[i].info;
			var $tr = j("<tr></tr>");
			var index = Number(i)+1;
			$tr.append("<td><div style=\"width:24px\">"+index+"</div></td>");
			for(var k in d)
				$tr.append("<td><div style=\"width:50px\">"+d[k]+"</div></td>");
			$tr.append("<td><div style=\"width:50px\">"+datas[i].center+"</div></td>");
			j("#"+sel).find("div.table-body table tbody").append($tr);
		}
		h(datas);
		//j("#"+sel).find("div.table-body table tbody").append("<tr><td><div>1</div></td><td><div>北京</div></td><td><div>北京</div></td></tr>");
	}
	// 添加table的hover事件
	function h(datas){
		$(".table-body table tbody tr").hover(function(){
			var index = Number($(this).find("td:first").text() - 1);
			var currdata = datas[index];
			m.openPop(currdata);
			//openPop(currdata,JSON.parse(currdata.centerpoint));
		},function(){
			m.closePop();
			//if(polyInfoLabel) Ly.map.removeLayer(polyInfoLabel);
		});
	}
	/*!
    * 选中table中的某条数据
    */
	 function selectTr(text, flag){
		$(".table-body table tbody tr").each(function(){
			var $td = $(this).find("td:last");
			
			var tdtext =  $td.text();
			if(tdtext == text){
				if(flag){
					$(this).css({
						"background": "rgb(63, 136, 231)",
						"color": "#ffffff"
					});
					var ptop = $td.parent().position().top;
					console.log($td.parent().position().top);
					if(ptop>$("#main_table_content").height()){
						$("#main_table_content").scrollTop(ptop-30);
						$("#main_table_content").perfectScrollbar('update');
					}else if(ptop<0){
						$("#main_table_content").scrollTop(0);
						$("#main_table_content").perfectScrollbar('update');
						$("#main_table_content").scrollTop($td.position().top-60);
						$("#main_table_content").perfectScrollbar('update');
					}
				}else
					$(this).css({"background": "","color": ""});
			}
		 });
	 }
	return T = {
		table: a,
		selectTr:selectTr
	}
});