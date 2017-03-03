define("lefttool",
["jquery"],
function(f){
    function b(){
        f(".left-tool").on("click",d);
		f(".classify-list").on("click",a);
		f("#menu_display").on("mouseover", function(){
            f(".float-tool-title").css({
                left: 285,
                top: 65
            }).find(".title").html("菜单");
			f(".float-tool-title div").last().removeClass("right-arrow").addClass("up-arrow");
			f(".float-tool-title").show()
        }).on("mouseout",function(){
            f(".float-tool-title").hide()
        });
		f(".add_service").click(function(g){
            require([
                "userservice"
            ],
            function(h){
                h.serviceDialog()
            })
        });
		f(".add_service").mouseover(function(){
            f(".add_service .add_icon").css("background-position", "-82px -5px");
        }).mouseout(function(){
            f(".add_service .add_icon").css("background-position", "-100px -5px");
        })
    }
	function d(h){
        var g = h.target;
		var k = document.getElementById("menu_display"); 
		var j = f(".classify-list");
		var i = f(".down-up").get(0);
		if(g == k){
            e();
        }else{
            if( i == g || f.contains(i,g)){
                c();
            }
        }
    }
	function e(){
        if(f("li[id^=subject_]").length==0){
            require([
                "tree"
            ],
            function(h){
                f(".classify-content").show();
				h.loadTreeModule();
				g.loadUserLayers();
            })
        }
		c();
    }
	function a(){
        var g = f(this);
		g.siblings().removeClass("active").children('div[class*="Nav"]').removeClass("active");
		g.addClass("active").children('div[class*="Nav"]').addClass("active");
		if(g.hasClass("special")){
            f(".classify-content").show();
			f(".search-content").hide();
        }else{
            if(g.hasClass("place")){
                f(".classify-content").hide();
				f(".search-content").show();
				if(!f(".search-content").hasClass("searched")){
                    require([
                        "menutree"
                    ],
                    function(mt){
                        mt.initTree("tileTree");
                    })
                }
            }
        }
    }
	function c(){
        f("#app .layer-custom").remove();
		f(".left-down").slideToggle();
    }
	return{
        initEvent: b
    }
});