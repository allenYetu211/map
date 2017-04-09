// document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/extjs4.2.1/packages/ext-theme-gray/build/resources/ext-theme-gray-all.css"></link>');
// document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/EnterpriseSheet/resources/css/common.css"></link>');
// document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/EnterpriseSheet/resources/css/sheet.css"></link>');
// document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/EnterpriseSheet/resources/css/toolbar.css"></link>');
// document.write('<link rel="stylesheet" type="text/css" href="sheetPanel/sheet/EnterpriseSheet/resources/css/icon.css"></link>');
// document.write('<script type="text/javascript" src="sheetPanel/sheet/extjs4.2.1/ext-all.js"></script>');
// document.write('<script type="text/javascript" src="sheetPanel/sheet/extjs4.2.1/locale/ext-lang-en.js"></script>');
// document.write('<script type="text/javascript" src="sheetPanel/sheet/EnterpriseSheet/src/language/en.js"></script>');
// document.write('<script type="text/javascript" src="sheetPanel/sheet/EnterpriseSheet/src/EnterpriseSheet/Config.js"></script>');
// document.write('<script type="text/javascript" src="sheetPanel/sheet/EnterpriseSheet/enterprisesheet.js"></script>');
// document.write('<script type="text/javascript" src="sheetPanel/sheet/EnterpriseSheet/src/EnterpriseSheet/api/SheetAPI.js"></script>');

function Sheet(divId, withRowColTitle) {
    this._SHEET_API = null;
    this._SHEET_API_HD = null;
    this._withRowColTitle = withRowColTitle;
    this._clearVar = [];
    // this._serviceUrl = 'http://122.224.94.108:8002/ZJService/NewReportService/ReportService.asmx/';
    this._serviceUrl = '/thememap/ZJService/NewReportService/ReportService.asmx/';
    this._namespace = 'TH.ReportSystem';
    this._zoomSize = 1;
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
        if (!withRowColTitle) {
            _this._SHEET_API.toggleColumnName(_this._SHEET_API_HD);
            _this._SHEET_API.toggleRowName(_this._SHEET_API_HD);
        }
    });
}

Sheet.prototype.attachEvent = function(eventName, fn) {
    this._SHEET_API_HD.sheet.on(eventName, fn);
}

Sheet.prototype.loadStyle = function(reportId, withComment) {
    var _this = this;
    var param = {
        reportId: reportId,
        withComment: withComment
    };
    $.ajax({
        url: _this._serviceUrl + 'LoadStyle',
        type: 'GET',
        // async: false,
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
            _this._clearVar = [];
            if (!_this._withRowColTitle) {
                _this._SHEET_API.toggleColumnName(_this._SHEET_API_HD);
                _this._SHEET_API.toggleRowName(_this._SHEET_API_HD);
            }
            _this._SHEET_API.zoom(_this._SHEET_API_HD, _this._zoomSize);
        }
    })
}

Sheet.prototype.loadDictionary = function(reportId) {
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
}

Sheet.prototype.loadAll = function(reportId, termValue, codeValue, pageIndex) {
    this.loadStyle(reportId, true);
    this.loadDictionary(reportId);
    this.loadValue(reportId, termValue, codeValue, pageIndex);
}

Sheet.prototype.getRecordCount = function(reportId, termValue, codeValue) {
    var _this = this;
    var recordCount = -1;
    var param = {
        reportId: reportId,
        fieldValue: "'f_term':" + termValue + ",'f_code':" + codeValue
    };
    $.ajax({
        url: _this._serviceUrl + 'GetRecordCount',
        type: 'GET',
        async: false,
        data: param,
        success: function(response) {
            recordCount = response.firstChild.innerHTML;
        }
    })
    return recordCount;
}

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
            var result = JSON.parse(response.firstChild.innerHTML);
            _this._SHEET_API.setValueToVariable(_this._SHEET_API_HD, result.variable);
            //_this._SHEET_API.updateCells(_this._SHEET_API_HD, result.verify);
        }
    })
}

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
}

Sheet.prototype.getCellValue = function(row, col) {
    var sheetId = this._SHEET_API_HD.sheet.sheetId;
    return this._SHEET_API.getCellValue(this._SHEET_API_HD, sheetId, row, col).data;
}

Sheet.prototype.deleteComment = function() {
    var sheetId = this._SHEET_API_HD.sheet.sheetId;
    this._SHEET_API.deleteCommentForCoord(this._SHEET_API_HD, [sheetId, 1, 1, 50, 50]);
}

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
}

Sheet.prototype.resetHistory = function() {
    this._SHEET_API.resetHistory(this._SHEET_API_HD);
}

Sheet.prototype.getAllChanges = function() {
    if (this._SHEET_API.getAllChanges(this._SHEET_API_HD).length > 0) {
        return true;
    } else {
        return false;
    }
}

Sheet.prototype.zoom = function(size) {
    this._SHEET_API.zoom(this._SHEET_API_HD, size);
    this._zoomSize = size;
}