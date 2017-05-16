define('login', ['jquery', 'local', 'api'], function(jq, l, _API) {
  // if (l._Lh !== 'index.html') {
  //     return
  // }
  var storage = {
    user: '',
    pas: ''
  }
  $('._loginSendBut button').on('click', function() {
    storage.user = $('._user input').val()
    storage.pas = md5($('._pass input').val())
    sendRequst.login()
  })

  var storage = {
    options: null,
    user: null,
    pas: null,
    dbCon: null
  }

  var sendRequst = {
    login: function() {

      _API._G('MainManage.asmx/UserLogin', {
        userName: storage.user,
        userPwd: storage.pas,
        dbCon: storage.dbCon,
      }, function(data) {
        l._Ls('___surveyCode', data.surveyInfo.surveyCode)
        l._Ls('___surveyLevel', data.surveyInfo.surveyLevel)
        l._Ls('___userName', data.userName)
        l._Ls('___userID', data.userID)
        if (data.url) {
          window.location.href = data.url
        } else {
          window.location.href = "mainInface.html"
        }
      })
    },
    GetLoginPlat: function() {
      _API._G('MainManage.asmx/GetLoginPlat', {}, function(data) {
        storage.options = data
        rading.options()
      })
    }
  }

  var rading = {
    options: function() {
      var ct = ''
      storage.options.loginPlat.forEach(function(_val, _in) {
        if (_in === 0) {
            storage.dbCon = _val.dbCon
        }
        ct += '<option data-id="' + _val.id + '">' + _val.name + '</option>'
      })
      $('.loginPlat select').append(ct)
    }
  }

  $('.loginPlat select').on('change', function() {
    var _index = $(this).find('option:selected').index()
    storage.dbCon = storage.options.loginPlat[_index].dbCon
  })

//   if (l._Lhs.includes('index.html') || l.host() == '') {
    var logopageInit = (function() {
      sendRequst.GetLoginPlat()
    })()
//   }

})