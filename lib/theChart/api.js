define('api', ['jquery'], function(jq) {
    var api = {
        getmainData: function(address, theInput, fn) {
            $.ajax({
                type: 'POST',
                // 服务端跨域
                // url: "/thememap/THService/MainManage.asmx/" + address,
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
                // url: "/thememap/THService/ReportManage.asmx/" + address,
                // 本地跨域
                cache: false,
                url: "http://122.224.94.108:8002/THService/ReportManage.asmx/" + address,
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
        _S: api.postFormData
    }
})