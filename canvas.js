(function (module) {
    Cym = {
        mousePressed: false,  //是否按下
        Rect: true, //是否是矩形
        lastX: 0,
        lastY: 0,
        arrCtx: [], //图层
        objX: 0,
        objY: 0,
        Num: 0,
        borderWidth: 3,
        borderColor: 'red',
        hei: $(window).height() -30
    }
 
    function borads() {
        this.render()
        this.InitThis();
        this.clickChange();
        this.banPull()
    }
    //渲染
    borads.prototype.render = function () {
        var html = ' <canvas id="myCanvas" width="' + $(window).width() + '" height="' + Cym.hei + '" style="position:absolute; left:0; top:0; z-index:998; display:none"></canvas>';
        $('#content').append(html);

        var buttom = '  <div style="position:absolute; left:0; bottom:0; z-index:999">'
           + ' <button type="button" id="open">打开画板</button>'
            + '<button type="button" id="close">关闭画板</button>'
            + '<button type="button" id="clear">清空画板</button>'
          + '  <button type="button" id="line">线性</button>'
            + '<button type="button" id="rect">矩形</button>'
           + ' <button type="button" id="back">撤销</button> </div>';
        $('body').append(buttom);

    }
    //浏览器禁止下拉
    borads.prototype.banPull = function () {
        document.addEventListener('touchmove', function (e) { e.preventDefault() }, false);
    }
    //初始化
    borads.prototype.InitThis = function () {
        var self = this;
       
        //控制事件的生效范围
        var Can = document.getElementById("myCanvas");
        //监听手机touch
        Can.addEventListener('touchstart', function (e) {
            Cym.mousePressed = true;
            Cym.Num++;
            var touch = e.touches[0];
            mouseX = touch.pageX;
            mouseY = touch.pageY;
            self.Draw(mouseX, mouseY, false, Cym.Rect);
            //相对路径
            Cym.objX = mouseX;
            Cym.objY = mouseY;
            self.creatRectJustShow();
        });
        Can.addEventListener('touchmove', function (e) {
            if (Cym.mousePressed) {
                var touch = e.touches[0];
                mouseX = touch.pageX;
                mouseY = touch.pageY;
                self.Draw(mouseX, mouseY, true, Cym.Rect);
            }
        });
        Can.addEventListener('touchend', function (e) {
            Cym.mousePressed = false;
        });

        //PC 端
        $(Can).mousedown(function (e) {
            Cym.mousePressed = true;
            Cym.Num++;
            self.Draw(e.pageX, e.pageY, false, Cym.Rect);
            //相对路径
            Cym.objX = e.pageX;
            Cym.objY = e.pageY;
            self.creatRectJustShow();
        })
        $(Can).mousemove(function (e) {
            if (Cym.mousePressed) {
                self.Draw(e.pageX, e.pageY, true, Cym.Rect);
            }
        });
        $(Can).mouseup(function (e) {
            Cym.mousePressed = false;
        });

    }

    borads.prototype.creatRectJustShow = function () {
        var newCanvas = ' <canvas id="myCanvas' + Cym.Num + '" class="addCanvas" width="' + $(window).width() + '" height="' + $(window).height() + '" style="position:absolute; left:0; top:0; z-index:1"></canvas>';
        $('#content').append(newCanvas);
    }
    //画板操作
    borads.prototype.Draw = function (x, y, isDown, isRect) {
        var self = this;
        if (isDown) {
            Cym.arrCtx[Cym.Num] = document.getElementById('myCanvas' + Cym.Num).getContext("2d");
            Cym.arrCtx[Cym.Num].beginPath();
            Cym.arrCtx[Cym.Num].strokeStyle = Cym.borderColor;
            Cym.arrCtx[Cym.Num].lineWidth = Cym.borderWidth;
            Cym.arrCtx[Cym.Num].lineJoin = "round";
            if (!isRect) {
                Cym.arrCtx[Cym.Num].moveTo(Cym.lastX, Cym.lastY);
                Cym.arrCtx[Cym.Num].lineTo(x, y);
            }
            else {
                Cym.arrCtx[Cym.Num].clearRect(0, 0, Cym.arrCtx[Cym.Num].canvas.width, Cym.arrCtx[Cym.Num].canvas.height);  //清除上次图形
                Cym.arrCtx[Cym.Num].rect(Cym.objX, Cym.objY, x - Cym.objX, y - Cym.objY); //创建新矩形图形

            }
            Cym.arrCtx[Cym.Num].closePath();
            Cym.arrCtx[Cym.Num].stroke();
        }

        Cym.lastX = x; Cym.lastY = y;
    }
    //清理除操作图层的 所有图层
    borads.prototype.clearArea = function () {
        $('.addCanvas').remove();
        Cym.arrCtx = [];
        Cym.Num = 0;
    }
    //点击事件
    borads.prototype.clickChange = function () {
        self = this
        $('#line').click(function () {
            Cym.Rect = false
        })
        $('#rect').click(function () {
            Cym.Rect = true
        })
        $('#clear').click(function () {
            self.clearArea()
        })
        $('#close').click(function () {
            self.clearArea();
            $('#myCanvas').hide();
        })
        $('#open').click(function () {
            self.clearArea();
            $('#myCanvas').show();
        })
        $('#back').click(function () {
            $('canvas').length > 1 ? $('canvas:last').remove() : false;
        })
    }
    module.borad = borads;
})(window.module || (window.module = {}))