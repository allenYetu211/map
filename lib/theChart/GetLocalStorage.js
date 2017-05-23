define('getLs', ['jquery', 'local', 'api'], function(jq, l, _API) {
  if (l._Lh !== 'LocalStorage.html') {
    return
  }
  var storage = {}
  var sendRequst = {
    jsonpCALL: function() {
      _API._IP(function(data) {
        storage.IP = data
        console.log('getLocalStorage:', data)
        sendRequst.GetUserSession()
      })
    },
    GetUserSession: function() {
      _API._LG('LoginManage.asmx/GetUserSession', {
        ipAddr: storage.IP
      }, function(data) {
        console.log(data)
        l._Ls('___surveyCode', data.surveyCode)
        l._Ls('___surveyLevel', data.surveyLevel)
        l._Ls('___userName', data.userName)
        l._Ls('___userID', data.userID)
        if (data.url) {
           window.location.href = data.webSiteAddr + data.url
        } else {
          window.location.href = data.webSiteAddr + "mainInface.html"
        }
      })
    }
  }

  sendRequst.jsonpCALL()
})