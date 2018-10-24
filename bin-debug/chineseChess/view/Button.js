var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var chess;
(function (chess) {
    var C_YELLOW = 0xFFA500;
    var C_GRAY = 0xDCDCDC;
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(text) {
            var _this = _super.call(this) || this;
            _this._text = new egret.TextField();
            _this.addText(text);
            _this.drawBack(C_YELLOW);
            _this.setEnable(true);
            _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.changeToGray, _this);
            _this.addEventListener(egret.TouchEvent.TOUCH_END, _this.changeToYellow, _this);
            return _this;
        }
        Button.prototype.addText = function (text) {
            this._text.fontFamily = "Impact";
            this._text.text = text;
            this._text.width = 100;
            this._text.height = 50;
            this._text.textColor = 0xFFFFFF; //336699
            this._text.textAlign = egret.HorizontalAlign.CENTER;
            this._text.verticalAlign = egret.VerticalAlign.MIDDLE;
            this._text.strokeColor = 0x6699cc;
            this._text.stroke = 2;
            this.addChild(this._text);
        };
        Button.prototype.setEnable = function (sign) {
            if (sign) {
                this.touchEnabled = true;
                this.drawBack(C_YELLOW);
            }
            else {
                this.touchEnabled = false;
                this.drawBack(C_GRAY);
            }
        };
        Button.prototype.changeToGray = function () {
            this.drawBack(C_GRAY);
        };
        Button.prototype.changeToYellow = function () {
            this.drawBack(C_YELLOW);
        };
        Button.prototype.drawBack = function (color) {
            this.graphics.clear();
            // this.graphics.lineStyle(2,0x000000);
            this.graphics.beginFill(color, 0.5);
            this.graphics.drawRoundRect(0, 0, 100, 50, 20, 20);
            this.graphics.endFill();
        };
        return Button;
    }(egret.Sprite));
    chess.Button = Button;
})(chess || (chess = {}));
