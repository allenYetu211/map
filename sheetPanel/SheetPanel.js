document.write('<script src="sheetPanel/sheet/Sheet.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/msgbox/js/msgbox.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/dialog/js/jDialog.js" type="text/javascript"></script>');
document.write('<script src="sheetPanel/paging/Paging.js" type="text/javascript"></script>');

function SheetPanel(divId, withRowColTitle) {	
    var _this = this;
    this._report;
    this._term;
    this._code;
    this._pageIndex;
	this._perPage;
	
    var btnSave = document.createElement("input");
    btnSave.type = 'button';
    btnSave.onclick = function () {
        _this._saveValue(_this);
    };
    btnSave.value = "save";

    this._sheet = new Sheet(divId, withRowColTitle);
    var divPageId = 'page';
    var divPage = document.createElement("div");
    divPage.id = divPageId;
	
	var divSheet = document.getElementById(divId);
	divSheet.appendChild(divPage);
	divSheet.appendChild(btnSave);
	
    this._paging = new Paging(divPageId, function (pageNumber, event) {
        _this._chagnePage(_this, pageNumber);
    });
    divPage.style.top = divSheet.offsetTop + divSheet.offsetHeight - 45 + 'px';
    divPage.style.left = divSheet.offsetLeft + divSheet.offsetWidth / 2 - divPage.offsetWidth / 2 + 'px';
}

SheetPanel.prototype.loadStyle = function (reportId,perPage, withComment) {
    this._report = reportId;
    this._sheet.loadStyle(reportId, withComment);
	this._sheet.loadDictionary(reportId);
    this._pageIndex = -1;
	this._perPage=perPage;
	ZENG.msgbox.show('加载成功', 4,1500);
};

SheetPanel.prototype.loadValue = function (report, term, code, pageIndex) {
    this._term = term;
    this._code = code;
    this._sheet.loadValue(report, term, code, pageIndex);
    if (this._pageIndex == -1) {
        var recordCount = this._sheet.getRecordCount(report, term, code);
        this._setPage(recordCount, this._perPage, pageIndex);
        this._pageIndex = pageIndex;
    }
};

SheetPanel.prototype.attachEvent = function (eventName, fn) {
    this._sheet.attachEvent(eventName, fn);
}

SheetPanel.prototype.getCellValue = function (row, col) {
    return this._sheet.getCellValue(row,col);
}

SheetPanel.prototype._setPage = function (recordCount, perPage, pageIndex) {
    this._paging.setPage(parseInt(recordCount) + 1, perPage, pageIndex);
};

SheetPanel.prototype._chagnePage = function (sender, pageNumber) {
    if (sender._sheet.getAllChanges()) {
        var dialog = jDialog.confirm('是否保存？', {
            handler: function (button, dialog) {
                sender._sheet.saveValue(sender._report, sender._pageIndex);				
                sender._sheet.loadValue(sender._report, sender._term, sender._code, pageNumber);
                sender._pageIndex = pageNumber;
                sender._sheet.resetHistory();
                dialog.close();
				ZENG.msgbox.show('保存成功', 4, 1500);
            }
        }, {
            handler: function (button, dialog) {
                sender._sheet.loadValue(sender._report, sender._term, sender._code, pageNumber);
                sender._pageIndex = pageNumber;
                sender._sheet.resetHistory();
                dialog.close();
            }
        });
    } else {
        sender.loadValue(sender._report, sender._term, sender._code, pageNumber);
        sender._pageIndex = pageNumber;
    }
};

SheetPanel.prototype._saveValue = function (sender) {
    sender._sheet.saveValue(sender._report, sender._pageIndex);
    sender._sheet.loadValue(sender._report, sender._term, sender._code, sender._pageIndex);
    var recordCount = this._sheet.getRecordCount(sender._report, sender._term, sender._code);
    sender._setPage(recordCount, sender._perPage, sender._pageIndex);
    ZENG.msgbox.show('保存成功', 4, 1500);
};