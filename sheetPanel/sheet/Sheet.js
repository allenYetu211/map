document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/extjs4.2.1/ext-theme-gray-all.css"></link>');
document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/EnterpriseSheet/resources/css/common.css"></link>');
document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/EnterpriseSheet/resources/css/sheet.css"></link>');
document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/EnterpriseSheet/resources/css/toolbar.css"></link>');
document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/EnterpriseSheet/resources/css/icon.css"></link>');
document.write('<script type="text/javascript" src="sheetPanel/sheet/extjs4.2.1/ext-all.js"></script>');
document.write('<script type="text/javascript" src="sheetPanel/sheet/extjs4.2.1/ext-lang-en.js"></script>');
document.write('<script type="text/javascript" src="sheetPanel/sheet/EnterpriseSheet/src/language/en.js"></script>');
document.write('<script type="text/javascript" src="sheetPanel/sheet/EnterpriseSheet/src/EnterpriseSheet/Config.js"></script>');
document.write('<script type="text/javascript" src="sheetPanel/sheet/EnterpriseSheet/enterprisesheet.js"></script>');
document.write('<script type="text/javascript" src="sheetPanel/sheet/EnterpriseSheet/src/EnterpriseSheet/api/SheetAPI.js"></script>');


function Sheet(divId, zoomSize, withRowColTitle, withComment) {
    this._SHEET_API = null;
    this._SHEET_API_HD = null;
    this._zoomSize = zoomSize;
    this._withComment = withComment;
    this._clearVar = [];
    // this._serviceUrl = '/thememap/ZJService/NewReportService/ReportService.asmx/';
    this._serviceUrl = 'http://122.224.94.108:8002/ZJService/NewReportService/ReportService.asmx/';
    this._namespace = 'TH.ReportSystem';
    var _this = this;
    Ext.onReady(function() {
        _this._SHEET_API = Ext.create('EnterpriseSheet.api.SheetAPI', {
            openFileByOnlyLoadDataFlag: true
        });
        _this._SHEET_API_HD = _this._SHEET_API.createSheetApp({
            renderTo: divId,
            withoutTitlebar: true,
            withoutSheetbar: true,
            withoutContentbar: true,
            withoutSidebar: true,
            withoutToolbar: false,
            style: 'background:white;border-left:1px solid silver;',
            height: '100%'
        });
        _this._SHEET_API.toggleToolBar(_this._SHEET_API_HD, false);
        if (withRowColTitle == false) {
            _this._SHEET_API.toggleColumnName(_this._SHEET_API_HD);
            _this._SHEET_API.toggleRowName(_this._SHEET_API_HD);
        }
    });
    _this._SHEET_API.zoom(this._SHEET_API_HD, zoomSize);
}

Sheet.prototype.loadStyle = function(reportId, callback) {
    var _this = this;
    var param = {
        reportId: reportId,
        withComment: _this._withComment
    };
    $.ajax({
        url: _this._serviceUrl + 'LoadStyle',
        type: 'GET',
        async: true,
        data: param,
        success: function(response) {
            var result = Ext.decode(response.firstChild.innerHTML);
            if (!result.sheets) {
                result = {
                    "sheets": [{
                        "id": 0,
                        "name": "Sheet"
                    }],
                    "cells": []
                };
            }
            _this._SHEET_API.loadData(_this._SHEET_API_HD, result);
            _this._SHEET_API.zoom(_this._SHEET_API_HD, _this._zoomSize);
            _this._clearVar = [];
            var success = true;
            try {
                _this._loadDictionary(reportId);
            } catch (e) {
                success = false;
            }
            if (typeof callback === 'function') {
                callback(success);
            }
        },
        error: function(response) {
            if (typeof callback === 'function') {
                callback(false);
            }
        }
    })
};

