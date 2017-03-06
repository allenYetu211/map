/*
* 用户服务调度类
*/
define("somoselect",["jquery"],function(j){
	function a(selecter,data){
		
		j("#"+selecter).append(b(data));
	}
	function b(data){
		var $condition = j("<div class=\"condition\"></div>"),
			$data_main = j("<div class=\"data_main\"></div>"),
		    $mainrt = j("<div class=\data_mainrt select_subject\"></div>"),
			$SumoSelect = j("<div class=\"SumoSelect\" tabindex=\"0\"></div>"),
			$sel = j("<select class=\"SlectBox SumoUnder\" tabindex=\"-1\"></select>"),
			$opt = j("<div class=\"optWrapper\"></div>"),
			$ul = j("<ul></ul>");
		for(var i in data.datas){
			var d = data.datas[i];
			$sel.append("<option value="+d.value+">"+d.text+"</option>");
			if(i==0)
			    $ul.append("<li class=\"opt selected\"><label title="+d.value+">"+d.text+"</label></li>");
			else 
				$ul.append("<li class=\"opt\"><label title="+d.value+">"+d.text+"</label></li>");
		}
		
		$seloption = j("<p class=\"CaptionCont SelectBox\"><span title="+data.datas[0].text+"> "+data.datas[0].text+"</span><label><i></i></label></p>");
		
		
		$opt.append($ul);
		$SumoSelect.append($sel);
		$SumoSelect.append($seloption);
		$SumoSelect.append($opt);
		$mainrt.append($SumoSelect);
		$data_main.append("<div class=\"data_mainle\">"+data.title+":</div>");
		$data_main.append($mainrt);
		$condition.append($data_main);
		
		$seloption.bind('click',function(){
			if($opt.is(":hidden"))
				$opt.show();
			else
				$opt.hide();
		});
		f($ul);
		return $condition;
	}
	function c(selecter){
		return $("#"+selecter).find("div.condition div.data_main div.data_mainrt div.SumoSelect p span").text();
	}
	function d(selecter){
		return $("#"+selecter).find("div.condition div.data_main div.data_mainrt div.SumoSelect p span").attr("title");
	}
	function e(selecter,datas){
		var _ul = $("#"+selecter).find("div.condition div.data_main div.data_mainrt div.SumoSelect div.optWrapper ul");
		for(var i in datas){
			var d = datas[i];
			_ul.append("<li class=\"opt\"><label title="+d.value+">"+d.text+"</label></li>");
		}
		f(_ul);
	}
	function f(_ul){
		_ul.find("li").unbind('click').bind('click',function(){
			_ul.parent().parent().find("p span").attr("title",j(this).find("label").attr('title'));
			_ul.parent().parent().find("p span").text(j(this).find("label").text());
			_ul.parent().hide();
		});
	}
	return T = {
		selecter: a,
		getVal: c,
		getText:d,
		addOption:e
	}
});