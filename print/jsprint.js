document.write('<script language="JavaScript" src="print/html2canvas.js"></script>');
document.write('<script type="text/javascript" src="print/qrcode/jquery.qrcode.js"></script>');
document.write('<script type="text/javascript" src="print/qrcode/qrcode.js"></script>');
document.write('<canvas id="canvasPrint" style="display: none;"></canvas>');

function pirntArea(printAreaId) {
    var canvas = document.getElementById('canvasPrint');
    var area = document.getElementById(printAreaId);
    canvas.width = area.offsetWidth;
    canvas.height = area.offsetHeight;
    var left = area.style.left;
    var top = area.style.top;
    area.style.left = 0;
    area.style.top = 0;

    var newWindow = window.open('', '', 'width=1024,height=768');
    _improvePicQuality(canvas, 2);
    html2canvas(area, {canvas: canvas}).then(function (canvas) {
        var dataURL = canvas.toDataURL("image/png");
        newWindow.document.write('<img src="' + dataURL + '"/>');
        //qrcode
        var div = document.createElement('div');
        div.id = 'qrcode';
        div.style.position = 'absolute';
        div.style.right = 0;
        div.style.bottom = 0;
        div.style.zIndex = 1;
        document.body.appendChild(div);
        jQuery('#qrcode').qrcode("http://narwhalart.com");
        newWindow.document.body.appendChild(div);

        _addWartermark(newWindow, area.offsetWidth, area.offsetHeight);
        newWindow.print();
    });
    area = document.getElementById(printAreaId);
    area.style.left = left;
    area.style.top = top;
}

function _improvePicQuality(canvas, scale) {
    var width = canvas.width;
    var height = canvas.height;
    //要将 canvas 的宽高设置成容器宽高的 2 倍
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    var context = canvas.getContext("2d");
    //然后将画布缩放，将图像放大两倍画到画布上
    context.scale(scale, scale);
    canvas.width = width;
    canvas.height = height;
}

function _addWartermark(newWindow, width, height) {
    var div = newWindow.document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = 0;
    div.style.top = 0;
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    newWindow.document.body.appendChild(div);

    var conHeight = width;
    var conWidth = height;
    var num = Math.ceil(conHeight * conWidth / 132 / 108);
    for (i = 0; i < num; i++) {
        var img = newWindow.document.createElement('img');
        img.src = "print/watermark.png";
        div.appendChild(img);
    }
}