Sheet.prototype.getRecordCount = function(reportId, termValue, codeValue) {
    var _this = this;
    var recordCount = 0;
    var param = {
        reportID: reportId,
        fieldValue: "'f_term':" + termValue + ",'f_code':" + codeValue
    };
    $.ajax({
        url: _this._serviceUrl + 'GetRecordCount',
        type: 'GET',
        async: false,
        data: param,
        success: function(response) {
            recordCount = parseInt(response.firstChild.innerHTML);
        }
    })
    return recordCount;
};

Sheet.prototype.loadValue = function(reportId, termValue, codeValue, pageIndex) {
    var _this = this;
    var param = {
        reportId: reportId,
        fieldValue: "'f_term':" + termValue + ",'f_code':" + codeValue,
        pageNum: pageIndex
    };
    $.ajax({
        url: _this._serviceUrl + 'LoadPageVariable',
        type: 'GET',
        async: false,
        data: param,
        success: function(response) {
            if (_this._clearVar.length == 0) {
                _this._clearVar = _this._SHEET_API.getCellVariables(_this._SHEET_API_HD);
            }
            _this._SHEET_API.setValueToVariable(_this._SHEET_API_HD, _this._clearVar);

            //  添加判断
            if (response.firstChild.innerHTML === '') {
                var result = []
            } else {
                var result = JSON.parse(response.firstChild.innerHTML);
            }
            // if (result.variable !== undefined) {
            _this._SHEET_API.setValueToVariable(_this._SHEET_API_HD, result.variable);
            // }
            //_this._SHEET_API.updateCells(_this._SHEET_API_HD, result.verify);
        }
    })
};

Sheet.prototype.saveValue = function(reportId, pageIndex) {
    var variable = this._SHEET_API.getCellVariables(this._SHEET_API_HD);
    for (var key in variable) {
        var value = variable[key];
        if (value == "" || value == undefined) {
            delete variable[key];
        }
    }
    var _this = this;
    var param = {
        reportId: reportId,
        varialbeValue: JSON.stringify(variable),
        pageNum: pageIndex
    };
    $.ajax({
        url: _this._serviceUrl + 'SavePageVariable',
        type: 'GET',
        async: false,
        data: param,
        success: function(response) {
            _this.resetHistory();
        }
    })
};

Sheet.prototype.getAllChanges = function() {
    if (this._SHEET_API.getAllChanges(this._SHEET_API_HD).length > 0) {
        return true;
    } else {
        return false;
    }
};

Sheet.prototype.resetHistory = function() {
    this._SHEET_API.resetHistory(this._SHEET_API_HD);
};

Sheet.prototype.attachEvent = function(eventName, fn) {
    this._SHEET_API_HD.sheet.on(eventName, fn);
};

Sheet.prototype.getSelectedRange = function () {
    var ss = this._SHEET_API_HD.sheet, sm = ss.getSelectionModel(), pos = sm.getMinMaxPos();
    var rowMin = pos.minrow;
    var colMin = pos.mincol;
    var rowMax = pos.maxrow;
    var colMax = pos.maxcol;
    var isMergedCell = this._SHEET_API.isMergedCell(this._SHEET_API_HD, this._SHEET_API_HD.sheet.sheetId, rowMax, colMax);
    if (isMergedCell == true) {
        var floatings = this._SHEET_API.getJsonData(this._SHEET_API_HD).floatings;
        var len = floatings.length;
        for (var i = 0; i < len; i++) {
            var range = floatings[i].jsonObj;
            if (rowMax >= range[0] && rowMax <= range[2] && colMax >= range[1] && colMax <= range[3]) {
                rowMax = range[0];
                colMax = range[1];
                break;
            }
        }
    }
    var minLetter = this._toLetter(colMin) + rowMin;
    if (rowMin == rowMax && colMin == colMax) {
        return minLetter;
    }
    else {
        var maxLetter = this._toLetter(colMax) + rowMax;
        return minLetter + ':' + maxLetter;
    }
};

