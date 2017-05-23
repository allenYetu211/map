define('api', ['jquery'], function(jq) {
  var api = {
    getcallIP: function(fn) {
      $.ajax({
        type: "GET",
        async: false,
        dataType: 'jsonp',
        jsonp: 'jsonpCallback',
        jsonpCallback: "jsonpCallback",
        url: "http://122.224.94.108:8002/LoginService/LoginManage.asmx/GetIPAddr",
        success: function(data) {
          //dosomthing
          fn(data)
        }
      });
    },
    getLoginManage: function(address, theInput, fn) {
       $.ajax({
        type: 'POST',
        // 服务端跨域
        // url: "/thememap/LoginService/" + address,
        // 本地跨域
        url: "http://122.224.94.108:8002/LoginService/" + address,
        data: theInput,
        contentType: "application/x-www-form-urlencoded",
        success: function(data) {
          var translateData = JSON.parse(data)
          fn(translateData)
        },
        erroer: function(error) {
          console.log('error:', error)
        }
      }) 
    },
    getmainData: function(address, theInput, fn) {
      $.ajax({
        type: 'POST',
        // 服务端跨域
        // url: "/thememap/THService/" + address,
        // 本地跨域
        url: "http://122.224.94.108:8002/THService/" + address,
        data: theInput,
        contentType: "application/x-www-form-urlencoded",
        success: function(data) {
          var translateData = JSON.parse(data)
          fn(translateData)
        },
        erroer: function(error) {
          console.log('error:', error)
        }
      })
    },
    postFormData: function(address, thInput_, fn) {
      $.ajax({
        type: 'POST',
        // 服务端跨域
        // url: "/thememap/THService/" + address,
        // 本地跨域
        cache: false,
        url: "http://122.224.94.108:8002/THService/" + address,
        data: thInput_,
        contentType: 'multipart/form-data',
        mimeType: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function(data) {
          var translateData = JSON.parse(data)
          fn(translateData)
        },

        erroer: function(error) {
          console.log('error:', error)
        }
      })
    }
  }

  return {
    _G: api.getmainData,
    _S: api.postFormData,
    _IP: api.getcallIP,
    _LG: api.getLoginManage
  }
})