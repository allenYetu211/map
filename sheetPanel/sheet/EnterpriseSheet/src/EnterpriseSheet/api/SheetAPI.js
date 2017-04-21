/**
 * Enterprise Spreadsheet Solutions
 * Copyright(c) FeyaSoft Inc. All right reserved.
 * info@enterpriseSheet.com
 * http://www.enterpriseSheet.com
 * 
 * Licensed under the EnterpriseSheet Commercial License.
 * http://enterprisesheet.com/license.jsp
 * 
 * You need to have a valid license key to access this file.
 */
Ext.define('EnterpriseSheet.api.SheetAPI', {
	
	requires: [
        'EnterpriseSheet.pure.lang.Language',
        'EnterpriseSheet.sheet.action.HotKey',
        'EnterpriseSheet.sheet.menu.ContextMenu',
        'EnterpriseSheet.sheet.data.RollingStore',
                         
        'EnterpriseSheet.sheet.toolbar.MenuTitlebar',
        'EnterpriseSheet.sheet.toolbar.SheetTabbar',
        'EnterpriseSheet.sheet.toolbar.Toolbar',
        'EnterpriseSheet.sheet.toolbar.Sidebar',
        'EnterpriseSheet.sheet.toolbar.Contentbar',
        'EnterpriseSheet.sheet.floating.Arrow',
        'EnterpriseSheet.sheet.floating.CalculateHint',
        'EnterpriseSheet.sheet.plugin.SequenceNumber',
        'EnterpriseSheet.sheet.plugin.DropList',
        'EnterpriseSheet.sheet.RollingSheet',
        'EnterpriseSheet.api.SheetAppHandle',
        'EnterpriseSheet.sheet.pop.ErrorReportWin'
    ],
	
	constructor : function(config){
        Ext.apply(this, config);
        
        Ext.tip.QuickTipManager.init();
        SQTIP.init();
        
        /*
         * set the open file flag, if true then only load the data not refresh the url
         */
        SABOX.updateConfig({
            openFileByOnlyLoadDataFlag: this.openFileByOnlyLoadDataFlag
        });

        /*
         * set the timeout
         */
        if(SCONST.PULLING_TIMEOUT){
           Ext.Ajax.timeout = SCONST.PULLING_TIMEOUT;
        }
        if(Ext.isIE){
           /*
            * for an css issue in IE10
            */
           Ext.getBody().addCls('x-ie');
        }
           
        if(!Ext.isMac && Ext.isWebKit){
           Ext.getBody().addCls('iScroll');
        }
           
        this.callParent(arguments);
		
	},
           
    /**
     * _public
     * create Sheet app based the passed config
     * @param {Object} config: the configuration of the SheetApp to create,
     { 
       withoutTitlebar: true,
       withoutSheetbar: true,
       withoutToolbar: true,
       withoutContentbar: true,
       withoutSidebar: true
     },
     set true/false to show/hide some element of sheet
     * @return {Object}: the handle of the app just created
     {
        appCt: the container of the sheet app, which contains the sheet and some toolbar
        sheet: the sheet itself
        store: the store of sheet app
     }
     */
    createSheetApp : function(config){
        //window['startCounting'] = new Date();
        config = config || {};        
        /*
        var store = Ext.create('EnterpriseSheet.sheet.data.SheetStore', {
            fileId: config.fileId
        });*/
        var store;
        if(config.store){
        	store = config.store;
        }else{
	        store = Ext.create('EnterpriseSheet.sheet.data.RollingStore', {
	            fileId: config.fileId
	        });
        }
        
        var plugins = [], lookup = {}, dockedItems = [];
        var arrowConfig = config.arrowConfig || {};
        Ext.applyIf(arrowConfig, {
        	itemsInMenu: SCONFIG.arrowmenu_items
        });
        var arrow = new EnterpriseSheet.sheet.floating.Arrow(arrowConfig);
        plugins.push(arrow);
        lookup['arrow'] = arrow;
        
        var dropListConfig = config.dropListConfig || {};
        var dropList = new EnterpriseSheet.sheet.plugin.DropList(dropListConfig);
        plugins.push(dropList);
        lookup['dropList'] = dropList;
           
        var hint = new EnterpriseSheet.sheet.floating.CalculateHint();
        plugins.push(hint);
        lookup['hint'] = hint;
           
        var contextMenuConfig = config.contextMenuConfig || {};
        Ext.applyIf(contextMenuConfig, {
        	itemsInMenu: SCONFIG.contextmenu_items
        });
        var contextMenu = new EnterpriseSheet.sheet.menu.ContextMenu(contextMenuConfig);
        plugins.push(contextMenu);
        lookup['contextMenu'] = contextMenu;
           
        var seqNumber = Ext.create('EnterpriseSheet.sheet.plugin.SequenceNumber');
        plugins.push(seqNumber);
        lookup['seqNumber'] = seqNumber;                  
        
        if(!config.withoutTitlebar){
        	var mtCfg = config.menuTitlebarConfig || {};
        	var titlebar = new EnterpriseSheet.sheet.toolbar.MenuTitlebar(Ext.apply(mtCfg, {
        		dock: 'top'
        	}));
        	plugins.push(titlebar);
        	dockedItems.push(titlebar);
        	lookup['titlebar'] = titlebar;
        }
           
        if(!config.withoutSheetbar){
        	var sheetBarClassName = config.sheetBarClassName || 'EnterpriseSheet.sheet.toolbar.SheetTabbar';
            var sheetbar = Ext.create(sheetBarClassName, {
                dock: SCONFIG.sheet_tab_bar_position
            });
            plugins.push(sheetbar);
            dockedItems.push(sheetbar);
            lookup['sheetbar'] = sheetbar;
        }

        if(!config.withoutToolbar){
        	var toolbarClassName = config.toolbarClassName || 'EnterpriseSheet.sheet.toolbar.Toolbar';
        	var tbCfg = config.toolbarConfig || {};
            var toolbar = Ext.create(toolbarClassName, Ext.apply(tbCfg, {
        		dock: 'top'
        	}));
            plugins.push(toolbar);
            dockedItems.push(toolbar);
            lookup['toolbar'] = toolbar;
        } else {
        	// without toolbar .. however, in general we still need undo/redo -- ctrl+Z... Add this will make hotkey work
        	var toolbarClassName = config.toolbarClassName || 'EnterpriseSheet.sheet.toolbar.Toolbar';
        	var tbCfg = config.toolbarConfig || {};
            var toolbar = Ext.create(toolbarClassName, Ext.apply(tbCfg, {
        		dock: 'top'
        	}));
            plugins.push(toolbar);
        }

        if(!config.withoutSidebar){
            var sidebar = new EnterpriseSheet.sheet.toolbar.Sidebar({
                dock: 'right',
                bodyStyle: 'border-right:none;'
            });
            plugins.push(sidebar);
            dockedItems.push(sidebar);
            lookup['sidebar'] = sidebar;
        }
        if(!config.withoutContentbar){
            var contentbar = new EnterpriseSheet.sheet.toolbar.Contentbar({
                dock: 'top',
                disableCalEditorStyle: config.disableCalEditorStyle
            });
            plugins.push(contentbar);
            lookup['contentbar'] = contentbar;
        }
        var sheetClassName = config.sheetClassName || 'EnterpriseSheet.sheet.RollingSheet';
        var sheet = Ext.create(sheetClassName, {
            style: 'border:none;',
            loadMask: {
                msg: SLANG['processing']
            },
            rowNameHidden: config.rowNameHidden,
            colNameHidden: config.colNameHidden,
            store: store,
            plugins: plugins,
            disableCalEditorStyle: config.disableCalEditorStyle,
            scrollerAlwaysVisible: config.scrollerAlwaysVisible
        });
        
        var inner;
        if(!config.withoutContentbar){
            inner = {
                border: false,
                layout: 'fit',
                bodyStyle: 'border:none;',
                items: [sheet],
                dockedItems: [contentbar]
            };
        }else{
            inner = sheet;
        }

        var panel = Ext.create('Ext.panel.Panel', Ext.applyIf({
            border: false,
            layout: 'fit',
            bodyStyle: 'border:none;',
            items: [inner],
            dockedItems: dockedItems
        }, config));
        
        if(sidebar && titlebar){
            var me = this;
            var findReplace = function(){
                sidebar.toggleOption(sidebar.searchBtn);
            };
           
            var showcellstyles = function() {
                sidebar.toggleOption(sidebar.cellStyleBtn);
            };
           
            var showCharts = function() {
                sidebar.toggleOption(sidebar.chartBtn);
            };
           
            var showTables = function() {
                sidebar.toggleOption(sidebar.tableStyleBtn);
            };
           
            var showinsertimage = function() {
                sidebar.toggleOption(sidebar.pictureBtn);
            };
            
            var showconditionmgr = function() {
                sidebar.toggleOption(sidebar.conditionStyleBtn);
            };
           
            titlebar.on('findreplace', findReplace);
            titlebar.on('showcellstyles', showcellstyles);
            titlebar.on('showCharts', showCharts);
            titlebar.on('showTables', showTables);
            titlebar.on('showconditionmgr', showconditionmgr);
            titlebar.on('showinsertimage', showinsertimage);
           
            PHKey.bindHotKey(70, true, false, false, findReplace);
        }
        this.checkBeforeUnload(store);
        
        store.on('reportservererror', this.reportServerError, this);
           
        return Ext.create('EnterpriseSheet.api.SheetAppHandle', Ext.apply({
            appCt: panel,
            sheet: sheet,
            store: store
        }, lookup));
    },
        
           
    /**
     * _public
     * create a window instance contains the sheet app and return the handle
     * @param {Object} sheetConfig: the configuration object for create the sheet app
     * @param {Object} winConfig: the configuration object for the Ext.window.Window
     * @return {Object}: the handle of this sheet app created
     */
    createSheetWin : function(sheetConfig, winConfig){
        sheetConfig = sheetConfig || {};
        winConfig = winConfig || {};
        delete(sheetConfig.renderTo);
        delete(winConfig.items);
        delete(winConfig.layout);
        var hd = this.createSheetApp(sheetConfig);
        var win = Ext.create('Ext.window.Window', Ext.apply({
            layout: 'fit',
            items: [hd.appCt]
        }, winConfig, {
            modal: true,
            closeAction: 'hide',
            width: 1000,
            height: 700
        }));
        hd.appWin = win;
        return hd;
    },
           
    /*
     * _private
     * check before refresh or close the browser
     */
    checkBeforeUnload : function(store){
        try{
            if(!window.onbeforeunload)
                window.onbeforeunload = function(){
                if(!store.isEmptyQueue()){
                    store.doPulling();
                    return SLANG['save_change_before_reload'];
                }else if(store.isPulling()){
                    return SLANG['save_change_before_reload'];
                }
            };
        }catch(e){}
    },
           
    /**
     * _public
     * load file to the passed sheet app
     * @param {Object} hd: the sheet app handle
     * @param {Integer/String} fileId: the file id to load
     * @param {Function} callback: the callback function which will be called after the file is loaded
     * @param {Object} scope: the scope for the callback function
     */
    loadFile : function(hd, fileId, callback, scope){    	
    	if(callback){
    		hd.sheet.on('afterloadsheet', function(){
    			callback.apply(scope, arguments);
    		}, this, {single: true});
    	}    	
        hd.store.loadFile({
            fileId: fileId
        });
    },
           
    /**
     * _public
     * load json for the sheet app
     * @param {Object} hd: the sheet app handle
     * @param {Object} json: the json data to load to this sheet
     */
    loadData : function(hd, json, callback, scope){
        if(json){        	
            hd.store.loadJsonFile(json);           
        }
        
	    if(callback){
	        callback.call(scope);
	    }
    },
    
    /**
     * _public
     * load json for the sheet tab
     * @param {Object} hd: the sheet app handle
     * @param {Object} json: the json data to load to this sheet
     */
    loadTabData : function(hd, json, callback, scope){
        if(json){  
        	var sheet = hd.sheet;   
            hd.store.loadTabJsonFile(json, function(){
            	
            }, this); 
            if(Ext.isFunction(sheet.refresh)){
            	sheet.refresh();
            }            
        }
        
	    if(callback){
	        callback.call(scope);
	    }
    },
    
    loadMoreData : function(hd, json, callback, scope){
        if(json){ 
            var sheet = hd.sheet;      	
            hd.store.loadMoreJsonFile(json);    
            if(Ext.isFunction(sheet.refresh)){
            	sheet.refresh();
            }    
        }
        
	    if(callback){
	        callback.call(scope);
	    }
    },
    
    refreshSheet : function(hd) {
    	var sheet = hd.sheet;
    	if(Ext.isFunction(sheet.refresh)){    		    	
    		sheet.refresh();  	
    	}
    },
           
    /**
     * _public
     * update cells for the passed sheet
     * @param {Object} hd: the sheet app handle
     * @param {Array} cellObjs: an array of the cells need to be update, every item of this array will be an object, which like this:
     {
        sheet:1, //the sheetId of the cell you want to update
        row:1, //the row index of the cell you want to update
        col:1, //the column index of the cell you want to update
        json:{//json property contains all the style and setting of the cell
            data:"ABC", //the data in this cell, it can be a calculate such as "=SUM(A1,B1)"
            cal: false, //if true means this cell is a calculate, the sheet will try to parse the data and calculate it
            bgc: 'black', //the background-color of this cell
            color: 'white' //the font-color of this cell
            ...
        },
        applyWay: 'clear'//could be ['apply', 'applyIf', 'clear'], default to 'clear'. 'apply' means it will use the property in json to replace these propety in the current cell; 'applyIf' means it will use the property in json to add to the current cell if the current cell doesn't have that property; 'clear' means clear all the property of the cell first and then apply json to this cell
     }
     * @param {Function} callback: the callback function which will be called after the cells are updated
     * @param {Object} scope: the scope for the callback function
     */
    updateCells : function(hd, cellObjs, callback, scope){
        hd.sheet.updateCells(cellObjs, callback, scope);
       
    },
           
    /**
     * _public
     * save the current sheet to backend, it will popup a window to ask input a file name if this sheet is not created in the backend, or it will save all data into the backend
     * @param {Object} hd: the sheet app handle
     * @param {Function} callback: the callback function which will be called after the data are saved
     * @param {Object} scope: the scope for the callback function
     */
    saveData : function(hd, callback, scope){
        var sheet = hd.sheet, store = hd.store;
        SSAVE.popup({
            callback: function(fileName, exname, fileId){
                sheet.saveJsonFile({
                    id: fileId,
                    name: fileName,
                    exname: exname
                }, function(newFileId){
                    store.loadFile({
                        fileId: newFileId
                    }, function(){
                    	Ext.Msg.alert(SLANG['hint'], SLANG['all_changes_are_saved']);
                    	if(callback){
                    		callback.call(scope, newFileId, store);
                    	}
                    }, this);                    
                }, this);
            },
            scope: this
        });
    },
    
    /**
     * _public
     * save the current sheet to backend, it will popup a window to ask input a file name if this sheet is not created in the backend, or it will save all data into the backend
     * @param {Object} hd: the sheet app handle
     * @param {Function} callback: the callback function which will be called after the data are saved
     * @param {Object} scope: the scope for the callback function
     */
    saveDataSclient : function(hd, fileId, fileName, exname, callback, scope){
        var sheet = hd.sheet, store = hd.store;
        sheet.saveJsonFile({
            id: fileId,
            name: fileName,
            exname: exname
        }, function(newFileId){
        	store.loadFile({
                fileId: newFileId
            }, function(){            	
            	if(callback){
            		callback.call(scope, newFileId, store);
            	}
            }, this);
        }, this);
    },
           
    setReadOnly : function(hd, readOnly){
        hd.sheet.setReadOnly(readOnly);
    },
           
    /**
     * _public
     * get the json data of the passed sheet
     * @param {Object} hd: the sheet app handle
     * @return {Object}: the json data of this sheet
     */
    getJsonData : function(hd, compress){
        var json = hd.sheet.getJsonData(compress);      
        return json;
    },
    
    /**
     * _public
     * add the passed calculates to the sheet calculate system, so user can use these calculates in the cell
     * @param {Object} calculates: all the customized calculates want to add to the sheet calculate system
     * @return {Array} an array contains the names of these calculates which are failed to add to sheet calculate system, the reason for failure is there is already existed a calculate with the same name in the system
     */
    addCalculates : function(calculates){
        var calculate = EnterpriseSheet.sheet.calculate.Calculate.prototype,
            hint = EnterpriseSheet.sheet.floating.CalculateHint.prototype,
           fails = [];
        for(var p in calculates){
            if(calculates.hasOwnProperty(p)){
                var it = calculates[p], calFun = it.fn, calHint = it.hint;
                if(calculate.addCalculate(p, calFun)){
                    if(calHint){
                        hint.addHint(calHint);
                    }
                }else{
                    fails.push(p);
                }
            }
        }
        if(0 < fails.length){
            return fails;
        }
    },
    
    /**
     * _public
     * add the passed calculate exceptions to the sheet calculate system, so when there is a matched exception happened during the calculating, there will be a red tip on the cell to show some exception information to the user
     * @param {Object} calExceptions: all the customized calculate exceptions want to add to the sheet calculate system
     * @return {Array} an array contains the names of these calculate exceptions which are failed to add to sheet calculate system, the reason for failure is there is already existed a calculate exception with the same name in the system
    */
    addCalculateExceptions : function(calExceptions){
        var fails = [];
        for(var p in calExceptions){
            if(calExceptions.hasOwnProperty(p)){
                var it = calExceptions[p];
                if(!SCALEXP.addExceptionInfo(p, it)){
                    fails.push(p);
                }
            }
        }
        if(0 < fails.length){
           return fails;
        }
    },
           
    /**
     * _public
     * get the sheet json data of the passed sheet
     * @param {Object} hd: the sheet app handle
     * @return {Object}: the json data of this sheet
     */
    getSheetTabData : function(hd){
        var store = hd.sheet.getStore();
        var sheets = store.getSheets(), arr = [], activedSheetId = store.getActivedSheetId();
        for(var i = 0, len = sheets.length; i < len; i++){
            var it = sheets[i];
            arr.push({
                id: it.id,
                name: it.name,
                actived: activedSheetId === it.id,
                color: it.color
            });
        }
        return arr;
    },
           
    getActivedSheetId : function(hd){
        var store = hd.sheet.getStore();
        return store.getActivedSheetId();
    },
    
    getTabnameById : function(hd, tabId){
    	var store = hd.sheet.getStore();
        var sheets = store.getSheets();
        for(var i = 0, len = sheets.length; i < len; i++){
            var it = sheets[i];
            if (it.id == tabId) return it.name;
        }
        return null;
    },
           
    /**
     * _public
     * add a new sheet tab
     * @param {Object} hd: the sheet app handle
     * @param {Object} sheetTabConfig: the configuration of the new sheet tab to add
     * @param {Function} callback: the callback function which will be called after the new sheet tab is added
     * @param {Object} scope: the scope for the callback function
     * @param {Boolean} notSwitchToNewSheet: true means not switch to the sheet tab after added
     */
    addSheetTab : function(hd, sheetTabConfig, callback, scope, notSwitchToNewSheet){
        var sheet = hd.sheet, store = hd.store;
        store.addSheet(sheetTabConfig, function(data){
            var sheetId = data.id;
            if(!notSwitchToNewSheet){
                sheet.loadSwitchSheet(sheetId, function(){
                    if(callback){
                        callback.call(scope, sheetId, hd);
                    }
                }, this);
            }else if(callback){
                callback.call(scope, sheetId, hd);
            }
        }, this);

    },
	
    /**
     * _public
     * update the passed tab, rename it or change the color
     * @param {Object} hd: the sheet app handle
     * @param {Object} sheetTabConfig: the tabConfig to update
     {
        sheetId: sheetId, // the id of sheet tab to update, if undefined then use the actived sheet tab id as default
        name: name, // the new tab name to update
        color: color, // the new tab color to update
        position: position // the new position of this tab to update
     }
     * @param {Function} callback: the callback function which will be called after the tab is updated
     * @param {Object} scope: the scope for the callback function
     * @param {Boolean} notSwitchToNewSheet: true means not switch to the sheet tab after updated     
     */
    updateSheetTab : function(hd, sheetTabConfig, callback, scope, notSwitchToNewSheet){
        var sheet = hd.sheet, store = hd.store;
        store.updateSheetTab(sheetTabConfig.sheetId, sheetTabConfig, function(sheetId){
            if(!notSwitchToNewSheet){
                sheet.loadSwitchSheet(sheetId, function(){
                    if(callback){
                        callback.call(scope, sheetId, hd);
                    }
                }, this);
            }else{
                if(callback){
                    callback.call(scope, sheetId, hd);
                }
            }
        }, this);
    },
	
	/**
     * _public
     * delete the passed tab
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetTabId: id of the sheet tab need to be updated
     * @param {Function} callback: the callback function which will be called after the tab is updated
     * @param {Object} scope: the scope for the callback function
     */
    deleteSheetTab : function(hd, sheetTabId, callback, scope){
        var sheet = hd.sheet, store = hd.store;
        store.deleteSheet(sheetTabId, function(){
            var activedSheetId = store.getActivedSheetId();
            sheet.loadSwitchSheet(activedSheetId, function(){
                if(callback){
                    callback.call(scope, hd);
                }
            }, this);
        }, this);
    },
        
    /**
     * _public
     * copy the passed tab
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetTabId: id of the sheet tab to copy
     * @param {String} newName: the new name for the copied sheet
     * @param {Function} callback: the callback function which will be called after the tab is updated
     * @param {Object} scope: the scope for the callback function
     */
    copySheetTab : function(hd, sheetTabId, newName, callback, scope){
        var sheet = hd.sheet, store = hd.store;
        return store.copySheet(sheetTabId, newName, function(newSheet){
            if(callback){
                callback.call(scope, newSheet.id, hd);
            }
        }, this);
    },
	
	/**
     * _public
     * Show or hide gridline
     * @param {Object} hd: the sheet app handle
	 * @param {Boolean} hideLine: true means hide gridline.     
     * @param {Integer} sheetId: the id of the sheet to toggle the grid line, if not defined then use the actived sheet
     */
	toggleGridLine : function(hd, hideLine, sheetId) {
		var sheet = hd.sheet;
		if (hideLine) {
            sheet.hideGridLine(undefined, sheetId);
        }else{
            sheet.showGridLine(undefined, sheetId);
        }      
	},
           
    /**
     * _public
     * get the cell by sheetId, rowIndex and colIndex
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetId: the sheet id of the cell, if undefined then use the actived sheet id as default
     * @param {Integer} rowIndex: the row index of the cell
     * @param {Integer} colIndex: the column index of the cell
     */
    getCell : function(hd, sheetId, rowIndex, colIndex) {
        var sheet = hd.sheet;
        if(!Ext.isDefined(sheetId)){
            sheetId = sheet.getSheetId();
	    }
        return sheet.getCellData(sheetId, rowIndex, colIndex);
    },
    
    /**
     * _public
     * get the cell by sheetId, rowIndex and colIndex - not need process the format
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetId: the sheet id of the cell, if undefined then use the actived sheet id as default
     * @param {Integer} rowIndex: the row index of the cell
     * @param {Integer} colIndex: the column index of the cell
     */ 
    getCellValue : function(hd, sheetId, rowIndex, colIndex) {
        var sheet = hd.sheet;
        if(!Ext.isDefined(sheetId)){
            sheetId = sheet.getSheetId();
	    }
        return sheet.getCellValue(sheetId, rowIndex, colIndex);
    },
	
    /**
     * _public
     * insert floating item
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetTabId: id of the sheet tab to insert the floating item
     * @param {Object} config: config of the floating item to insert
     * @param {Function} callback: the callback function which will be called after the tab is updated
     * @param {Object} scope: the scope for the callback function
     */
    insertFloatingItem : function(hd, sheetTabId, config, callback, scope){
        var sheet = hd.sheet, store = hd.store;
        if(!Ext.isDefined(sheetTabId)){
            sheetTabId = store.getActivedSheetId();
        }
        var ftype = config.ftype;
        delete(config.ftype);
        if('wedgit' === ftype){
            var url = config.url;
            delete(config.url);
            sheet.createWedgit(url, Ext.apply({
                sheetId: sheetTabId
            }, config));
        }else if('picture' === ftype){
            var url = config.url;
            delete(config.url);
            sheet.createPicture(url, Ext.apply({
                sheetId: sheetTabId
            }, config));
        }else if('chart' === ftype){
           var source = config.source;
           config.sheetId = sheetTabId;
           source.seriesPosition = config.seriesPosition;
           source.cacheFields = SCOM.copy(source.cacheFields);
           sheet.prepareSource(source);
           var rangeStore = sheet.createRangeStore(source);
           sheet.createChart(config.chartType, rangeStore, config, true, true);
        }
        sheet.refreshFloor();
    },
    
    /**
     * action to update floating in the sheet tab.
     * @param {Object} hd: the sheet app handle
     * @param {Object} floatings: the floatings item to be inserted.
     *                 Ex: [{sheet: _sheetId, name:"merge1", ftype:"meg", json:"[1,3,1,6]"}]
     * @param {Function} callback: the callback function which will be called after the tab is updated
     * @param {Object} scope: the scope for the callback function
     */
    updateFloatings : function(hd, floatings, callback, scope) {
    	var sheet = hd.sheet, store = hd.store;        
        var len = floatings.length;
        for(var i = 0; i < len; i++){
            var data = floatings[i], ftype = data.ftype, sheetId = parseInt(data.sheet);
            
        	// check whether this is merge 
            if (ftype === "meg") {  
            	var span = data.json;
            	if (typeof span === 'string' || span instanceof String) span = Ext.decode(span);
            	span = [sheetId].concat(span);
            	sheet.mergeCellForSpan(span, false, false);
            }
        }
        sheet.refresh();
        
        if(callback){
             callback.call(scope, false);
         }
    },
           
    /**
     * _public
     * add dropdown store
     * @param {Object} hd: the sheet app handle
     * @param {String} storeName: the dropdown store name
     * @param {Object} config: the config obj for the dropdown store
     * @param {Function} callback: the callback function which will be called after add this dropdown store
     *  callback(success), the param passed to callback is a flag for whether the dropdown store is add successfully
     * @param {Object} scope: the scope for the callback function
     */
    addDropdownStore : function(hd, storeName, config, callback, scope){
        var sheet = hd.sheet;
        sheet.addDropdownStore(storeName, config, callback, scope);
    },
    
    /**
     * _public
     * get file name
     * @param {Object} hd: the sheet app handle
     */
    getFilename : function(hd) {
    	var store = hd.sheet.getStore();
    	return store.getLoadedFileName();
    },
    
     /**
     * _public
     * toggle freeze
     * @param {Object} hd: the sheet app handle
     * 
     */
    toggleFreeze : function(hd) {
    	var ss = hd.sheet;
    	if (ss.isFreezed()) ss.unfreeze();
    	else {
    		var sm = ss.getSelectionModel();
			var pos = sm.getMinMaxPos();
			ss.freeze(pos.minrow, pos.mincol);
			return ss.freezePos;
    	}
    },
    
    /**
     * _public
     * insert row
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetId: the identified sheet tab
     * @param {Integer} row: the place to insert new row
     * @param {Integer} rowSpan: the new row number to be inserted
     */
    insertRow : function(hd, sheetId, row, rowSpan) {
    	var sheet = hd.sheet, store = sheet.getStore();
    	var insertedRowNo = 1;
    	if (rowSpan && rowSpan > 1) insertedRowNo = rowSpan;
		store.insertRow(sheetId, row, insertedRowNo);
		if(Ext.isFunction(sheet.refreshFocus)){
			sheet.refreshFocus();
		}		
    },
    
    /**
     * _public
     * insert column
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetId: the identified sheet tab
     * @param {Integer} row: the place to insert new row
     * @param {Integer} column: the new row number to be inserted
     */
    insertColumn : function(hd, sheetId, column, colSpan) {
    	var sheet = hd.sheet, store = sheet.getStore();
    	var insertedColNo = 1;
    	if (colSpan && colSpan > 1) insertedColNo = colSpan;
		store.insertColumn(sheetId, column, insertedColNo);
		if(Ext.isFunction(sheet.refreshFocus)){
			sheet.refreshFocus();
		}		
    },
    
    /**
     * _public
     * freeze sheet
     * @param {Object} hd: the sheet app handle
     * @param {Integer} row
     * @param {Integer} column
     */
    freezeSheet : function(hd, row, column) {
    	var ss = hd.sheet;
    	if (ss.isFreezed()) ss.unfreeze();    	
		ss.freeze(row+1, column+1);
		return ss.freezePos;
    },
    
    /**
     * @ Depreciated
     * 
     * Try to use applyCellsBorder method for better parameters
     * 
     * this method will be used to apply border condition to the cells
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetId: id of the sheet tab to insert the floating item
     * @param {Integer} startRow
     * @param {Integer} startCol
     * @param {Integer} endRow
     * @param {Integer} endCol
     * @param {String} position: 'outside', 'all', 'top', 'bottom', 'left', 'right', 'topbottom'
     * @param {String} color: red, blue etc 
     * @param {Integer} width: 1 or 2, default is 1
     * @param {String} lineType: dotted, dashed or solid (default is solid)
     */
    applyRangeBorder : function(hd, sheetId, startRow, startCol, endRow, endCol, position, color, width, lineType) {  
    	var sheet = hd.sheet;  	
    	var coord = [[sheetId, startRow, startCol, endRow, endCol]];		
		var range = new EnterpriseSheet.sheet.range.Range({
    		sheet: sheet,
    		coord: coord
    	});
		if (!width) width = 1;
		if (!lineType) lineType = 'solid';
		if (!color) color = 'black';
		range.setRangeBorder(position, color, width, lineType);
    },
    
     /**
     * this method will be used to apply border condition to the cells
     * @param {Object} hd: the sheet app handle
     * @param {Array} cood
     * @param {Object} conf
     *     position: 'outside', 'all', 'top', 'bottom', 'left', 'right', 'topbottom'
     *     color: red, blue etc 
     *     width: 1 or 2, default is 1
     *     lineType: dotted, dashed or solid (default is solid)
     */
    applyCellsBorder : function(hd, coord, conf) {  
    	var sheet = hd.sheet;  		
		var range = new EnterpriseSheet.sheet.range.Range({
    		sheet: sheet,
    		coord: coord
    	});
		
		var width = conf.width, lineType = conf.lineType, color = conf.color;
		if (!width) width = 1;
		if (!lineType) lineType = 'solid';
		if (!color) color = 'black';
		range.setRangeBorder(conf.position, color, width, lineType);
    },
    
    /**
     * action to clean cells border
     * @param {Object} hd: the sheet app handle
     * @param {Array} cood
     */
    clearCellsBorder : function(hd, coord) {  
    	var sheet = hd.sheet;  		
		var range = new EnterpriseSheet.sheet.range.Range({
    		sheet: sheet,
    		coord: coord
    	});
		
		range.setRangeBorder("all", "", 1, 'solid');
    },
    
    /**
     * this method will be used to apply table template to the cells
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetId: id of the sheet tab to insert the floating item
     * @param {Integer} startRow
     * @param {Integer} startCol
     * @param {Integer} endRow
     * @param {Integer} endCol
     * @param {String} tpl: tpl_0 --- tpl_59
     * @param {boolean} trigger: true or false to show / hide trigger
     */
    applyTableTpl : function(hd, sheetId, startRow, startCol, endRow, endCol, tpl, trigger) {  
    	var sheet = hd.sheet;  	
    	if (trigger == null) trigger = true;

    	var tpl = {id: tpl, span:[sheetId, startRow, startCol, endRow, endCol]};
    	var cellObjs = [];
    	for (var i=startRow; i<=endRow; i++) {
    		for (var j=startCol; j<=endCol; j++) {
    			if (trigger == false && i == startRow) 
    				cellObjs.push({sheet:sheetId, row:i, col:j, json:{tpl: Ext.encode(tpl), trigger: false}, applyWay:"apply"});
    			else 
    		        cellObjs.push({sheet:sheetId, row:i, col:j, json:{tpl: Ext.encode(tpl)}, applyWay:"apply"});	
    		}
    	}
    	
    	this.updateCells(hd, cellObjs);
    },
    
    /**
     * Method to clean the table template
     */
    clearTableTpl : function(hd, span){
    	var sheet = hd.sheet;  
		var tableTpl = sheet.getTableTpl();
		if(tableTpl){		
			tableTpl.clearTplForSpan(span);
		}		
	},
    
    setWholeRowHeight : function(hd, height) {
    	var sheet = hd.sheet, pos = {minrow: 0};
    	sheet.setRowHeight(height, pos);
    },
    
    /**
     *  _private
     */
    reportServerError : function(serverFailure){
        if(!SCONFIG['NOT_REPORT_ERROR2SERVER']){
        	if(!this.errorReportWin){
                this.errorReportWin = Ext.create('EnterpriseSheet.sheet.pop.ErrorReportWin', {
                    reportCallback : {
                        fn: function(comment){
                        	Ext.Ajax.request({
                                url: SCONFIG.urls['createServerErrorReport'],
                                params: {
                                    action: serverFailure.action,
                                    params: Ext.encode(serverFailure.params),
                                    comment: comment
                                }
                            });
                        },
                        scope: this
                    }
                });
            }
            this.errorReportWin.show();            
        }
    },
           
    /**
     * _public
     * show the related sidebar button
     * @param {Object} hd: the sheet app handle
     * @param {String} btn: should be one of them:
     *              chart, cellStyle, tableStyle, search, picture, widget, condition    
     * @param {Function} callback: the callback function which will be called after show the chart sidebar
     *  callback(success), the param passed to callback is the sidebar reference
     * @param {Object} scope: the scope for the callback function
    */
    showSidebarBtnWin : function(hd, btn, callback, scope){
        var sidebar = hd.sidebar;
        if(sidebar){
        	if (btn == "chart") btn = sidebar.chartBtn;
        	else if (btn == "cellStyle") btn = sidebar.cellStyleBtn;
        	else if (btn == "tableStyle") btn = sidebar.tableStyleBtn;
        	else if (btn == "search") btn = sidebar.searchBtn;
        	else if (btn == "picture") btn = sidebar.pictureBtn;
        	else if (btn == "widget") btn = sidebar.wedgitBtn;
        	else if (btn == "condition") btn = sidebar.conditionStyleBtn;
        	
            sidebar.toggleOption(btn, undefined, function(){
                if(callback){
                    callback.call(scope, sidebar, hd);
                }
            });
        }
    },
           
    /**
     * _public
     * hide rows
     * @param {Object} hd: the sheet app handle
     * @param {Integer} startRow: the start row to show
     * @param {Integer} endRow: the end row to show
     * @param {Integer} sheetId: the identified sheet tab, if not defined, then use the current tab
     */
    showRow : function(hd, startRow, endRow, sheetId) {
        var sheet = hd.sheet, store = sheet.getStore();
        sheet.showRow({
            minrow: startRow,
            maxrow: endRow
        }, sheetId);
        if(Ext.isFunction(sheet.refreshFocus)){
        	sheet.refreshFocus();
        }        
    },
           
    /**
     * _public
     * hide rows
     * @param {Object} hd: the sheet app handle
     * @param {Integer} startRow: the start row to hide
     * @param {Integer} endRow: the end row to hide
     * @param {Integer} sheetId: the identified sheet tab, if not defined, then use the current tab
     */
    hideRow : function(hd, startRow, endRow, sheetId) {
        var sheet = hd.sheet, store = sheet.getStore();
        sheet.hideRow({
            minrow: startRow,
            maxrow: endRow
        }, sheetId);
        if(Ext.isFunction(sheet.refreshFocus)){
        	sheet.refreshFocus();
        }        
    },
           
    /**
     * _public
     * hide columns
     * @param {Object} hd: the sheet app handle
     * @param {Integer} startCol: the start col to hide
     * @param {Integer} endCol: the end col to hide
     * @param {Integer} sheetId: the identified sheet tab, if not defined, then use the current tab
     */
    hideColumn : function(hd, startCol, endCol, sheetId) {
        var sheet = hd.sheet, store = sheet.getStore();
        sheet.hideColumn({
            mincol: startCol,
            maxcol: endCol
        }, sheetId);
        if(Ext.isFunction(sheet.refreshFocus)){
        	sheet.refreshFocus();
        }        
    },
           
           
    /**
     * _public
     * hide columns
     * @param {Object} hd: the sheet app handle
     * @param {Integer} startCol: the start col to show
     * @param {Integer} endCol: the end col to show
     * @param {Integer} sheetId: the identified sheet tab, if not defined, then use the current tab
     */
    showColumn : function(hd, startCol, endCol, sheetId) {
        var sheet = hd.sheet, store = sheet.getStore();
        sheet.showColumn({
            mincol: startCol,
            maxcol: endCol
        }, sheetId);
        if(Ext.isFunction(sheet.refreshFocus)){
        	sheet.refreshFocus();
        }        
    },
           
    /**
     * _public
     * set condition
     * @param {Object} hd: the sheet app handle
     * @param {Array} coord: the coordinate array
     * @param {String} cdtName: the condition name
     * @param {Object} config: the config of condition
     */
    setCondition : function(hd, coord, cdtName, config) {
        var sheet = hd.sheet;
        var range = new EnterpriseSheet.sheet.range.Range({
            sheet: sheet,
            coord: coord
        });
        range.setCondition(cdtName, config);
        sheet.refreshFocus();
    },

    /**
     * _public
     * clear condition
     * @param {Object} hd: the sheet app handle
     * @param {Array} coord: the coordinate array
     */
    clearCondition : function(hd, coord) {
        var sheet = hd.sheet;
        var range = new EnterpriseSheet.sheet.range.Range({
            sheet: sheet,
            coord: coord
        });
        range.clearCondition();
        sheet.refreshFocus();
    },
           
    /**
     * _public
     * update groups
     * @param {Object} hd: the sheet app handle
     * @param {Array} groups: the group array
     */
    updateGroups : function(hd, groups) {
        var sheet = hd.sheet;
        sheet.applyGroups(groups);
        sheet.refreshFocus();
    },
    
    /**
     * _public
     * cancel the first group in the selected area
     * @param {Object} hd: the sheet app handle
     * @param {String} dir: row or col
     * @param {String} start: start row or column
     * @param {String} end: end row or column
     */
    cancelGroup : function(hd, dir, start, end) {
        var sheet = hd.sheet;
        
        if( "col" == dir){
            sheet.updateColGroup("cancel", start, end);
		}else if("row" == dir){
            sheet.updateRowGroup("cancel", start, end);
		}
        
        sheet.refreshFocus();
    },
    
    /**
     * _public
     * Get a list of data on the selected range
     * @param {Object} hd: the sheet app handle
     */
    getSelectedRangeData : function(hd) {
    	var ss = hd.sheet, sm = ss.getSelectionModel(), pos = sm.getMinMaxPos();
    	var minX = pos.minrow, minY = pos.mincol, maxX = pos.maxrow, maxY = pos.maxcol;
    	var sheetId = ss.getSheetId();
    	
    	var result = [];
    	for (var i=minX; i<= maxX; i++) {
    		for (var j=minY; j<= maxY; j++) {
    			var cell = ss.getCellData(sheetId, i, j);
    			var cellObj = {row: i, col: j, val: cell.data};
    			result.push(cellObj);
    		}
    	}
    	
    	return result;
    },
    
    
    /**
     * _public
     * Get a list of cell comments information for the file
     * @param {Object} hd: the sheet app handle
     * @param {Integer} sheetId: the identified sheet tab, if not defined, then use the current tab
     */
    getCellsComment : function(hd, sheetId) {
    	var sheet = hd.sheet, store = hd.store, result = [];
    	
    	if (sheetId == null) sheetId = sheet.getSheetId(); 
    	
    	var coord = [[sheetId, 0, 0, 0, 0]];
    	store.walkRange(coord, function(rd){
			var row = rd.data.row, col = rd.data.col, currentSheetId = rd.data.sheet;
			if(0 !== row && 0 !== col && rd.data.json.comment) {	
				// calculate cell result if it is formula
				var cell = store.getCellData(sheetId, row, col), data = cell.data;
				if(cell.comment){
					if (rd.data.json.cal) {
						cell = SHEET_API.getCellValue(SHEET_API_HD, sheetId, row, col);
						data = cell.data;
					}
					
					var cellObj = {sheetId: sheetId, x: row, y: col, comment: cell.comment, result: data};
	    			result.push(cellObj);
				}				
			}
		}, this);
    	
    	return result;
    },

    /**
     * _public
     * set value to the variable
     * @param {Object} hd: the sheet app handle
     * @param {Object} vnVals: an object contains all the variable values
     */
    setValueToVariable : function(hd, vnVals){
        var sheet = hd.sheet;
        //sheet.fireEvent('disablehistory', sheet);
        sheet.setValueToVariable(vnVals, true);        
        //sheet.fireEvent('enablehistory', sheet);
    },
           
    /**
     * _public
     * get all variable values
     * @param {Object} hd: the sheet app handle
     */
    getCellVariables : function(hd){
        var sheet = hd.sheet;
        return sheet.getCellVariables();
    },
    
    /**
     * _public
     * clear all variables
     * @param {Object} hd: the sheet app handle
     */
    clearAllVariables : function(hd){
        hd.sheet.clearAllVariables();
    },
           
    /**
     * _public
     * copy the range and paste to another range
     * @param {Object} hd: the sheet app handle
     * @param {Array} fromCoord: the coord to copy
     * @param {Array} toCoord: the coord to paste, if not define then use the selection coord
     * @param {String} pasteType: the paste type, can be one of "default", "data", "style" or "reverse", if empty then means "default"
     * @param {Boolean} cutFlag: true then will clear the copy coord after pasted
     */
    copyPasteRange : function(hd, fromCoord, toCoord, pasteType, cutFlag){
        var sheet = hd.sheet;
        sheet.pasteRange(fromCoord, toCoord, pasteType, cutFlag);        
    },       
    
    sortCellByAsc : function(hd, span) {
    	var sheet = hd.sheet;
    	sheet.checkSortSpan(span, null, "asc");
    },
    
    sortCellByDesc : function(hd, span) {
    	var sheet = hd.sheet;
    	sheet.checkSortSpan(span, null, "desc");
    },
    
    /**
     * _public
     * Check whether cell is merged or not
     * @param {Object} hd: the sheet app handle
     * @param {sheetId} sheetId: the sheet id
     * @param {Integer} row: the checked cell row
     * @param {Integer} col: the checked cell col
     */
    isMergedCell : function(hd, sheetId, row, col) {
    	var sheet = hd.sheet, store = hd.store;
    	var cell = store.getCell(sheetId, row, col);
    	return store.isMergedCell(cell, sheetId, row, col);
    },

    /**
     * _public
     * merge the cells in the passed coord span
     * @param {Object} hd: the sheet app handle
     * @param {Array} span: the coordinate span array, it would like [sheetId, minrow, mincol, maxrow, maxcol],
     * @param {boolean} suspendEvent: true to not fire event
     * @param {boolean} suspendRefresh: true to not refresh the cells
     */
    mergeCellForSpan : function(hd, span, suspendEvent, suspendRefresh) {
        var sheet = hd.sheet;
        sheet.mergeCellForSpan(span, suspendEvent, suspendRefresh);
    },
           
    /**
     * _public
     * delete the comment in the passed coord
     * @param {Object} hd: the sheet app handle
     * @param {Array} coord: the coordinate array
     * @param {boolean} suspendEvent: true to not fire event
     * @param {boolean} suspendRefresh: true to not refresh the cells
     */
    deleteCommentForCoord : function(hd, coord, suspendEvent, suspendRefresh) {
        var sheet = hd.sheet;
        sheet.deleteComment(coord, suspendEvent, suspendRefresh);
    },
     
    /**
     * _public
     * get the item (radio or checkbox) value by the passed name
     * @param {Object} hd: the sheet app handle
     * @param {String} name: item name
     */
    getItemValueByName : function(hd, name){
        var sheet = hd.sheet;
        return sheet.getItemValueByName(name);
    },
    
    setFocus : function(hd, row, col) {  	
    	var sm = hd.sheet.getSelectionModel();
    	sm.selectRange({row:row, col:col}, {row:row, col:col}, false);
		sm.setFocusCell(row, col, false);
    },
    
    setMaxRowNumber : function(maxRow) {
    	if (Ext.isNumber(Number(maxRow)) && maxRow > 20) SCONST.MAX_ROW_NUMBER = maxRow;
    },
    
    setMaxColNumber : function(maxCol) {
    	if (Ext.isNumber(Number(maxCol)) && maxCol > 5) SCONST.MAX_COLUMN_NUMBER = maxCol;
    },
    
    /**
     * _public
     * show or hide the column name for the passed sheet
     * @param {Object} hd: the sheet app handle
     * @param {integer} sheetId: the sheet id
     * @param {boolean} visible: true to show, false to hide
     */
    setColNameVisible : function(hd, sheetId, visible){
    	hd.sheet.setColNameVisible(visible, sheetId);
    },
    
    /**
     * _public
     * show or hide the row name for the passed sheet
     * @param {Object} hd: the sheet app handle
     * @param {integer} sheetId: the sheet id
     * @param {boolean} visible: true to show, false to hide
     */
    setRowNameVisible : function(hd, sheetId, visible){
    	hd.sheet.setRowNameVisible(visible, sheetId);
    },
    
    /**
     * _public
     * get the content of the passed defined name varible, 
     * it will be an array contains
     * [{
     * 		cal: 'sum(A1:B2)',
     * 		scope: 123, //the sheetId means this name apply to the sheet with id = 123
     * 		comment: 'something about this name varible' //the comment for this name varible
     * }, {
     * 		cal: 'count(B3:C5)',
     * 		//the scope is undefined, means this name apply to the document scope
     * 		comment: 'something about this name varible' //the comment for this name varible
     * }]
     * @param {Object} hd: the sheet app handle
     * @param {string} definedName: the defined name
     * @param {boolean} visible: true to show, false to hide
     */
    getDefinedNameContent : function(hd, definedName){
    	return hd.store.getDefinedNameContent(definedName);
    },
    
    /**
     * _public
     * show or hide the titlebar
     * @param {Object} hd: the sheet app handle
     * @param {string} visible: true to show, or hide     
     */
    toggleTitleBar : function(hd, visible){
    	var titleBar = hd.getTitlebar();
    	if(titleBar){
    		if(SCOM.isEmptyValue(visible)){
    			visible = !titleBar.isVisible();
    		}
    		if(true === visible){
    			titleBar.show();
    		}else if(false === visible){
    			titleBar.hide();
    		}
    		hd.getAppContainer().doLayout();
    	}
    },
    
    /**
     * _public
     * show or hide the toolbar
     * @param {Object} hd: the sheet app handle
     * @param {string} visible: true to show, or hide     
     */
    toggleToolBar : function(hd, visible){
    	var toolbar = hd.getToolbar();
    	if(toolbar){
    		if(SCOM.isEmptyValue(visible)){
    			visible = !toolbar.isVisible();
    		}
    		if(true === visible){
    			toolbar.show();
    		}else if(false === visible){
    			toolbar.hide();
    		}
    		hd.getAppContainer().doLayout();
    	}
    },
    
    /**
     * _public
     * add filter function to a list of span 
     * @param {Object} hd: the sheet app handle
     * @param {span} coord: the coordinate array [sheetId, x1, y1, x2, y2]
     * @param {Object} filterCdts: an object contains filterCdt for different columns, for example:
     * 
            	SHEET_API.addFilter2Span(SHEET_API_HD, [SHEET_API_HD.sheet.getSheetId(), 3, 6, 10, 8], {
            		6 : {
            			'type': 'match',
            			'values': ['apple', 'pear']
            		},
            		7 : {
            			'type': 'match',
            			'values': ['ole']
            		}
            	}, true);
            	
     * @param {boolean} persist: true to save the filter to backend or not
     */
    addFilter2Span : function(hd, span, filterCdts, persist) {
    	var sheet = hd.sheet, filter = sheet.getFilter();
    	filter.createFilterForSpan(span, false, filterCdts, !persist);
    },
    
    /**
     * _public
     * remove filter from sheet
     * @param {Object} hd: the sheet app handle
     * @param {integer} sheetId: the id of the sheet you want to remove filter                 
     * @param {boolean} persist: true to save the filter to backend or not
     * 
     * for example: SHEET_API.removeFilter(SHEET_API_HD, SHEET_API_HD.sheet.getSheetId(), true);
     */    
    removeFilter : function(hd, sheetId, persist) {
        var sheet = hd.sheet, filter = sheet.getFilter();
    	filter.cleanFilterForSheet(sheetId, false, !persist);
    },
    
    
    
    /**
     * _public
     * return range object with passed name
     * 
     * @param {Object} hd: the sheet app handle
     * @param {string} name: the name for the range object     
     * @param {Integer} scope: null or sheetId the range object 
     * @Result {Object}
     * 
     * o	Name of named range;
     * o	Range of addresses (e.g. 'Sheet1'!A3:B4);
     * o	Scope of named range; 
     *         - if it is null, this means in the whole document level.
     *         - otherwise, it return the specific sheet range with sheetId
     * o	Comment of named range; 
     *         - if it is null, return undefined
     * o	Set of cells belonging to the named range.
     */
    getDefinedNamedRange : function(hd, name, scope) {
    	var sheet = hd.sheet, store = hd.store;
		var nameRefObj = store.getNamedFuncConfigByName(name);
		var nameObj = null;
		if (nameRefObj && nameRefObj.ctype == "named_func") {		
			var nameRefJson = nameRefObj.json;
			var nameRefArr = Ext.decode(nameRefJson);
			
			var refPos = null;
			for(var i = 0, len = nameRefArr.length; i < len; i++) {
				var refScope = nameRefArr[i].scope;
				if ((refScope == null && scope == null) || refScope == scope) {
					refPos = i;
					break;
				}
			}
			
			if (refPos !== null) {
				var cells = this.getCellsByAddress(hd, nameRefArr[refPos].cal);
				nameObj = {
				    name: nameRefObj.name,
				    rangeOfAddress: nameRefArr[refPos].cal,
				    comment: nameRefArr[refPos].comment,
				    scopeSheetId: nameRefArr[refPos].scope,
				    cells: cells 
				}	
			}
		}

		return nameObj;
    },
    
    /**
     * _public
     * return the collection of all defined named ranges 
     * @param {Object} hd: the sheet app handle   
     * @return {Array}: Array of object 
     */
    getAllDefinedNamedRangeNames : function(hd) {
    	var sheet = hd.sheet, store = hd.store, funcs = [];
		var refList = store.getNamedFuncConfig();
		
		for(var i = 0, len = refList.length; i < len; i++){
			var it = refList[i], ctype = it.ctype;
            if('named_func' == ctype){
                var cal = it.json, scope, flag = true;
                
                try{
                    var jsonObj = Ext.decode(it.json);
                    if(!Ext.isArray(jsonObj)){
                        jsonObj = [jsonObj];
                    }
                    for(var k = 0, size = jsonObj.length; k < size; k++){
                        var jsonIt = jsonObj[k];
                        scope = jsonIt.scope;
                        cal = jsonIt.cal;
                        funcs.push({
                            id: it.id,
                            name: it.name,
                            scopeSheetId: (!Ext.isDefined(scope)) ? null : Number(scope),
                            rangeOfAddress: cal,
                            comment: jsonIt.comment
                        });
                    }
                }catch(e){
                    funcs.push({
                        id: it.id,
                        name: it.name,
                        scopeSheetId: (!Ext.isDefined(scope)) ? null : Number(scope),
                        rangeOfAddress: cal
                    });
                }
            }
		}
		
		return funcs;
    },
    
    /**
     * _public
     * creates new named range based on the specified named range objects. 
     * The object must have the same structure as defined above; The cells 
     * must be resolved automatically by ES;
     * 
     * @param {Object} hd: the sheet app handle  
     * @param {Object} nameRangeObj: name range object
     *     {
     *         name: 'TTTT', 
     *         rangeOfAddress: "'Sheet1'!$A$1:$A$2", 
     *         comment: "This is test", 
     *         scopeSheetId: 1235
     *     }
     *     If scopeSheetId is NOT appear, it is default to whole document level
     * 
     * @return {Object}: {result: true} OR
     *     {msg: "name already in use", result: false, errorcode: 3}
     * For errorcode: 1 - name is already used in formula
     *                2 - name is not valid, only accept a-zA-Z_
     *                3 - range name already in used
     */
    createNamedRange : function(hd, nameRangeObj) {
    	var sheet = hd.sheet, store = hd.store, calculate = sheet.calculate, 
    	    name = nameRangeObj.name, scopeSheetId = nameRangeObj.scopeSheetId;
    	var result = {result: true};
    	
    	// first check name is right format...
    	var cals = calculate.calculates;
    	var upper = name.toUpperCase();
		var lower = name.toLowerCase();
		if(cals[upper] || cals[lower]){
			return {msg: "name is pre-defined as formula name", result: false, errorcode: 1};
		}else{						
			if(-1 != upper.indexOf(' ') || 0 < EnterpriseSheet.sheet.calculate.Coordinate.prototype.string2Coord(upper).length
					|| Ext.isNumber(Number(upper)) || !(/^[a-zA-Z_]/.test(upper)) ){
				return {msg: "name is not valid", result: false, errorcode: 2};
			}
		}
		
		var result = store.isNameFnExistWithNameScope(name, scopeSheetId); 	  	
    	if (!result) {    		
    		sheet.updateNamedFunc(
    			name, 
    			nameRangeObj.rangeOfAddress, 
    			nameRangeObj.scopeSheetId, 
    			nameRangeObj.comment
    		);	
    	} else {
    		return {msg: "name already in use", result: false, errorcode: 3};
    	}
    	
    	return result;
    },
    
    /**
     * _public
     * deletes named range by name.
     * @param {Object} hd: the sheet app handle
     * @param {string} name: the name for the range object  
     * @param {string} scope sheet id: the scope (sheet id) for this range object
     *       scope is option, if it is null, only name mgr in the document level will be deleted.
     *       Otherwise, it will delete the name under this scope
     * @return {boolean}: true or false
     */
    deleteNamedRangeByName : function(hd, name, scope) {
    	var sheet = hd.sheet, store = hd.store;
		var nameRefObj = store.getNamedFuncConfigByName(name);
		var result = false;
		if (nameRefObj && nameRefObj.ctype == "named_func") {	
			sheet.deleteNamedFunc(name, scope);
			result = true;
		}	
		
		return result;
    },
    
    /**
     * _public
     * Get a list of cells based on address: "'Sheet1'!$A$1:$A$2", 
     * @param {Object} hd: the sheet app handle
     * @param {string} address:  'Sheet1'!$A$1:$A$2 
     * @return {Array}: A list of cell objects 
     */
    getCellsByAddress : function(hd, address) {
    	var sheet = hd.sheet, store = hd.store, cells = [];
    	var coord = EnterpriseSheet.pure.sheet.calculate.Coordinate.prototype.string2Coord(address);
    	if(coord && 0 < coord.length){
			coord = coord[0].span, sheetId = null;
			if(!Ext.isNumber(coord[0])){
				sheetId = store.getSheetIdByName(coord[0]);
				if(SCOM.nullOrUndefined(sheetId)){
					return cells;
				}
			}
			
			// loop cells ...
			for (var i=coord[1]; i<= coord[3]; i++) {
	    		for (var j=coord[2]; j<= coord[4]; j++) {
	    			var cell = sheet.getCellData(sheetId, i, j);
	    			var cellObj = {sheetId: sheetId, row: i, col: j, val: cell.data};
	    			cells.push(cellObj);
	    		}
	    	}
		}
    	
    	return cells;
    },
    
    // ==========================================================================================
    // Start to add new API required from BP
    // ==========================================================================================
    
    /**
     * _public
     * Add undo action 
     * @param {Object} hd: the sheet app handle
     */
    undo : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
    	sheet.fireEvent('undo', false);
    },
    
    /**
     * _public
     * Add redo action 
     * @param {Object} hd: the sheet app handle
     */
    redo : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
    	sheet.fireEvent('redo', false);
    },
    
    /**
	 * _public
     * Reset the history for undo/redo in some case.
     * @param {Object} hd: the sheet app handle
	 */
	resetHistory : function(hd) {
		var sheet = hd.sheet, store = hd.store;
		sheet.fireEvent('resethistory', sheet);
	},
	
	/**
	 * _public
     * Get all changes in the history. Return a list of object.
     * Each object includes one of the following field:
     * 
     *     text -- Change Description
     * 
     * @param {Object} hd: the sheet app handle
	 */
	getAllChanges : function(hd) {
		var toolbar = hd.getToolbar();
		var history = toolbar.getHistory();
		return history.getStack();
	},
	
	/**
	 * _public
     * Purge the changes in the history. Need pass the steps 
     * which will be purged. Max step is 20
     * 
     * @param {Object} hd: the sheet app handle
     * @param {Integer} step: the back steps to be purged. 
     *                        Between 1 - 20, default is 1
	 */
	purgeChangeList : function(hd, step) {
		if (step == null || step < 1) step = 1;
		else if (step > 20) step = 20;
		
		var sheet = hd.sheet, store = hd.store;
		for (var i=0; i<step; i++) {
    	    sheet.fireEvent('undo', false);
		}
	},
	
	/**
	 * _public
     * Redo the changes in the history. Need pass the steps 
     * which will be purged. Max step is 20
     * 
     * @param {Object} hd: the sheet app handle
     * @param {Integer} step: the back steps to be redo. 
     *                        Between 1 - 20, default is 1
	 */
	redoChange : function(hd, step) {
		if (step == null || step < 1) step = 1;
		else if (step > 20) step = 20;
		
		var sheet = hd.sheet, store = hd.store;
		for (var i=0; i<step; i++) {
    	    sheet.fireEvent('redo', false);
		}
	},
    
    /**
     * _public
     * Add cut action 
     * @param {Object} hd: the sheet app handle
     */
    cut : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
        var clipboard = sheet.getClipboard();
		if (clipboard) {
			clipboard.cut();
		}
    },
    
    /**
     * _public
     * Add copy action 
     * @param {Object} hd: the sheet app handle
     */
    copy : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
    	var clipboard = sheet.getClipboard();
		if (clipboard) {
			clipboard.copy();
		}
    },
    
    /**
     * _public
     * Add paste action 
     * @param {Object} hd: the sheet app handle
     */
    paste : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
    	var clipboard = sheet.getClipboard();
		if (clipboard) {
			clipboard.paste();
		}
    },
    
    /**
     * _public
     * Make the selected cell text become bold or un-bold 
     * @param {Object} hd: the sheet app handle
     */
    bold : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
    	var data = sheet.getFocusCellData();
		var flag = 'bold' != data.fw;	
		if (false !== sheet.fireEvent('cmd', 'bold', flag, sheet)) {
			if (flag) {
				sheet.setPropertyForSelection({
					'fw' : 'bold'
				});
			} else {
				sheet.setPropertyForSelection({
					'fw' : ''
				});
			}
		}
    },
    
    /**
     * _public
     * Make the selected cell text become italic or un-italic 
     * @param {Object} hd: the sheet app handle
     */
    italic : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
    	var data = sheet.getFocusCellData();
		var flag = 'italic' != data.fs;
    	if (false !== sheet.fireEvent('cmd', 'italic', flag, sheet)) {
			if (flag) {
				sheet.setPropertyForSelection({
					'fs' : 'italic'
				});
			} else {
				sheet.setPropertyForSelection({
					'fs' : ''
				});
			}
		}
    },
    
    /**
     * _public
     * Make the selected cell text become underline or un-underline 
     * @param {Object} hd: the sheet app handle
     */
    underline : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
    	var data = sheet.getFocusCellData();
		var flag = 'underline' != data.u;
		if (false !== sheet.fireEvent('cmd', 'underline', flag, sheet)) {
			if (flag) {
				sheet.setPropertyForSelection({
					'u' : 'underline'
				});
			} else {
				sheet.setPropertyForSelection({
					'u' : ''
				});
			}
		}
    },
    
    /**
     * _public
     * Make the selected cell text become strikeline or un-strikeline
     * @param {Object} hd: the sheet app handle
     */
    strikeline : function(hd) {
    	var sheet = hd.sheet, store = hd.store;
    	var data = sheet.getFocusCellData();
		var flag = 'line-through' != data.u;
		if (false !== sheet.fireEvent('cmd', 'strikethrough', flag, sheet)) {
			if (flag) {
				sheet.setPropertyForSelection({
					's' : 'line-through'
				});
			} else {
				sheet.setPropertyForSelection({
					's' : ''
				});
			}
		}
    },
    
    /**
     * _public
     * Set the selected cell text fontFamily
     * @param {Object} hd: the sheet app handle
     * @param ff:fontFamily
     */
    fontFamily : function(hd, ff) {
    	var sheet = hd.sheet, store = hd.store;
		var editor = sheet.editor;
		if(editor && editor.isVisible()){
			editor.focus();				
		}			
		ff = ff || 'Arial';
		if(false !== sheet.fireEvent('cmd', 'fontName', ff, sheet)){
			sheet.setPropertyForSelection({
				ff:ff
			});					
		}
    },
    
    /**
     * _public
     * Set the selected cell text fontSize
     * @param {Object} hd: the sheet app handle
     * @param fz:fontSize
     */
    fontSize : function(hd, fz) {
    	var sheet = hd.sheet, store = hd.store;
		var editor = sheet.editor;
		if(editor && editor.isVisible()){
			editor.focus();				
		}
		fz = fz || '10';
		if(false !== sheet.fireEvent('cmd', 'fontSize', fz, sheet)){				
			sheet.setPropertyForSelection({
				fz: fz
			});
		}
    },
    
    /**
     * _public
     * Set the selected cell text background color
     * @param {Object} hd: the sheet app handle
     * @param color: font color
     */
    fillBackgroundColor : function(hd, color) {
    	var sheet = hd.sheet, store = hd.store;
    	sheet.setPropertyForSelection({
			bgc:color || ''
		});	
    },
    
    /**
     * _public
     * Set the selected cell text font color
     * @param {Object} hd: the sheet app handle
     * @param color: font color
     */
    fontColor : function(hd, color) {
    	var sheet = hd.sheet, store = hd.store;
		var editor = sheet.editor;
		if(editor && editor.isVisible()){
			editor.focus();				
		}
		var fc = color;
		if(false !== sheet.fireEvent('cmd', 'forecolor', fc, sheet)){
			sheet.setPropertyForSelection({
				color:fc
			});
		}
    },
    
    /**
     * _public
     * Increase the selected cell text size
     * @param {Object} hd: the sheet app handle
     */
    incFontSize : function(hd) {
		var sheet = hd.sheet, store = hd.getStore();
		var data = sheet.getFocusCellData();
		var fz = parseInt(data.fz);
		if(!Ext.isNumber(fz)){
			fz = store.defaultFontSize;
		}
		fz += 2;
				
		sheet.setPropertyForSelection({
			fz : fz
		});
	},

	/**
     * _public
     * Decrease the selected cell text size 
     * @param {Object} hd: the sheet app handle
     */
	desFontSize : function(hd) {
		var sheet = hd.sheet, store = hd.getStore();
		var data = sheet.getFocusCellData();
		var fz = parseInt(data.fz);
		if(!Ext.isNumber(fz)){
			fz = store.defaultFontSize;
		}
		if (fz-2 > store.minFontSize) {
			fz -= 2;
		} else {
			fz = store.minFontSize;
		}
		sheet.setPropertyForSelection({
			fz : fz
		});
	},
	
	/**
     * _public
     * Set the selected cell text align
     * @param {Object} hd: the sheet app handle
     * @param dir: the direction of the content(left,middle,right,top,center,bottom)
     */
	alignSet : function(hd, dir) {
		var sheet = hd.sheet, store = hd.getStore();
		sheet.setPropertyForSelection({
			'ta' : dir || 'left'
		});
	},
	
	/**
	 * _public
	 * this function provide a interface to set a border for the selection range
	 * @param {Object} hd: the sheet app handle
	 * @param {string} dir: the direction of the border, such as: top, bottom, left, right, topbottom, outside,all
	 * @param {string} color: the color of the border
	 * @param {int} width: the width of the border
	 * @param {string} style: The line style of the border. Such as: solid, double, dotted, dashed
	 * @param {boolean} suspendRefresh: a flag to suspend the refresh action
	 */
	setRangeBorder : function(hd, dir, color, width, style, suspendRefresh){
		var sheet = hd.sheet, store = hd.getStore();
		dir = dir || 'all';
		if(false == SCOM.typeOf(color)){
			color = 'black';
		}
		
		if(false == SCOM.typeOf(width)){
			width = 1;
		}
		
		sheet.setRangeBorder(dir, color, width, style, suspendRefresh);		
	},

	/**
     * _public
     * Set the selected cell text wrap
     * @param {Object} hd: the sheet app handle
     */
	wordWrap : function(hd) {
		var sheet = hd.getSheet(), store = hd.getStore();
		var data = sheet.getFocusCellData();
		var ws = 'nowrap', ww = 'normal';
		if (!data.ws || data.ws == ws) {
			ws = 'normal';
			ww = 'break-word';
		}
		sheet.setPropertyForSelection({
			ws : ws,
			ww : ww
		});
	},
	
	/**
     * _public
     * Set the selected cell text rotate with angle
     * @param {Object} hd: the sheet app handle
     * @param angle: the rotate angle, 45, 90, 270, 315
     */
	rotateText : function(hd, angle) {
		var sheet = hd.sheet, store = hd.getStore();
		var data = sheet.getFocusCellData();
		var flag = angle != data.rotation;
		if (false !== sheet.fireEvent('cmd', 'rotation', flag, sheet)) {
			if (flag) {
				sheet.setPropertyForSelection({
					'rotation' : angle
				});
			} else {
				sheet.setPropertyForSelection({
					'rotation' : ''
				});
			}
		}
	},
	
	/**
     * _public
     * Merge the selected cells
     * @param {Object} hd: the sheet app handle
     */
	mergeCell : function(hd) {
		hd.sheet.mergeSelectedCell();
	},

	/**
     * _public
     * Merge cells in column level
     * @param {Object} hd: the sheet app handle
     */
	mergeCellInColumn : function(hd) {
		hd.sheet.mergeCellInColumn();
	},

	/**
     * _public
     * Merge cells in row level
     * @param {Object} hd: the sheet app handle
     */
	mergeCellInRow : function(hd) {
		hd.sheet.mergeCellInRow();
	},

	/**
     * _public
     * Cancel merge cells
     * @param {Object} hd: the sheet app handle
     */
	cancelMergeCell : function(hd) {
		hd.sheet.cancelMergeCell();
	},
	
	/**
	 * _public
     * move the decimal point to left or right
     * @param {Object} hd: the sheet app handle
	 * @param num: the number of decimal need move, positive is left, negative is right
	 */
	moveDecimalPoint : function(hd, num) {
		hd.sheet.moveDecimalPoint(num);
	},
	
	
	
	/**
	 * _public
     * Hide or show the column name (toggle)
     * @param {Object} hd: the sheet app handle
	 */
    toggleColumnName : function( hd ) {
        var sheet = hd.sheet, store = sheet.getStore();        
		if(!store.colNameHidden) {
			sheet.setColNameVisible(false);
		} else {
			sheet.setColNameVisible(true);
		}
    },
    
    /**
	 * _public
     * Hide or show the row name (toggle)
     * @param {Object} hd: the sheet app handle
	 */
    toggleRowName : function( hd ) {
        var sheet = hd.sheet, store = sheet.getStore();        
		if(!store.rowNameHidden) {
			sheet.setRowNameVisible(false);
		} else {
			sheet.setRowNameVisible(true);
		}
    },
    
    /**
     * _public
     * Zoom the selected sheet with passed zoom size
     * @param {Object} hd: the sheet app handle
     * @param {Integer} zoom: the size to be zoomed, such as 2, 1, 0.5, 0.25
	 */
    zoom : function( hd, zoom ) {
        var sheet = hd.sheet, store = sheet.getStore();        
		sheet.changeZoom(zoom);
    },

    /**
	 * _public
     * Add currency format to the selected cell range
     * @param {Object} hd: the sheet app handle
     * @param currencyName: format currency name
     * @param decimalNo: decimal no
     * @param negativeFormat: whether format is applied if it is negative number
     * @param showName: default is false. True means use currency name instead of money symbol
	 */
    currencyFormat : function(hd, currencyName, decimalNo, negativeFormat, showName) {
		var name = SCONST.money_code[currencyName];
		if (showName) {
			name = currencyName.toUpperCase();
		}
		
		currencyName = currencyName || SCONFIG.default_currency;
		decimalNo = decimalNo || "2";
		negativeFormat = negativeFormat || "none";

		var format = "money|" + name + "|" + decimalNo + "|" + negativeFormat;
		
		if (format) {
			hd.sheet.setTextFormatForSelection(format);
		}
    },
	
    /**
	 * _public
     * Add currency format to the selected cell range
     * @param {Object} hd: the sheet app handle
     * @param currencyName: format currency name - option
	 */
    currencyFormatWin : function(hd, currencyName) {
    	var sheet = hd.sheet, store = hd.getStore();
		var openMoneyWin = Ext.create("EnterpriseSheet.sheet.pop.money.MoneySelectWin", {});
		openMoneyWin.bindSheet(sheet);
	
        if (currencyName) openMoneyWin.popup(currencyName);
        else openMoneyWin.popup();
	},
	
	/**
	 * _public
	 * Add number format to the selected cells
     * @param {Object} hd: the sheet app handle
     * @param fm: DEFAULT_COMMA_FORMAT is '#,000.00'
	 */
	numberFormat : function(hd, fm) {
		fm = fm || SCONST.DEFAULT_COMMA_FORMAT;
		hd.sheet.setNumberFormatForSelection(fm);
	},
	
	/**
	 * _public
	 * Add locale format to the selected cells
     * @param {Object} hd: the sheet app handle
     * @param locale: en_US -- USA
     *                de-DE -- German
     *                en-IN -- Indian
     *                ar-EG -- Arabic
     *                zh-Hans-CN-u-nu-hanidec -- China
     * @param options 
     *     { style: 'currency', currency: 'JPY' }
     *     { style: 'currency', currency: 'EUR' }
     *     { style: 'currency', currency: 'EUR', maximumSignificantDigits: 4 }
	 */
	localeFormat : function(hd, locale, options) {
		locale = locale || SCONFIG.default_locale;
		hd.sheet.setLocaleFormatForSelection(locale, options);
	},
	
	/**
	 * _public
     * Apply percent format to the selected cells
     * @param {Object} hd: the sheet app handle
     * @param fm: DEFAULT_PERCENT_FORMAT or NO_DECIMAL_PERCENT_FORMAT
	 */
	percentFormat : function(hd, fm) {
		fm = fm || SCONST.DEFAULT_PERCENT_FORMAT;
		hd.sheet.setPercentFormatForSelection(fm);
	},

	/**
	 * _public
     * Apply comma format to the selected cells
     * @param {Object} hd: the sheet app handle
	 */
	commaFormat : function(hd) {
		hd.sheet.setTextFormatForSelection(SCONST.FORMAT_COMMA);
	},
	
	/**
	 * _public
     * Apply science format to the selected cells
     * @param {Object} hd: the sheet app handle
	 */
	scienceFormat : function(hd) {
		hd.sheet.setTextFormatForSelection(SCONST.FORMAT_SCIENCE);
	},
	
	/**
	 * _public
     * Apply date format to the selected cells
     * @param {Object} hd: the sheet app handle
     * @param fm:fm select from SCONST.jsDateFm
	 */
	dateFormat : function(hd, fm){
    	fm = fm || SCONST.jsDateFm[0];
    	hd.sheet.setDateFormatForSelection(fm);
    },
    
    /**
	 * _public
     * Apply time format to the selected cells
     * @param {Object} hd: the sheet app handle
     * @param fm:fm select from SCONST.jsTimeFm
	 */
    timeFormat : function(hd, fm){
    	fm = fm || SCONST.jsTimeFm[0];
    	hd.sheet.setTimeFormatForSelection(fm);
    },
    
    /**
	 * _public
     * Apply dataTime format to the selected cells
     * @param {Object} hd: the sheet app handle
     * @param fm:fm select from SCONST.jsDateTimeFm
	 */
    dateTimeFormat : function(hd, fm){
    	fm = fm || SCONST.jsDateTimeFm[0];
    	hd.sheet.setDateTimeFormatForSelection(fm);
    },
    
    /**
	 * _public
     * show insert background image panel
     * @param {Object} hd: the sheet app handle
	 */
    insertBackgroundImage : function(hd){
    	var backgroundWin = Ext.create("EnterpriseSheet.sheet.pop.BackgroundWin", {});
    	backgroundWin.popup();
    },
    
    /**
	 * _public
     * insert page break
     * @param {Object} hd: the sheet app handle
	 */
    insertPageBreak : function(hd){
    	hd.sheet.insertPageBreakAtFocus();
    },
    
    /**
	 * _public
     * delete page break
     * @param {Object} hd: the sheet app handle
	 */
    deletePageBreak : function(hd){
    	hd.sheet.deletePageBreakAtFocus();
    },
    
    /**
	 * _public
     * insert comment
     * @param {Object} hd: the sheet app handle
	 */
    insertComment : function(hd, scope){
		SPOP.showCommentBox({
			title: SLANG['insert_comment'],
			applyCallback : {
				fn : function(comment) {
					hd.sheet.insertComment(comment);
				},
				scope : scope
			}
		});	
	},
	
	/**
	 * _public
     * insert dropList
     * @param {Object} hd: the sheet app handle
	 */
	insertDropList : function(hd, scope){
        var ss = hd.sheet;
        SPOP.showDropListConfig({
            title: SLANG['setup_droplist'],
            fileId: ss.getStore().fileId,
            sheet: ss,
            applyCallback : {
                fn : function(json) {
                    ss.insertDropList(json);
                },
                scope : scope
            }
        });
	},
	
	/**
	 * _public
     * insert checkbox
     * @param {Object} hd: the sheet app handle
	 */
	insertCheckbox : function(hd){
		hd.sheet.setItemForSelection('checkbox', SCOM.genTimeStamp());
	},
	
	/**
	 * _public
     * insert radio
     * @param {Object} hd: the sheet app handle
	 */
	insertRadio : function(hd){
		hd.sheet.setItemForSelection('radio', SCOM.genTimeStamp());
	},
	
	/**
	 * _public
     * insert date picker
     * @param {Object} hd: the sheet app handle
	 */
	insertDatePicker : function(hd){
		hd.sheet.insertDropList({drop:'date'});
	},
	
	/**
	 * _public
     * clear checkbox / radio
     * @param {Object} hd: the sheet app handle
	 */
	clearItem : function(hd){
		hd.sheet.clearItemForSelection();
	},
	
	/**
	 * _public
     * Insert name range 
     * @param {Object} hd: the sheet app handle
	 */
	nameRange : function(hd){
		hd.sheet.markSelection();
	},
	
	/**
	 * _public
     * Insert hyperlink to the selected cell
     * @param {Object} hd: the sheet app handle
	 */
	insertHyperlink : function(hd, scope){
		var sheet = hd.sheet, store = hd.getStore();
		var sheetId = sheet.sheetId;		
		var sm = sheet.getSelectionModel();
		var focusCell = sm.getFocusCell();
		var row = focusCell.row, col = focusCell.col;
		
		SPOP.showLinkBox({
			sheet: hd.sheet,
			title: SLANG['insert_hyperlink'],
			width : 400,
			height : 150,
			applyCallback : {
				fn : function(url) {
					sheet.createHyperlink(url, sheetId, row, col);
				},
				scope : scope
			},
            urlValidator : function(val){
                if(SCONST['urlReg'].test(val)){
                    return true;
                }else if(EnterpriseSheet.sheet.calculate.Coordinate.prototype.isCoordSpan(val)){
                    return true;
                }else if('=' === val.charAt(0)){
                    val = val.slice(1);
                }
                return false;
			}
		});		
	},
	
	/**
	 * _public
     * get function
     * @param {Object} hd: the sheet app handle
	 */
	getFunction : function(hd, name) {
		Ext.Function.defer(function(){
            var ss = hd.sheet, editor = ss.editor;
            editor.setValue("="+name.toUpperCase()+"(");
            var region = ss.getCurrentRegion();
            var sm = region.getSelectionModel();
            var fc = sm.getFocusCell();
            editor.startEdit(fc.row, fc.col, region, null, false, true);
        }, 100, this);
	},
	
	/**
	 * _public
     * insert sum function
     * @param {Object} hd: the sheet app handle
	 */
	sum : function(hd) {		
		this.getFunction(hd, "sum");
	},

	/**
	 * _public
     * average function
     * @param {Object} hd: the sheet app handle
	 */
	average : function(hd) {
		this.getFunction(hd, "average");
	},

	/**
	 * _public
     * count function
     * @param {Object} hd: the sheet app handle
	 */
	count : function(hd) {
		this.getFunction(hd, "count");
	},

	/**
	 * _public
     * max function
     * @param {Object} hd: the sheet app handle
	 */
	maxValue : function(hd) {
		this.getFunction(hd, "max");
	},

	/**
	 * _public
     * min function
     * @param {Object} hd: the sheet app handle
	 */
	minValue : function(hd) {
		this.getFunction(hd, "min");
	},
	
	/**
	 * _public
     * Show insert formula window
     * @param {Object} hd: the sheet app handle
	 */
	insertFormula : function(hd) {
		var insertFormulaWin = Ext.create("EnterpriseSheet.sheet.pop.FormulaFunctionWin", {
			title: SLANG['insert_function'],
			closeAction: 'hide',
			spreadsheet: hd.sheet
		});
        insertFormulaWin.popup();
	},
	
	/**
	 * _public
     * Show validation
     * @param {Object} hd: the sheet app handle
	 */
	showValidation : function(hd){
        var sheet = hd.sheet, store = hd.getStore();
		var coord = sheet.getSelectionModel().selection2Coord();
		
		SPOP.showValidationBox({
			sheet: sheet,
			rangeValue: coord
		});
	},
	
	/**
	 * _public
     * delete repeat item
     * @param {Object} hd: the sheet app handle
	 */
	deleteRepeatItem : function(hd){
        hd.sheet.deleteRepeatItem();
	},
	
	/**
	 * _public
     * freeze or cancel
     * @param {Object} hd: the sheet app handle
	 */
	toggleFreeze : function(hd) {
        var sheet = hd.sheet, store = hd.getStore();
        var sm = sheet.getSelectionModel();
		var pos = sm.getMinMaxPos();
		if (!sheet.isFreezed()) {
			if (sheet.isSplited()) {
				var row = 1, col = 1;
				if (sheet.ulefter.isVisible()) {
					row = sheet.ulefter.rowEnd + 1;
				}
				if (ss.lheader.isVisible()) {
					col = sheet.lheader.colEnd + 1;
				}
				sheet.freeze(row, col);
			} else {
				sheet.freeze(pos.minrow, pos.mincol);
			}
		} else {
			sheet.unfreeze();
		}
	},
	
	/**
	 * _public
     * split or cancel
     * @param {Object} hd: the sheet app handle
	 */
	toggleSplit : function(hd) {
        var sheet = hd.sheet, store = hd.getStore();

		if (!sheet.isSplited()) {
			if (sheet.isFreezed()) {
				var w = 0, h = 0;
				if (sheet.ulefter.isVisible()) {
					h = sheet.ulefter.getHeight();
				}
				if (sheet.lheader.isVisible()) {
					w = sheet.lheader.getWidth();
				}
				sheet.split(w, h);				
			} else {
				var sm = sheet.getSelectionModel();
				var pos = sm.getMinMaxPos();
				var row = pos.minrow, col = pos.mincol;
				var rowStart = sheet.getRowStart(), colStart = sheet.getColStart();
				if (row > rowStart) {
					row--;
				}
				if (col > colStart) {
					col--;
				}
				var size = sheet.getCellPosition(row, col);
				sheet.split(size[0], size[1]);
			}
		} else {
			sheet.unsplit();
		}
	},
	
	/**
	 * _public
     * filter
     * @param {Object} hd: the sheet app handle
	 */
	filter : function(hd) {
        var sheet = hd.sheet, store = hd.getStore();
		var filter = sheet.getFilter();
		if (filter) {
			filter.createFilterForSelecton();
		}
		sheet.focus();
	},
	
	/**
	 * _public
     * lock editing of selection for all
     * @param {Object} hd: the sheet app handle
	 */
	toggleEditable : function(hd){
		var sheet = hd.sheet, store = hd.getStore();
		var data = sheet.getFocusCellData();
		if('ed' === data.dsd){
			sheet.setPropertyForSelection({
				'dsd': ''
			});
		}else{
			sheet.setPropertyForSelection({
				'dsd' : 'ed'
			});
		}		
		var sm = sheet.getSelectionModel();
		var focusCell = sm.getFocusCell();
		sheet.fireEvent('focuschange', focusCell.row, focusCell.col, sm);
	},
	
	/**
	 * _public
     * lock editing of selection for other
     * @param {Object} hd: the sheet app handle
	 */
	toggleEditableForOther : function(hd){
		var sheet = hd.sheet, store = hd.getStore();
		var data = sheet.getFocusCellData();
		var userId = store.getUserInfo().id;
		if(data.dsd && '['+userId+']' === data.dsd){
			sheet.setPropertyForSelection({
				'dsd': ''
			});
		}else{			
			sheet.setPropertyForSelection({
				'dsd' : Ext.encode([userId])
			});
		}		
		var sm = sheet.getSelectionModel();
		var focusCell = sm.getFocusCell();
		sheet.fireEvent('focuschange', focusCell.row, focusCell.col, sm);
	},
	
	/**
	 * _public
     * clean all
     * @param {Object} hd: the sheet app handle
	 */
	clean : function(hd) {
		hd.sheet.cleanSelection();
	},

	/**
	 * _public
     * clean content
     * @param {Object} hd: the sheet app handle
	 */
	cleanContent : function(hd) {
		hd.sheet.cleanSelection('content');
	},

	/**
	 * _public
     * clean style
     * @param {Object} hd: the sheet app handle
	 */
	cleanStyle : function(hd) {
		hd.sheet.cleanSelection('style');
	}   	
}, function(){
    
});