Sheet.prototype.addComment = function(cellRange, comment) {
    var numRange = this._rangeToNumber(cellRange);
    var rowMin = numRange[0];
    var colMin = numRange[1];
    var rowMax = numRange[2];
    var colMax = numRange[3];
    var cells = [];
    for (var i = rowMin; i <= rowMax; i++) {
        for (var j = colMin; j <= colMax; j++) {
            cells.push({
                sheet: this._SHEET_API_HD.sheet.sheetId,
                row: i,
                col: j,
                json: {
                    comment: comment,
                    commentEdit: "hide"
                },
                applyWay: 'apply'
            });
        }
    }
    this._SHEET_API.updateCells(this._SHEET_API_HD, cells);
};

Sheet.prototype.deleteComment = function(cellRange) {
    var numRange = this._rangeToNumber(cellRange);
    this._SHEET_API.deleteCommentForCoord(this._SHEET_API_HD, [this._SHEET_API_HD.sheet.sheetId, numRange[0], numRange[1], numRange[2], numRange[3]]);
};

Sheet.prototype.getCellValue = function(row, col) {
    var sheetId = this._SHEET_API_HD.sheet.sheetId;
    return this._SHEET_API.getCellValue(this._SHEET_API_HD, sheetId, row, col).data;
};

Sheet.prototype.setCellValue = function(row, col, value) {
    var sheetId = this._SHEET_API_HD.sheet.sheetId;
    var cells = [];
    cells.push({
        sheet: sheetId,
        row: row,
        col: col,
        json: {
            data: value
        },
        applyWay: 'apply'
    });
    this._SHEET_API.updateCells(this._SHEET_API_HD, cells);
};

Sheet.prototype.zoom = function(zoomSize) {
    if (zoomSize != this._zoomSize) {
        this._SHEET_API.zoom(this._SHEET_API_HD, zoomSize);
        this._zoomSize = zoomSize;
    }
};

Sheet.prototype._loadDictionary = function(reportId) {
    var _this = this;
    var param = {
        reportId: reportId
    };
    $.ajax({
        url: _this._serviceUrl + 'LoadDictionary',
        type: 'GET',
        async: false,
        data: param,
        success: function(response) {
            var result = JSON.parse(response.firstChild.innerHTML);
            _this._SHEET_API.updateCells(_this._SHEET_API_HD, result);
        }
    })
};

Sheet.prototype._toLetter = function(number) {
    var letter = "";
    if (number > 0) {
        if (number >= 1 && number <= 26) {
            letter = String.fromCharCode(64 + parseInt(number));
        } else {
            while (number > 26) {
                var count = parseInt(number / 26);
                var remainder = number % 26;
                if (remainder == 0) {
                    remainder = 26;
                    count--;
                    letter = String.fromCharCode(64 + parseInt(remainder)) + letter;
                } else {
                    letter = String.fromCharCode(64 + parseInt(remainder)) + letter;
                }
                number = count;
            }
            letter = String.fromCharCode(64 + parseInt(number)) + letter;
        }
    }
    return letter;
};

Sheet.prototype._rangeToNumber = function(cellRange) {
    var range = cellRange.toUpperCase().split(':');
    if (range.length >= 1 && range.length <= 2) {
        var rowMax, colMax;
        var rowMin = parseInt(range[0].replace(/[^0-9]+/ig, ""));
        var colMin = this._toNumber(range[0].replace(/[^A-Z]+/ig, ""));
        if (range.length == 1) {
            rowMax = rowMin;
            colMax = colMin;
        } else if (range.length == 2) {
            rowMax = parseInt(range[1].replace(/[^0-9]+/ig, ""));
            colMax = this._toNumber(range[1].replace(/[^A-Z]+/ig, ""));
        }
        return [rowMin, colMin, rowMax, colMax];
    }
};

Sheet.prototype._toNumber = function(letter) {
    var len = letter.length;
    var number = 0;
    for (var i = 0; i < len; i++) {
        var offset = letter.charCodeAt(i) - 64;
        number += offset * Math.pow(26, len - 1 - i);
    }
    return number;
};