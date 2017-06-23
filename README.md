### 表格控件


调用方式 
使用iframe
```js
1.
    /**
     * 初始化
     * @parameter
     * tf: 是否显示 横 || 纵条列、  A B C D  ||  1 2 3 4
     * g:  是否加载红色标记
     * s:  保存按钮
     */
$('#sheetFile')[0].contentWindow.ins_displaySheet(false,  false, false)



2.
    /**
     * 加载表格样式
     * @parameter
     * report:   reportID
     * perPage:  填写 15
     * label:    填写 false 或则 不填写
     */
$('#sheetFile')[0].contentWindow.ins_sheetPanel(_into, '15')

3.
    /**
     * 加载表格数据
     * @parameter
     * report: reportID
     * term:  阶段信息
     * code:  code
     */
$('#sheetFile')[0].contentWindow.ins_loadvalue(_into, ch.tl.termID, s_code)

```


###用户信息
`GetLocalStorage.js` 控制用户信息存放至- window.localStorage
`localStorage.js`  对象 L 存放对window对象的操作

####注意事项
1.
  用户信息需要通过localStorage.js中获取。
  具体请查看 localStorage.js 底部返回的 retunrObj。


  ###弹窗
  html:

  ```html
      <div class="al-popup-prompt">

        <div class="al-popup">

            <div class="al-closer">
                <span>提示：</span>
                <button class="al-closer-b"><img src="images/chart/icon_close@2x.png" alt=""></button>
            </div>
            <p class="al-prompt-informations"></p>
        </div>
    </div>
  ```

css:
   需要引用development.css文件， /css/development.css 文件夹中

js: 需要手动控制`al-popup-prompt`的隐藏与显示， 默认为隐藏。