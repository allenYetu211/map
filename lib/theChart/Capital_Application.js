/**
 * Created by donggua on 2017/6/7
 */
define('Capital_Application', ['jquery','local', 'api'], function(jq, l, _API) {
    if (l._Lh !== 'Capital_Application.html') {
        return
    }

    /**
     *  数据存储仓库
     * */

    var storage = {
        userID:l._Lg('___userID')
    }

    console.log(storage.userID)

    /**
     *  ajax 开始
     * */
    var sendRequest = {
        // 1.11.1 获取分类目录接口
        GetAppliAppro: function() {
            _API._G('AppManage.asmx/GetAppliAppro', '', function(data){
                console.log(data)
            })
        }
    }
    /**
     *  ajax 结束
     * */
    sendRequest.GetAppliAppro(storage.userID);


    /**
     * 渲染开始
     * */


    /**
     * 渲染结束
     * */

    /**
     * DOM操作
     * */

})