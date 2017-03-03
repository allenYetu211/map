/*
* 拖拽
*/
define("drag",["jquery"],function(j){
	function b(){
		$(document).mousemove(function(e) {
			if (!!this.move) {
				var posix = !document.move_target ? {'x': 0, 'y': 0} : document.move_target.posix,
					callback = document.call_down || function() {
						$(this.move_target).css({
							'top': e.pageY - posix.y,
							'left': e.pageX - posix.x
						});
					};

				callback.call(this, e, posix);
			}
		}).mouseup(function(e) {
			if (!!this.move) {
				var callback = document.call_up || function(){};
				callback.call(this, e);
				$.extend(this, {
					'move': false,
					'move_target': null,
					'call_down': false,
					'call_up': false
				});
			}
		});
	}
	
	var $box,$boxtitle, box = {
		a:function(callback){
			$box.bind(
				{'mousemove':function(e){
					$(this).css({cursor: "default"});
					var offset = $(this).offset(), resize=true;
					var x = e.clientX, y = e.clientY, t = offset.top, l = offset.left, w = $(this).width(), h = $(this).height(), ww = $('.main_tabletop').height(), b = 10;
					if(x<(l+b) && y > (t+ww) && y < (t+h-b)){
						$(this).css({cursor: "w-resize"});
						$(this).unbind("mousedown").bind({"mousedown":function(e){
							var $p = $(this);
							var posix = {
									'w': $p.width(), 
									'h': $p.height(), 
									'x': e.pageX, 
									'y': e.pageY
								};
							$.extend(document, {'move': true, 'call_down': function(e) {
								var boxcss = {};
								boxcss.width = Math.max(100, posix.x-e.pageX + posix.w);
								boxcss.left = e.pageX;
								r(boxcss, callback);
							}});
						}});
					}else if(x<(l+w) && x>(l+w-b) &&  y > (t+ww) && y < (t+h-b)){
						$(this).css({cursor: "e-resize"});
						$(this).unbind("mousedown").bind({"mousedown":function(e){
							var $p = $(this);
							var posix = {
									'w': $p.width(), 
									'x': e.pageX
								};
							$.extend(document, {'move': true, 'call_down': function(e) {
								var boxcss = {};
								boxcss.width = Math.max(100,e.pageX - posix.x + posix.w);
								boxcss.height = Math.max(100, e.pageY - posix.y + posix.h);
								r(boxcss, callback);
							}});
						}});
					}else if(y<(t+h) && y>(t+h-b) && x>(l+b) && x<(l+w-b)){
						$(this).css({cursor: "s-resize"});
						$(this).unbind("mousedown").bind({"mousedown":function(e){
								var $p = $(this);
								var posix = {
										'h': $p.height(), 
										'y': e.pageY
									};
								$.extend(document, {'move': true, 'call_down': function(e) {
									var boxcss = {};
									boxcss.width = Math.max(100,e.pageX - posix.x + posix.w);
									boxcss.height = Math.max(100, e.pageY - posix.y + posix.h);
									r(boxcss, callback);
								}});
							}
						});
					}else if(x<(l+b) && y>(t+h-b) && y<(t+h)){
						$(this).css({cursor: "sw-resize"});
						$(this).unbind("mousedown").bind({"mousedown":function(e){
							var $p = $(this);
							var posix = {
									'w': $p.width(), 
									'h': $p.height(), 
									'x': e.pageX, 
									'y': e.pageY
								};
							
							$.extend(document, {'move': true, 'call_down': function(e) {
								var boxcss = {};
								boxcss.width = Math.max(100, posix.x-e.pageX + posix.w);
								boxcss.height = Math.max(100, e.pageY - posix.y + posix.h);
								boxcss.left = e.pageX;
								r(boxcss, callback);
							}});
						}});
					}else if(y<(t+h) && y>(t+h-b) && x<(l+w) && x>(l+w-b)){
						$(this).css({cursor: "se-resize"});
						$(this).unbind("mousedown").bind({"mousedown":function(e){
							var $p = $(this);
							var posix = {
								'w': $p.width(), 
								'h': $p.height(), 
								'x': e.pageX, 
								'y': e.pageY
							};
							$.extend(document, {'move': true, 'call_down': function(e) {
								var boxcss = {};
								boxcss.width = Math.max(100, e.pageX - posix.x + posix.w);
								boxcss.height = Math.max(100, e.pageY - posix.y + posix.h);
								r(boxcss, callback);
							}});
						}
						});
					}else if(y<(t+ww) && x>l && x<(l+w)){
						$(this).css({cursor: "move"});
						$(this).unbind("mousedown");
					}
				},
				"mouseup":function(){
					$(this).unbind("mousedown");
				}
			});
		},
		b:function(callback){
			$boxtitle.mousedown(function(e) {
				var $p = $(this).parent();
				var $pp = $p[0];
				var offset = $p.offset();
				$pp.posix = {'x': e.pageX - offset.left, 'y': e.pageY - offset.top};
				$.extend(document, {'move': true, 'move_target':$pp });
				callback($box);
			});
		}
	}
	function r(boxcss, callback){
		$box.css(boxcss);
		callback($box);
	}
	function a(d,callback){
		b();
		$box = j("#"+d);
		$boxtitle = $box.find(".main_tabletop");
		box.a(callback);
		box.b(callback);
	}
	return T = {
		dragBox: a
	}
});