define("mapIntroduce", ['map', "jquery", "userservice", "chartInformations"], function(m, j, us, ch) {
    console.log(j)
        /**
         * 左右图标详情信息 Dom 操作 
         **/
    $('body').on('click', 'button.introduceButton', function() {
        stroage.de_indiatorID = $(this).data('id')
        sendRequest.GetShowDetails()
    })

    $('body').on('click', '._theme', function() {
        console.log($(this).data('id'))
        stroage.theme_indiatorID = $(this).data('id')
        sendRequest.GetThemeAnalysis()
    })



    /**
     * 仓库
     **/

    var stroage = {
        de_indiatorID: '',
        introduceDATA: '',
        theme_indiatorID: ''
    }


    /**
     *  请求
     **/

    var sendRequest = {
        GetShowDetails: function() {
            ch.api.getData('GetShowDetails', {
                indiatorID: stroage.de_indiatorID
            }, function(data) {
                stroage.introduceDATA = data.showDetails
                $('#controlPanel').show()
                embellish.introduce()
            })
        },

        GetThemeAnalysis: function() {
            console.log(ch)
            ch.api.getData('GetThemeAnalysis', {
                themeID: stroage.theme_indiatorID,
                surveyCode: ch.cl.surveyCode,
                isNextLevel: '0'
            }, function(data) {
                console.log(data)
            })
        }
    }


    /**
     *  渲染详情介绍页面数据
     * **/

    var embellish = {

        introduce: function() {
            var themeAnalysis = ''
            for (var key in stroage.introduceDATA) {

                if (typeof stroage.introduceDATA[key] === 'object' && key !== 'reportShow') {
                    stroage.introduceDATA[key].forEach(function(_val) {
                        themeAnalysis = '<li class="_theme" data-id=" ' + _val.id + '">' + _val.name + '</li>'
                        $('.' + key).append(themeAnalysis)

                    })
                } else if (typeof stroage.introduceDATA[key] === 'object' && key === 'reportShow') {
                    var flag = true
                    stroage.introduceDATA[key].forEach(function(_val) {
                        if (_val.pid === -1) {
                            themeAnalysis = '<li class="base' + _val.id + '">' + _val.name + '</li>'
                            $('.' + key).append(themeAnalysis)
                        }
                    })
                    stroage.introduceDATA[key].forEach(function(_val) {
                        if (flag) {
                            $('.base' + _val.pid).append('<ul></ul>')
                            flag = false
                        }
                        if ($('.base' + _val.pid)) {

                            $('.base' + _val.pid).find('ul').append('<li>' + _val.name + '</li>')
                        }
                    })
                } else {
                    $('.' + key).attr('data-id', stroage.introduceDATA[key])
                }

            }
        }

    }
})