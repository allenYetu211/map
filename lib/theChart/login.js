define('login', ['jquery', 'local', 'api'], function(jq, l, _API) {
    if (l._Lh !== 'index.html') {
        return
    }
    var storage = {
        user: '',
        pas: ''
    }
    $('._loginSendBut button').on('click', function() {
        storage.user = $('._user input').val()
        storage.pas = md5($('._pass input').val())
        sendRequst.login()
    })

    var sendRequst = {
        login: function() {

            _API._G('MainManage.asmx/UserLogin', {
                userName: storage.user,
                userPwd: storage.pas
            }, function(data) {
                console.log(data)
                l._Ls('___surveyCode', data.surveyInfo.surveyCode)
                l._Ls('___surveyLevel', data.surveyInfo.surveyLevel)
                l._Ls('___userName', data.userName)
                l._Ls('___userID', data.userID)
                window.location.href = "mainInface.html"
            })
        }
    }
})