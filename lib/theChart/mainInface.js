define('mainInface', ['jquery', 'local', 'api'], function(jq, l, _API) {
    if (l._Lh !== 'mainInface.html') {
        return
    }

    /**
     * 仓库
     */


    var storage = {
        userID: l._Lg('___userID'),
        funData: '',
        functionID: ''
    }

    var sendRequst = {
        GetFunction: function() {
            _API._G('MainManage.asmx/GetFunction', {
                userID: storage.userID
            }, function(data) {
                storage.funData = data
                redering.reportStstem()
            })
        },

        GetSubFunction: function() {
            _API._G('MainManage.asmx/GetSubFunction', {
                userID: storage.userID,
                functionID: storage.functionID
            }, function(data) {
                storage.subData = data
                redering.subFunc()
            })
        }
    }

    /**
     * redering
     */

    var redering = {
        reportStstem: function() {
            var mc = ''
            var ct = ''
            var flag = true
            storage.funData.function.reportFunc.forEach(function(_val) {
                var isClicked = ''
                var _active = ''
                if (!_val.isClicked) {
                    isClicked = 'disabled'
                }
                if (flag) {
                    storage.functionID = _val.id
                    _active = 'active'
                    flag = false
                }
                mc += '<button class="centent-intarce ' + isClicked + _active + '" data-id="' + _val.id + '" type="button">' + _val.name + '</button>'
            })

            var ct =
                this.modeulFun(storage.funData.function.systemFunc, 'grid-viewPage ')
            $('._contentInfor .max-container').append(mc)
            $('._footer-display').append(ct)
            sendRequst.GetSubFunction()
        },

        subFunc: function() {
            var ct =
                this.modeulFun(storage.subData.function, 'grid-introduce ')
            $('._main_display').html('').append(ct)
        },
        modeulFun: function(_items, _cls) {
            var ct = ''
            _items.forEach(function(_val, _in) {
                var isClicked = ''
                if (!_val.isClicked) {
                    isClicked = 'disabled'
                }
                ct += '<div class=" ' + _cls + isClicked + '">' +
                    '                        <a href="' + _val.url + '">' +
                    '                            <div class="_icon">' +
                    '                                   <p> ' + (_in + 1) + '</p>' +
                    // '                                <img src="data:image/png;base64,' + _val.icon + '" alt="">' +
                    '                            </div>' +
                    '                            <p>' + _val.name + '</p>' +
                    '                        </a>' +
                    '                    </div>'
            })
            return ct
        }
    }

    /**
     *Dom 操作
     */
    $('body').on('click', '.centent-intarce', function() {
        $('.centent-intarce').removeClass('active')
        $(this).addClass('active')
        $('.mainInface-title').html($(this).html())
        storage.functionID = $(this).data('id')
        sendRequst.GetSubFunction()
    })

    $('.localSelecte').on('click', function() {
        var _val = $('#loca-selecte').val().trim()
        if (_val == '') {
            $('#loca-selecte').css('border', '1px solid red')
            return
        }
        l._Ls('___selecte', _val)
        window.location.href = "Data_Display.html"
    })

    $('#loca-selecte').on('focus', function() {
            $(this).removeAttr('style')
        })
        /**
         * 初始化文件
         */
    $('._mainUserName').html(l._Lg('___userName'))
    sendRequst.GetFunction()

})