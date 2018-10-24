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
    var Piece = /** @class */ (function (_super) {
        __extends(Piece, _super);
        function Piece(x, y, type) {
            var _this = _super.call(this) || this;
            _this.point = new egret.Point(x, y);
            //通过种类决定棋子的行进方式
            _this.type = Math.abs(type);
            _this.side = type > 0 ? 1 : 0;
            _this._lineColor = _this.side > 0 ? Piece.LINE_COLOR[0] : Piece.LINE_COLOR[1];
            _this.drawPiece();
            //添加事件
            _this.touchEnabled = false;
            return _this;
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touched,this);
        }
        Piece.prototype.touched = function (e) {
            // this.parent.getMes(this.Point);
            // console.log(`${this.side}方${this.type}准备移动`);
        };
        Object.defineProperty(Piece.prototype, "point", {
            set: function (point) {
                this.cachePoint = point;
                this.x = point.x * chess.GameView.PIECE_WIDTH - chess.GameView.PIECE_WIDTH / 2;
                this.y = point.y * chess.GameView.PIECE_WIDTH - chess.GameView.PIECE_WIDTH / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Piece.prototype, "Point", {
            get: function () {
                return this.cachePoint;
            },
            enumerable: true,
            configurable: true
        });
        /*
        * 棋子半径为25
        * 问题，画出来的如何移动
        * 如何加入到主容器当中
        * */
        Piece.prototype.drawPiece = function () {
            // this.graphics.lineStyle(1, this._lineColor);//this.side > 0?0xFF0000:0x000000
            // this.graphics.beginFill(0xDEB887,0.7);
            // this.graphics.drawCircle(0, 0, 23);
            // this.graphics.endFill();
            //
            // //字
            // let label = new egret.TextField();
            // this.addChild( label );
            // label.width = 30;
            // label.height = 30;
            // label.x = -label.width/2;
            // label.y = -label.height/2;
            // label.fontFamily = "Impact";
            // label.textColor = this._lineColor;
            // label.text = this.getCText()[0];
            // label.textAlign = egret.HorizontalAlign.CENTER;
            // label.verticalAlign = egret.VerticalAlign.MIDDLE;
            var name = "";
            switch (Math.abs(this.type)) {
                case 1:
                    name = "pawn";
                    break;
                case 2:
                    name = "cannon";
                    break;
                case 3:
                    name = "rook";
                    break;
                case 4:
                    name = "knight";
                    break;
                case 5:
                    name = "bishop";
                    break;
                case 6:
                    name = "advisor";
                    break;
                case 7:
                    name = "king";
                    break;
            }
            name += this.side;
            name += "_png";
            var bitmap = new egret.Bitmap();
            bitmap.texture = RES.getRes(name);
            this.addChild(bitmap);
        };
        Piece.prototype.getCText = function () {
            var T = [];
            switch (this.side ? this.type : -this.type) {
                case (0):
                    return null;
                case (-1):
                    T[0] = "卒";
                    T[1] = "BR";
                    break;
                case (-2):
                    T[0] = "炮";
                    T[1] = "PR";
                    break;
                case (-3):
                    T[0] = "车";
                    T[1] = "JR";
                    break;
                case (-4):
                    T[0] = "马";
                    T[1] = "MR";
                    break;
                case (-5):
                    T[0] = "象";
                    T[1] = "XR";
                    break;
                case (-6):
                    T[0] = "士";
                    T[1] = "SR";
                    break;
                case (-7):
                    T[0] = "将";
                    T[1] = "J";
                    break;
                case (1):
                    T[0] = "兵";
                    T[1] = "BB";
                    break;
                case (2):
                    T[0] = "炮";
                    T[1] = "PB";
                    break;
                case (3):
                    T[0] = "车";
                    T[1] = "JB";
                    break;
                case (4):
                    T[0] = "马";
                    T[1] = "MB";
                    break;
                case (5):
                    T[0] = "相";
                    T[1] = "XB";
                    break;
                case (6):
                    T[0] = "士";
                    T[1] = "SB";
                    break;
                case (7):
                    T[0] = "帅";
                    T[1] = "S";
                    break;
                default:
                    return null;
            }
            return T;
        };
        /*
        * 更新该棋子的行进路线，需要整个棋盘的布局
        * */
        Piece.prototype.updateTargets = function () {
        };
        //棋子回收(被吃)
        Piece.prototype.recycle = function (source, subString) {
            if (this.parent) {
                this.parent.removeChild(this);
                return true;
            }
            else {
                return false;
            }
        };
        ;
        //棋子移动
        Piece.prototype.move = function (x, y) {
            egret.Tween.get(this).to({});
        };
        ;
        Piece.LINE_COLOR = [0xFF0000, 0x000000];
        return Piece;
    }(egret.Sprite));
    chess.Piece = Piece;
})(chess || (chess = {}));
