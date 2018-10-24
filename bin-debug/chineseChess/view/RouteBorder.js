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
    var RouteBorder = /** @class */ (function (_super) {
        __extends(RouteBorder, _super);
        function RouteBorder(point) {
            var _this = _super.call(this) || this;
            _this.point = point;
            _this.drawBorder();
            _this.x = _this.point.x * chess.GameView.PIECE_WIDTH;
            _this.y = _this.point.y * chess.GameView.PIECE_WIDTH;
            return _this;
        }
        RouteBorder.prototype.drawBorder = function () {
            this.graphics.lineStyle(3, 0x3CB371); //deb887
            // this.graphics.drawRect(0,0,GameView.PIECE_WIDTH,GameView.PIECE_WIDTH);
            this.graphics.moveTo(-25, -15);
            this.graphics.lineTo(-25, -25);
            this.graphics.lineTo(-15, -25);
            this.graphics.moveTo(15, -25);
            this.graphics.lineTo(25, -25);
            this.graphics.lineTo(25, -15);
            this.graphics.moveTo(25, 15);
            this.graphics.lineTo(25, 25);
            this.graphics.lineTo(15, 25);
            this.graphics.moveTo(-15, 25);
            this.graphics.lineTo(-25, 25);
            this.graphics.lineTo(-25, 15);
            this.graphics.endFill();
        };
        return RouteBorder;
    }(egret.Sprite));
    chess.RouteBorder = RouteBorder;
})(chess || (chess = {}));
