define('infor_reported', ['jquery', 'map', 'chartInformations', 'translatePopup', 'local', 'api'], function(jq, map, ch, c, l, _API) {
  if (l._Lh !== 'Data_Collection.html') {
    return
  }
  /**
   * 
   * Dom操作
   */
  // ch.st(function(data) {
  //     console.log('data', data)
  //     storage._term = data
  //     renderingDOM.createTerm()
  // })

  $('body').on('click', '._j_treeSelect', function(e) {
    // if ($(this).hasClass('active')) {
    e.preventDefault()
    // if ($(this).parent().find('._j_treeSelect').hasClass('active')) {
    //   if ($(this).next().length !== 0) {
    //     $(this).nextAll().hide().end().removeClass('active')
    //     return
    //   }
    // }
    // }
    $('._j_treeSelect').removeClass('active');
    $(this).addClass('active')
    $('.reportedInit').hide()
    if (storage.isFirst == 1) {
      storage.category = $(this).data('category')
      storage.isFirst = '0'
    } else {
      storage.category = $(this).data('category')
    }



    $(this).parents('._parmis').slideUp()
    $(this).parents('._parmis').prev('._j_prents').find('span').html($(this).html())
    storage.addTre_t = $(this).parents('._parentsTree')
    storage.surveyid = $(this).data('survey')
    storage.survey = $(this).data('code')
    storage._fCode = $(this).data('code')
    if ($(this).data('code') == storage.__reserverTerr) {
      return
    } else {
      storage.__reserverTerr = $(this).data('code')
    }
    sendReques.GetTableBySurvey()
    sendReques.GetSurveyTree()
  })

  $('body').on('click', '._j_prents', function() {
    $(this).find('span').html('请选择')
    $(this).next().slideDown().nextAll().remove()
  })

  $('body').on('click', '._moreInforTabel', function() {
    $('._moreInforTabel').removeClass('active')
    $(this).addClass('active')
    storage.__repotID = $(this).data('reportid')
    $('#reporteIframe')[0].contentWindow.ins_sheetPanel(storage.__repotID, '15', false)
    setTimeout(function() {
      $('#reporteIframe')[0].contentWindow.ins_loadvalue(storage.__repotID, storage.termCount, storage._fCode)
    }, 2000)

  })

  $('body').on('change', '._termCounts', function() {
    storage.termCount = $(this).find('option:selected').data('term')
  })
  $('body').on('click', '._potoshop', function() {
    $('._potoshopView').toggleClass('open')
    sendReques.GetPicture()
  })

  $('body').on('click', '.silder_nav li', function() {
    $('.silder_nav li').removeClass('active')
    $(this).addClass('active')
    var _in = $(this).index()
    $('.silder_con li').removeClass('active')
    $('.silder_con li').eq(_in).addClass('active')
  })


  $('.closeAcPopup').on('click', function() {
    $('.accessory-popup').hide()
  })

  $('.examineAccessory').on('click', function() {
    sendReques.AnnexExamine()
  })

  $('#AnnexUp').on('change', function() {
    if ($(this).val() !== '' || $(this).val() !== null) {
      sendReques.AnnexUp()
    }
  })

  $('.deleteAccessory').on('click', function() {
    sendReques.AnnexDel()
  })
  $('.examineAccessory-closer').on('click', function() {
    $('.examineAccessoryPopup').hide()
  })

  $('.treeSelect').on('click', function() {
    // $('#reporteIframe')[0].contentWindow.print()
    var text = $('#_selecteTree').val().trim()
    if (text === '') {
      return
    }
    sendReques.SurveySearch(text)
  })

  var storage = {
    surveyCode: '',
    isFirst: '1',
    surveyTree: '',
    addTre_t: '',
    survey: l._Lg('___surveyCode'),
    category: '-1',
    tableBySurvey: '',
    surveyid: '',
    _initIframe: true,
    _fCode: '',
    _flagIfram: true,
    _term: '',
    __reportid: '',
    potoShop: '',
    __repotID: '',
    __reserverTerr: '',
    __filterID: ''
  }

  var iframeCmita = {
    _selectedRange: function(location) {
      storage.cellValLocation = location
      sendReques.IsAnnexType(location)
    }
  }

  // ch.su.sendUser(true)

  var serverCode = {
    sendSurvey: function(code) {
      storage.survey = code
      sendReques.GetSurveyTree(code)
    }
  }



  /**
   * 
   * 发送请求
   */
  var sendReques = {
    // 上传附件
    AnnexUp: function() {
      var files = $('#AnnexUp').prop('files')
      var fromInfor = new FormData()
      fromInfor.append('fileContent', $('#AnnexUp')[0].files[0])
      $('.accessory-popup').hide()
      $('.al-popup-prompt').show()
      $('.Progressbar').show()
      var random = 0
      $('.al-prompt-informations').html('正在上传..')
      var UPloadbar = setInterval(function() {
        random += Math.random() * 10
        if (random > 70) {
          clearInterval(UPloadbar)
        }
        $('.Progressbar').css('width', random + '%')
      }, 500)

      _API._S('CollectionManage.asmx/AnnexUp', fromInfor, function(data) {
        if (data.success) {
          clearInterval(UPloadbar)
          $('.Progressbar').hide()
          $('.Progressbar').css('width', 0)
            // storage.absolutURL = data.annexPath

          $('.al-prompt-informations').html('上传成功')
          $('#reporteIframe')[0].contentWindow.ins_setCellValue(storage.cellValLocation.row, storage.cellValLocation.col, data.annexPath)
        }
      })
    },
    // 删除附件
    AnnexDel: function() {
      _API._G('CollectionManage.asmx/AnnexDel', {
        annexPath: storage.cellValLocation.value,
      }, function(data) {
        $('.al-popup-prompt').show()
        if (data.success) {
          $('.accessory-popup').hide()
          $('.al-prompt-informations').html('删除成功')
          $('#reporteIframe')[0].contentWindow.ins_setCellValue(storage.cellValLocation.row, storage.cellValLocation.col, '')
        } else {
          $('.al-prompt-informations').html(data.msg)
        }
      })
    },
    // 查看附件
    AnnexExamine: function() {
      _API._G('CollectionManage.asmx/AnnexExamine', {
        annexPath: storage.cellValLocation.value,
      }, function(data) {
        if (/.pdf$/.test(data.path)) {
          window.open(data.path)
        } else {
          $('.accessory-popup').hide()
          $('.examineAccessoryPopup').show().find('.accessoryPic').attr('src', data.path)
        }
      })
    },
    // 获取单元格类型
    IsAnnexType: function(location) {
      _API._G('CollectionManage.asmx/IsAnnexType', {
        reportID: storage.__repotID,
        cellPosition: location.minLetter
      }, function(data) {
        storage.isAnnex = data
        if (data.isAnnex) {
          if (!location.value) {
            $('.examineAccessory, .downloadAccessory').hide()
          } else {
            $('.examineAccessory, .downloadAccessory').show()
          }
          $('.accessory-popup').show()
        }
      })
    },
    GetSurveyTree: function(_ys) {
      _API._G('CollectionManage.asmx/GetSurveyTree', {
        surveyCode: storage.survey,
        categoryID: storage.category,
        isFirst: storage.isFirst,
        functionID: storage.__filterID
      }, function(data) {
          if(data.success){
      		$('.loading').hide()
      	}
        storage.surveyTree = data
        console.log('storage.surveyTree :', storage.surveyTree )
        if (storage.isFirst == '1') {
          renderingDOM.serveryTree()
        } else {
          renderingDOM.serveryTree2()
        }
      })
    },

    GetTableBySurvey: function() {
      _API._G('CollectionManage.asmx/GetTableBySurvey', {
        surveyID: storage.surveyid,
        categoryID: storage.category,
        functionID: storage.__filterID
      }, function(data) {
        if (data.surveyTable, length == 0) {
          $('#sheet-markup').hide()
          return
        }
        $('#sheet-markup').show()
        console.log('data:', data)
        storage.tableBySurvey = data
        renderingDOM.addSurveyTree()
      })
    },
    GetTerm: function() {
      _API._G('DataShow.asmx/GetTerm', {}, function(data) {
        storage._term = data
        renderingDOM.createTerm()
      })
    },

    GetPicture: function() {
      _API._G('CollectionManage.asmx/GetPicture', {
        surveyCode: storage.survey,
        reportID: storage.__repotID,
        termID: storage.termCount
      }, function(data) {
        console.log(data)
        storage.potoShop = data
        renderingDOM.potoShop()
      })
    },
    SurveySearch: function(text) {
      _API._G('CollectionManage.asmx/SurveySearch', {
        content: text,
      }, function(data) {
        console.log('SurveySearch:', data)
        storage.surveyTree = data
        renderingDOM.serveryTree3()
      })
    },
  }
$('#_selecteTree').on('keyup', function (e){
  console.log(e.keyCode)
  if (e.keyCode === 13) {
    var text = $(this).val().trim()
    sendReques.SurveySearch(text)
  } else if (e.keyCode === 8 && $(this).val().trim() == '') {
    storage.isFirst = 1
    storage.category = -1
    sendReques.GetSurveyTree()
  }
})

$('.closerSelecte').on('click', function () {
    storage.isFirst = 1
    storage.category = -1
    sendReques.GetSurveyTree()
    $('#_selecteTree').val('')
})

  $('._rotate').on('click', function() {
      var target = $('.examin-pictrue').find('img')
      var _rotate = target.data('rotate')
      if (_rotate == undefined) {
        target.data('rotate', '1')
        target.css('transform', 'rotate(90deg)')
      } else {
        var _a = Number(_rotate)
        _a += 1
        var _r = _a * 90
        target.css('transform', 'rotate(' + _r + 'deg)')
        target.data('rotate', _a)
      }
    })

  /**
   * 
   * 页面渲染renderingDOM
   * 
   */

  var renderingDOM = {
    cycle: function(_tree) {
      var ct = ''
      _tree.forEach(function(_val) {
        if (storage._flagIfram) {
          storage._fCode = _val.F_CODE
          storage._flagIfram = false
        }
        ct +=
          '     <li class="_j_treeSelect" ' +
          '          data-category="' + _val.FK_CATEGORY + '" ' +
          '          data-code="' + _val.F_CODE + '"  ' +
          '          data-survey="' + _val.FK_SURVEY + '">' +
          '        ' + _val['F_CAPTION'] +
          '     </li>'
      })
      return ct
    },

      cycle2: function(_tree) {
      var ct = ''
      _tree.forEach(function(_val) {
        if (storage._flagIfram) {
          storage._fCode = _val.F_CODE
          storage._flagIfram = false
        }
        ct +=
          '     <li class="_j_treeSelect" ' +
          '          data-category="' + _val.categoryID + '" ' +
          '          data-code="' + _val.surveyCode + '"  ' +
          '          data-survey="' + _val.surveyID + '">' +
          '        ' + _val.surveyName +
          '     </li>'
      })
      return ct
    },

    serveryTree: function() {
      var _tree = storage.surveyTree.surveyTree
      var _container = ''
      var _title = '<div class="_j_prents css-treePrents">' + storage.surveyTree.surveyName + '<span class="selectInfor">请选择</span></div>'
      for (var i = 0; i < _tree.length; i++) {
        for (var key in _tree[i]) {
          var ct = this.cycle(_tree[i][key])
          _container = '<div class="_parentsTree"><h4>' + key + '</h4>' + _title + '<ul class="_parmis">' + ct + '</ul></div>'
        }
      }
      $('._j_inforReported').html('').append(_container)
        // $('._j_inforReported').find('div> ._parmis:first').find('._j_treeSelect').addClass('active')
      var _surID = $('._j_inforReported').find('div> ._parmis:first').find('._j_treeSelect').data('reportid')
      storage.surveyid = 1
      storage.category = 1
      sendReques.GetTableBySurvey()
        // if ($('#reporteIframe').length !== 0) {
        //     $('#reporteIframe')[0].contentWindow.ins_displaySheet()
        // }
    },

    serveryTree2: function() {
      var _tree = storage.surveyTree.surveyTree
      var _container = this.cycle(_tree)
      var _title = '<div class="_j_prents css-treePrents">' + storage.surveyTree.surveyName + '<span class="selectInfor">请选择</span></div>'
      _title += '<ul class="_parmis">' + _container + '</ul>'
      storage.addTre_t.append(_title)
        // $('._j_inforReported').append(_title)
    },

    serveryTree3: function() {
      var _tree = storage.surveyTree.result
      var _container = this.cycle2(_tree)
      var _title = '<div class="_j_prents css-treePrents">搜索内容<span class="selectInfor">请选择</span></div>'
      _title += '<ul class="_parmis">' + _container + '</ul>'
      $('._parentsTree').html('').append(_title)
        // $('._j_inforReported').append(_title)
    },

    addSurveyTree: function() {
      var ct = ''
      var _tabel = storage.tableBySurvey.surveyTable
      var flag = true
      var reportid = ''
      for (var i = 0; i < _tabel.length; i++) {
        if (flag) {
          reportid = _tabel[i].reportID
          storage.__repotID = _tabel[i].reportID
          flag = false
        }
        ct += '<div class="_moreInforTabel" data-reportid="' + _tabel[i].reportID + '">' + _tabel[i].reportName +
          '<div class="_mt_mouserPop">' + _tabel[i].popName + '</div>' +
          '</div>'
      }
      $('._moreInfor').html('').append(ct)
      $('._moreInfor').find('._moreInforTabel:first').addClass('active')
        // reportid = $('._moreInfor').findreportidreportid('._moreInforTabel:first').data('reportid')
      if ($('#reporteIframe').length !== 0) {
        if (storage._initIframe) {
          setTimeout(function() {
            $('#reporteIframe')[0].contentWindow.ins_displaySheet(false, false, true)
          }, 2000)
          storage._initIframe = false
        }
        setTimeout(function() {
          $('#reporteIframe')[0].contentWindow.ins_sheetPanel(reportid, '15')
        })
        setTimeout(function() {
          $('#reporteIframe')[0].contentWindow.ins_loadvalue(reportid, storage.termCount, storage._fCode)
        }, 3000);
      }
    },

    createTerm: function() {
      var ct = '<select class="_termCounts">'
      storage._term.terms.forEach(function(_val) {
        ct += '<option data-term="' + _val.termID + '">' + _val.termName + '</option>'
      })
      storage.termCount = 1
      ct += '</select>'
      $('._term').append(ct)
    },

    potoShop: function() {
      var _view = ''
      var _minview = ''
      var flag = true
      storage.potoShop.picture.forEach(function(_val) {
        var _active = ''
        if (flag) {
          _active = 'active'
          flag = false
        }
        _view +=
          '<li class="silder_panel ' + _active + ' clearfix">' +
          '   <div class="f_l""><img src="' + _val.url + '"></div>' +
          '</li>'

        _minview +=
          '<li  class="' + _active + '">' +
          '   <div><img src="' + _val.url + '"></div>' +
          ' <p>' + _val.name + '</p>'
        ' </li>'
      })
      $('.silder_con').html('').append(_view)
      $('.silder_nav').html('').append(_minview)
      _tmss()
    }
  }

  // li.silder_panel


  // $(function() {
  // var _tmss = function() {
  //         var sWidth = $("#slider_name").width();
  //         var len = $("#slider_name .silder_panel").length;
  //         var index = 0;
  //         var picTimer;

  //         var btn = "<a class='prev'>Prev</a><a class='next'>Next</a>";
  //         $("#slider_name").append(btn);
  //         var _width = $('#slider').width()
  //         $("#slider_name .silder_con li").css('width', _width)
  //         $("#slider_name .silder_nav li").css({ "opacity": "0.6", "filter": "alpha(opacity=60)" }).mouseenter(function() {
  //             index = $("#slider_name .silder_nav li").index(this);
  //             showPics(index);
  //         }).eq(0).trigger("mouseenter");

  //         $("#slider_name .prev,#slider_name .next").css({ "opacity": "0.2", "filter": "alpha(opacity=20)" }).hover(function() {
  //             $(this).stop(true, false).animate({ "opacity": "0.6", "filter": "alpha(opacity=60)" }, 300);
  //         }, function() {
  //             $(this).stop(true, false).animate({ "opacity": "0.2", "filter": "alpha(opacity=20)" }, 300);
  //         });


  //         // Prev
  //         $("#slider_name .prev").click(function() {
  //             index -= 1;
  //             if (index == -1) { index = len - 1; }
  //             showPics(index);
  //         });

  //         // Next
  //         $("#slider_name .next").click(function() {
  //             index += 1;
  //             if (index == len) { index = 0; }
  //             showPics(index);
  //         });

  //         // 
  //         $("#slider_name .silder_con").css("width", sWidth * (len));

  //         // mouse 
  //         $("#slider_name").hover(function() {
  //             clearInterval(picTimer);
  //         }, function() {
  //             // picTimer = setInterval(function() {
  //             // 	showPics(index);
  //             // 	index++;
  //             // 	if(index == len) {index = 0;}
  //             // },3000); 
  //         }).trigger("mouseleave");

  //         // showPics
  //         function showPics(index) {
  //             var nowLeft = -index * sWidth;
  //             // $("#slider_name .silder_con").stop(true, false).animate({ "left": nowLeft }, 300);
  //             $("#slider_name .silder_con").css('left', nowLeft)

  //             $("#slider_name .silder_nav li").removeClass("current").eq(index).addClass("current");
  //             // $("#slider_name .silder_nav li").stop(true, false).animate({ "opacity": "0.5" }, 300).eq(index).stop(true, false).animate({ "opacity": "1" }, 300);
  //             $("#slider_name .silder_nav li").css('opacity', 1).eq(index).css('opacity', 1)
  //         }
  //     }
  // });

  var _init = {
    term: function() {
      $('.dataPageList span').html(l._Lg('____introduce'))
      storage.__filterID = l._Lg('____id')
      sendReques.GetSurveyTree()
      sendReques.GetTerm()
    }
  }
  _init.term()
  return C = {
    S: serverCode.sendSurvey,
    ifr: iframeCmita
  }

})