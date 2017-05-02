define('infor_reported', ['jquery', 'map', 'chartInformations', 'translatePopup'], function(jq, map, ch, c) {
  /**
   * 
   * Dom操作
   */

  $('body').on('click', '._j_treeSelect', function() {
    storage.addTre_t = $(this)
    if (storage.isFirst == 1) {
      storage.category = $(this).data('category')
      storage.isFirst = '0'
    } else {
       storage.category = $(this).data('code')
    }
    storage.survey = $(this).data('survey')
    sendReques.GetTableBySurvey()
    sendReques.GetSurveyTree()
  })

  var storage = {
    surveyCode: '',
    isFirst: '1',
    serveryTree: '',
    addTre_t: '',
    survey: '',
    category: '-1'
  }

  ch.su.sendUser(true)

  var serverCode = {
    sendSurvey: function(code) {
      storage.surveyCode = code
      sendReques.GetSurveyTree(code)
    }
  }

  /**
   * 
   * 发送请求
   */
  var sendReques = {
    GetSurveyTree: function(_ys) {
      ch.api.getDevelopment('GetSurveyTree', {
        surveyCode: storage.surveyCode,
        categoryID: storage.category,
        isFirst: storage.isFirst,
      }, function(data) {
        storage.serveryTree = data
        if (storage.isFirst == '1') {
          renderingDOM.serveryTree()
        } else {
          renderingDOM.serveryTree2()
        }
      })
    },

    GetTableBySurvey: function() {
      ch.api.getDevelopment('GetTableBySurvey', {
        surveyID: storage.survey,
        categoryID: storage.category
      }, function(data) {
        console.log(data)
      })
    }
  }


  /**
   * 
   * 页面渲染renderingDOM
   * 
   */

  var renderingDOM = {
    cycle: function(_tree) {
      var ct = '<ul>'
      console.log(_tree)
      _tree.forEach(function(_val) {
        ct += '<li><div class="_j_treeSelect"  data-category="' + _val.FK_CATEGORY + '" data-code="' + _val.F_CODE + '"  data-survey="' + _val.FK_SURVEY + '">' + _val['F_CAPTION'] + '</div></li>'
        for (var _k in _val) {}
      })
      ct += '</ul>'
      return ct
    },

    serveryTree: function() {
      var _tree = storage.serveryTree.surveyTree
      var _container = this.cycle(_tree)
      $('._j_inforReported').append(_container)
    },

    serveryTree2: function() {
      var _tree = storage.serveryTree.surveyTree
      var _container = this.cycle(_tree)
      storage.addTre_t.parent().append(_container)
    },

    addSurveyTree: function(_t) {

    }
  }

  return {
    S: serverCode.sendSurvey
  }

})