document.write('<script src="sheetPanel/jquery/jquery.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/sheet/Sheet.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/msgbox/msgbox.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/dialog/js/jDialog.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/paging/Paging.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/toolbar/js/Toolbar.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/range/Range.js" type="text/javascript"></script>');
document.write('<div id="divSave" data-toolbar="user-options" class="btn-toolbar pull-left"><i class="fa fa-save"></i></div>');

function SheetPanel(divId, zoomSize, editable, withRowColTitle, withComment) {
    this._report;
    this._term;
    this._code;
    this._pageIndex;
    this._perPage;
    this._recordCount;
    this._editable = editable;
    var _this = this;

    this._sheet = new Sheet(divId, zoomSize, withRowColTitle, withComment);
    var divSheet = document.getElementById(divId);

    //save
    var divSave = document.getElementById("divSave");
    divSave.style.top = divSheet.offsetTop + divSheet.offsetHeight - 44 + 'px';
    divSave.style.left = divSheet.offsetLeft + divSheet.offsetWidth / 2 - 198 + 'px';
    divSave.onclick = function () {
        _this._saveValue(_this);
    };

    //page
    var divPageId = 'page';
    var divPage = document.createElement("div");
    divPage.id = divPageId;
    divPage.style.position = 'absolute';
    divPage.style.zIndex = 1;
    divPage.style.width = '30%';
    this._paging = new Paging(divPageId, function (pageIndex) {
        _this._chagnePage(_this, pageIndex);
    });
    divPage.style.top = divSheet.offsetHeight - 40 + 'px';
    divPage.style.left = divSheet.offsetWidth / 2 - 150 + 'px';
    divSheet.appendChild(divPage);

    //range
    var valueChangedFn = function (value) {
        _this._sheet.zoom(value / 100);
    };
    var range = new Range(valueChangedFn, zoomSize * 100);
    var divRange = document.getElementsByClassName('srs-slider')[0];
    divRange.style.top = divSheet.offsetTop + divSheet.offsetHeight - 49 + 'px';
    divRange.style.left = divSheet.offsetLeft + divSheet.offsetWidth - 230 + 'px';
}

SheetPanel.prototype.loadStyle = function (reportId, perPage) {
    ZENG.msgbox.show('加载中，请稍后...', 6, 10000000);
    this._report = reportId;
    this._sheet.loadStyle(reportId, function () {
        ZENG.msgbox.show('加载成功', 4, 1500);
    });
    this._pageIndex = -1;
    this._perPage = perPage;
};

SheetPanel.prototype.loadValue = function (report, term, code, pageIndex) {
    this._term = term;
    this._code = code;
    this._sheet.loadValue(report, term, code, pageIndex);
    if (this._pageIndex == -1) {
        this._recordCount = this._sheet.getRecordCount(report, term, code);
        this._paging.setPage(this._recordCount, this._perPage, pageIndex);
        this._pageIndex = pageIndex;
    }
    if (this._editable) {
        var divSave = document.getElementById("divSave");
        divSave.style.display = 'block';
    }
};

SheetPanel.prototype.attachEvent = function (eventName, fn) {
    this._sheet.attachEvent(eventName, fn);
}

SheetPanel.prototype.getSelectedRange = function () {
    return this._sheet.getSelectedRange();
}

SheetPanel.prototype.getCellValue = function (row, col) {
    return this._sheet.getCellValue(row, col);
}

SheetPanel.prototype.addComment = function (cellRange, comment) {
    this._sheet.addComment(cellRange, comment);
};

SheetPanel.prototype.deleteComment = function (cellRange) {
    this._sheet.deleteComment(cellRange);
}

SheetPanel.prototype._chagnePage = function (sender, pageIndex) {
    if (sender._sheet.getAllChanges()) {
        this._paging.setPage(sender._recordCount, sender._perPage, sender._pageIndex);
        var dialog = jDialog.confirm('是否保存更改？', {
            handler: function (button, dialog) {
                sender._sheet.saveValue(sender._report, sender._pageIndex);
                sender.recordCount = sender._sheet.getRecordCount(sender._report, sender._term, sender._code);
                sender._sheet.loadValue(sender._report, sender._term, sender._code, pageIndex);
                sender._pageIndex = pageIndex;
                sender._sheet.resetHistory();
                dialog.close();
                sender._paging.setPage(sender._recordCount, sender._perPage, pageIndex);
                ZENG.msgbox.show('保存成功', 4, 1500);
            }
        }, {
            handler: function (button, dialog) {
                sender._sheet.loadValue(sender._report, sender._term, sender._code, pageIndex);
                sender._pageIndex = pageIndex;
                sender._sheet.resetHistory();
                dialog.close();
                sender._paging.setPage(sender._recordCount, sender._perPage, pageIndex);
            }
        }, {closeable: false});
    }
    else {
        sender.loadValue(sender._report, sender._term, sender._code, pageIndex);
        sender._pageIndex = pageIndex;
    }
};

SheetPanel.prototype._saveValue = function (sender) {
    sender._sheet.saveValue(sender._report, sender._pageIndex);
    sender._sheet.loadValue(sender._report, sender._term, sender._code, sender._pageIndex);
    sender._recordCount = this._sheet.getRecordCount(sender._report, sender._term, sender._code);
    this._paging.setPage(sender._recordCount, sender._perPage, sender._pageIndex);
    ZENG.msgbox.show('保存成功', 4, 1500);
};