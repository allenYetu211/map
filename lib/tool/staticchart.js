/*
* 用户服务调度类
*/
define("staticchart",["echarts","jquery"],function(ec,j){
	function a(option, seloptions){
		j("#main_char").show();
		var chartWidth = j("#main_char").width();
		if(chartWidth < 1){
			j(".floattool .graphic_nav").trigger('click');
		}
		j("#main_char_sel").bind('click',function(){
			j("#main_char_sel_con").toggle();
		});
		//var seloptions = [{text:'e',value:'e'},{text:'s',value:'S'}];
		addSelOptions(seloptions);
        var myChart = ec.init(document.getElementById('static_chart'));
		myChart.setOption(option);            
	}
	function addSelOptions(options){
		j("#main_char_sel_con ul").empty();
		for(var i in options){
			var o = options[i];
			var text = o.info;
			var c = "<li class=\"opt\"><span><i></i></span><label title="+text+">"+text+"</label></li>";
			j("#main_char_sel_con ul").append(c);
		}
		bindClick();
		if(options.length>0){
			var text = options[0].info;
			j("#main_char_sel span").attr('title',text);
			j("#main_char_sel span").text(text);
		}
		j("#main_char_sel_con ul li:eq(0)").addClass("selected");
	}
	function bindClick(){
		j("#main_char_sel_con ul li").unbind('click').bind('click',function(){
			
			j("#main_char_sel_con ul li[class$=selected]").removeClass('selected');
			j(this).addClass('selected');
			j("#main_char_sel_con").hide();
			j("#main_char_sel span").attr('title',j(this).text());
			j("#main_char_sel span").text(j(this).text());
		});
	}
	return T = {
		chart: a
	}
});