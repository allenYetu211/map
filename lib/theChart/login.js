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
    webSiteAddr: null,
    IP: null
  }

  var sendRequst = {
    jsonpCALL: function() {
      _API._IP(function(data) {
        console.log(data)
        storage.IP = data
      })
    },
    login: function() {

      _API._LG('LoginManage.asmx/UserLogin', {
        userName: storage.user,
        userPwd: storage.pas,
        webSiteAddr: storage.webSiteAddr,
        ipAddr: storage.IP
      }, function(data) {
        console.log(data)
        if (data.errcode === 4) {
          $('.loginErrorMsg').html(data.msg)
        } else {
          // 本地
          window.location.href = 'file:///Users/allen/Documents/Git/themeMap_3/LocalStorage.html'

          //在线
          // window.location.href = storage.webSiteAddr + 'LocalStorage.html'
        }
      })
    },
    GetLoginPlat: function() {
      _API._LG('LoginManage.asmx/GetLoginPlat', {}, function(data) {
        storage.options = data
        console.log(data)
        rading.options()
      })
    }
  }

  var rading = {
    options: function() {
      var ct = ''
      storage.options.loginPlat.forEach(function(_val, _in) {
        if (_in === 0) {
          storage.webSiteAddr = _val.webSiteAddr
        }
        ct += '<option data-id="' + _val.id + '">' + _val.name + '</option>'
      })
      $('.loginPlat select').append(ct)
    }
  }

  $('.loginPlat select').on('change', function() {
    var _index = $(this).find('option:selected').index()
    storage.webSiteAddr = storage.options.loginPlat[_index].webSiteAddr
  })

  $('._pass input').on('focus', function() {
    $('.loginErrorMsg').html('')
  })

  //   if (l._Lhs.includes('index.html') || l.host() == '') {
  var logopageInit = (function() {
      // if (l._Lh == 'index.html' || l._Lh == '') {
        sendRequst.jsonpCALL()
        sendRequst.GetLoginPlat()
      // }
    })()
})