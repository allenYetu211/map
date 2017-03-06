define("floattool",
["jquery"],
function(e){
    var b=true;
	function d(){
        e(".floattool .layer_nav div.icon").on("click",function(){
			e(".layer_nav .layer-pop").toggle()
		}).on("mouseover",function(){
			var g = e(".floattool").offset().left-57;
			var f = e(".floattool").offset().top;e(".float-tool-title").css({
				left: g,
				top: f+6
			}).find(".title").html("底图");
			e(".float-tool-title div").last().removeClass("up-arrow").addClass("right-arrow");
			e(".float-tool-title").show();
		});
		e(".floattool div.layer_nav div.common-panel a.close").click(function(){e(".layer_nav .layer-pop").toggle();});
		e("#vec_type").click(function(){
			require([
                "map"
            ],
            function(l){
               l.Ly.s();
            })
		});
		e("#img_type").click(function(){
			require([
                "map"
            ],
            function(l){
               l.Ly.y();
            })
		});
		e(".layer-items a").bind("click",function(){
			e(".layer-items a").each(function(){
				e(this).removeClass("active");
			});
			e(this).addClass("active");
		});
		e(".floattool .table_nav").on("click",function(){
				if(e(".main_table").css("display")=="block"){
					c(".floattool .table_nav",
					".main_table",
					-e(this).height()/2,
					e(this).width()/2)
				}else{
					a("当前专题没有查到统计数据")
				}
			}).on("mouseover",function(){
				var g = e(".floattool").offset().left-57;
				var f = e(".floattool").offset().top;
				e(".float-tool-title").css({
					left: g,
					top: f+45
				}).find(".title").html("统计表");
				e(".float-tool-title div").last().removeClass("up-arrow").addClass("right-arrow");
				e(".float-tool-title").show();
			});
		e(".floattool .graphic_nav").on("click",function(){
				if(e(".main_graphic").css("display")=="block"){
					c(".floattool .graphic_nav",
					".main_graphic",
					e(this).height()/2,
					e(this).width()/2)
				}else{
					a("当前专题没有查到统计图数据")
				}
			}).on("mouseover",function(){
				var g = e(".floattool").offset().left-57;
				var f = e(".floattool").offset().top;
				e(".float-tool-title").css({
					left: g,
					top: f+85
				}).find(".title").html("统计图");
				e(".float-tool-title div").last().removeClass("up-arrow").addClass("right-arrow");
				e(".float-tool-title").show();
			});
		e(".floattool .time_nav").on("click",function(){
				if(e(".time-axis").css("display")=="block"){
					c(".floattool .time_nav",
					".time-axis",
					3*e(this).height()/2,
					e(this).width()/2)
				}else{
					a("当前专题没有查到时间数据")
				}
			}).on("mouseover",function(){
				var g = e(".floattool").offset().left-57;
				var f = e(".floattool").offset().top;
				e(".float-tool-title").css({
					left: g,
					top: f+126
				}).find(".title").html("时间轴");
				e(".float-tool-title div").last().removeClass("up-arrow").addClass("right-arrow");
				e(".float-tool-title").show()
			});
		e(".floattool>div").on("mouseout", function(){
            e(".float-tool-title").hide()
        })
    }
	function a(g){
        e(".noDataTips").remove();e(".dlbtips").remove();if(e("li.ischecked").length==0){
            g="请选择专题数据"
        }
		var f = '<divclass="noDataTips"><divclass="tabtop_left">'+g+'</div><divclass="tabtop_rt"></div></div>';
		e("#app").append(f);
		e(".noDataTips .tabtop_rt").on("click",function(){
            e(".noDataTips").remove()
        })
    }
	function c(j,f,i,n){
        if(!b){
            return
        }else{
            b=false
        }
		var o = e(f);
		var r = o.width();
		var l = o.height();
		var k = o.css("left");
		var p = o.css("top");
		var q;
		var m = (document.body.clientWidth||document.body.clientWidth)-parseInt(e(".floattool").css("right"))-n;
		var g = parseInt(e(".floattool").css("top"))+i;if(r==0){
            q = e(j)[0].state;
			if(e(window).height()>900){
                q.height=380
            }else{
                q.height=250
            }if(f==".time-axis"){
                q.height="67"
            }
        }else{
            e(j)[0].state={
                width: r,
                height: l,
                left: k,
                top: p
            };
			q={
                width: 0,
                height: 0,
                overflow: "hidden"
            };
			q.left = m;
			q.top = g
        }o.animate(q,500, function(){
            if(f==".main_graphic"&&e(".main_graphic").width()!=0){
                e(".main_graphic .active").trigger("click");
				e("span[id*=_graphic").show();
				e(this).css({
                    overflow: ""
                })
            }if(f==".main_graphic"&&e(".main_graphic").width()==0){
                //e("#static_chart").html("");
				e("span[id*=_graphic").hide();
				e(this).css({
                    overflow: "hidden"
                })
            }
			b=true
        })
    }return{
        loadFloatTool: d
    }
});