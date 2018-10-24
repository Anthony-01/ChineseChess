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
    /*
    * 位置对象，置于棋盘，用于放置棋子
    * */
    var SiteObject = /** @class */ (function (_super) {
        __extends(SiteObject, _super);
        function SiteObject(x, y) {
            var _this = _super.call(this) || this;
            _this.piece = null;
            _this.position = new egret.Point(x, y);
            return _this;
        }
        /*
        * 在该位置增加棋子
        * */
        SiteObject.prototype.addPiece = function (piece) {
            this.piece = piece;
        };
        /*
        * 从该位置移除棋子
        * */
        SiteObject.prototype.removePiece = function () {
            this.piece = null;
        };
        /*
        * 展示棋子被选择边框
        * */
        SiteObject.prototype.showChoose = function () {
        };
        SiteObject.prototype.showTargetBorder = function () {
        };
        SiteObject.prototype.showEatBorder = function () {
        };
        return SiteObject;
    }(egret.Sprite));
    chess.SiteObject = SiteObject;
})(chess || (chess = {}));
