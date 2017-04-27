define('translatePopup', ['jquery'], function(j) {
    /**
     * @param  tp --> 移动目标 jq对象
     * */
    j.fn._translate_ = function(tp) {
        var self = $(this)

        self.on('mousedown', function(e) {
            // console.log(e.clientX)
            var offset = self.offset(); //DIV在页面的位置 
            var x = e.pageX - offset.left; //获得鼠标指针离DIV元素左边界的距离 
            var y = e.pageY - offset.top;
            // tp.css('transform', 'translate(0, 0)')
            // tp.css({ left: "0px", top: "0px" });

            $(document).on('mouseover', function(_e) {
                // self.stop(); //加上这个之后 
                var _x = _e.pageX - x; //获得X轴方向移动的值 
                var _y = _e.pageY - y; //获得Y轴方向移动的值 
                // tp.animation({
                //     left: _x + "px",
                //     top: _y + "px",
                //     translate: 'transform(0,0)'
                // }, 10);
                tp.css({ 'transform': 'translate3d(' + _x + 'px, ' + _y + 'px,0)', left: "0px", top: "0px" });

                $(document).on('mouseup', function() {
                    $(this).off('mouseover');
                });
            })

        })
    }

    /**
     * @param 
     */

    function Cookie() {}
    Cookie.prototype._setCookie = function() {
        var Days = 30
        var exp = new Date()
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
        document.cookie = name + '=' + escape(val)
    }

    Cookie.prototype._getCooke = function() {
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        if (document.cookie.match(reg)) {
            return unescape(document.cookie.match(reg)[2])
        }
    }

    return _C = {
        _cookie: Cookie
    }

})