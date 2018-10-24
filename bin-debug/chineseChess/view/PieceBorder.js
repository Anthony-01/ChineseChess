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
    var PieceBorder = /** @class */ (function (_super) {
        __extends(PieceBorder, _super);
        function PieceBorder(point) {
            var _this = _super.call(this) || this;
            _this.touchEnabled = true;
            _this.updatePoint(point);
            _this.drawCir();
            return _this;
        }
        PieceBorder.prototype.updatePoint = function (point) {
            this.point = point;
        };
        PieceBorder.prototype.drawCir = function () {
            this.graphics.lineStyle(2, 0x3CB371); //this.side > 0?0xFF0000:0x000000，00008b
            this.graphics.beginFill(0xDEB887, 0);
            this.graphics.drawCircle(0, 0, 25);
            this.graphics.endFill();
            this.x = this.point.x * chess.GameView.PIECE_WIDTH;
            this.y = this.point.y * chess.GameView.PIECE_WIDTH;
        };
        return PieceBorder;
    }(egret.Sprite));
    chess.PieceBorder = PieceBorder;
})(chess || (chess = {}));
