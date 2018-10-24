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
    var GameView = /** @class */ (function (_super) {
        __extends(GameView, _super);
        function GameView() {
            var _this = _super.call(this) || this;
            _this._routerBorder = [];
            _this._border = [];
            _this._targets = [];
            // this.width = GameView.PIECE_WIDTH * 8;
            // this.height = GameView.PIECE_WIDTH * 10;
            _this.initTable();
            _this.addButton();
            console.log("棋盘初始化完成");
            return _this;
        }
        /*
        * 初始化位置对象
        * */
        GameView.prototype.initSites = function () {
        };
        /**
         * 添加按钮
         * */
        GameView.prototype.addButton = function () {
            this._startButton = new chess.Button("开始");
            this._startButton.setEnable(true);
            this._startButton.x = GameView.PIECE_WIDTH * 3;
            this._startButton.y = GameView.PIECE_WIDTH * 10;
            this.addChild(this._startButton);
            this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
        };
        GameView.prototype.startGame = function () {
            this.control.requestReady();
            this._startButton.setEnable(false);
        };
        GameView.prototype.resetButton = function () {
            this._startButton.setEnable(true);
        };
        /*
        * 初始化象棋配置
        * */
        GameView.prototype.initMap = function () {
            this.InitMap = [];
            for (var n = 0; n < 10; n++) {
                this.InitMap[n] = [];
            }
            this.InitMap[0][0] = -3;
            this.InitMap[9][0] = 3;
            this.InitMap[0][1] = -4;
            this.InitMap[9][1] = 4;
            this.InitMap[0][2] = -5;
            this.InitMap[9][2] = 5;
            this.InitMap[0][3] = -6;
            this.InitMap[9][3] = 6;
            this.InitMap[0][4] = -7;
            this.InitMap[9][4] = 7;
            this.InitMap[0][5] = -6;
            this.InitMap[9][5] = 6;
            this.InitMap[0][6] = -5;
            this.InitMap[9][6] = 5;
            this.InitMap[0][7] = -4;
            this.InitMap[9][7] = 4;
            this.InitMap[0][8] = -3;
            this.InitMap[9][8] = 3;
            this.InitMap[2][1] = -2;
            this.InitMap[7][1] = 2;
            this.InitMap[2][7] = -2;
            this.InitMap[7][7] = 2;
            this.InitMap[3][0] = -1;
            this.InitMap[6][0] = 1;
            this.InitMap[3][2] = -1;
            this.InitMap[6][2] = 1;
            this.InitMap[3][4] = -1;
            this.InitMap[6][4] = 1;
            this.InitMap[3][6] = -1;
            this.InitMap[6][6] = 1;
            this.InitMap[3][8] = -1;
            this.InitMap[6][8] = 1;
        };
        /**
         * 初始化
         * */
        GameView.prototype.init = function (data) {
            this.setTable(data);
            this.initPiece();
        };
        /*
        * 根据参数直接更新棋盘
        * */
        GameView.prototype.setTable = function (data) {
            this.InitMap = data;
        };
        /**
         *
         * */
        GameView.prototype.onMovePiece = function (origin, destination) {
            var _this = this;
            //移动棋子，需要参数origin,destination
            this._pieces.forEach(function (piece) {
                if (piece.Point.x == origin.x && piece.Point.y == origin.y) {
                    _this._currentPiece = piece;
                }
            });
            //检测目标点是否存在棋子
            var targetSign = false;
            var position = 0, target;
            this._pieces.forEach(function (piece) {
                if (piece.Point.x == destination.x && piece.Point.y == destination.y) {
                    _this._targetPiece = piece;
                    targetSign = true;
                    target = position;
                }
                position++;
            });
            //先从棋子数组中移除目标棋子
            if (targetSign) {
                this.removeChild(this._targetPiece);
                this._pieces.splice(target, 1);
            }
            this._currentPiece.point = destination;
            if (this._routerBorder.length) {
                this._routerBorder.forEach(function (border) {
                    _this.removeChild(border);
                });
                this._routerBorder = [];
            }
            var from = new chess.RouteBorder(origin);
            var to = new chess.RouteBorder(destination);
            this.addChild(from);
            this.addChild(to);
            this._routerBorder.push(from);
            this._routerBorder.push(to);
            // console.log("移动棋子");
        };
        GameView.prototype.clearBorder = function () {
            var _this = this;
            if (this._routerBorder.length) {
                this._routerBorder.forEach(function (border) {
                    _this.removeChild(border);
                });
                this._routerBorder = [];
            }
        };
        /*
        * 绘制棋盘
        * */
        GameView.prototype.initTable = function () {
            // //棋盘横线
            // for (let n = 0; n < 10; n++) {
            //     this.graphics.lineStyle(2, GameView.LINE_COLOR);
            //     this.graphics.moveTo(0, n * GameView.PIECE_WIDTH);
            //     this.graphics.lineTo(GameView.PIECE_WIDTH * 8, n * GameView.PIECE_WIDTH);
            // }
            //
            // //棋盘竖线
            // for (let n = 0; n < 9; n++) {
            //     if (n == 0 || n == 8) {
            //         this.graphics.lineStyle(2, GameView.LINE_COLOR);
            //         this.graphics.moveTo(n * GameView.PIECE_WIDTH, 0);
            //         this.graphics.lineTo(n * GameView.PIECE_WIDTH, GameView.PIECE_WIDTH * 9);
            //     } else {
            //         this.graphics.lineStyle(2, GameView.LINE_COLOR);
            //         this.graphics.moveTo(n * GameView.PIECE_WIDTH, 0);
            //         this.graphics.lineTo(n * GameView.PIECE_WIDTH, GameView.PIECE_WIDTH * 4);
            //
            //         this.graphics.lineStyle(2, GameView.LINE_COLOR);
            //         this.graphics.moveTo(n * GameView.PIECE_WIDTH, GameView.PIECE_WIDTH * 5);
            //         this.graphics.lineTo(n * GameView.PIECE_WIDTH, GameView.PIECE_WIDTH * 9);
            //     }
            // }
            //
            // //绘制九宫格
            // this.graphics.lineStyle(2, GameView.LINE_COLOR);
            // this.graphics.moveTo(3 * GameView.PIECE_WIDTH, 0);
            // this.graphics.lineTo(GameView.PIECE_WIDTH * 5, 2 * GameView.PIECE_WIDTH);
            //
            // this.graphics.lineStyle(2, GameView.LINE_COLOR);
            // this.graphics.moveTo(5 * GameView.PIECE_WIDTH, 0);
            // this.graphics.lineTo(GameView.PIECE_WIDTH * 3, 2 * GameView.PIECE_WIDTH);
            //
            // this.graphics.lineStyle(2, GameView.LINE_COLOR);
            // this.graphics.moveTo(3 * GameView.PIECE_WIDTH, 9 * GameView.PIECE_WIDTH);
            // this.graphics.lineTo(GameView.PIECE_WIDTH * 5, 7 * GameView.PIECE_WIDTH);
            //
            // this.graphics.lineStyle(2, GameView.LINE_COLOR);
            // this.graphics.moveTo(5 * GameView.PIECE_WIDTH, 9 * GameView.PIECE_WIDTH);
            // this.graphics.lineTo(GameView.PIECE_WIDTH * 3, 7 * GameView.PIECE_WIDTH);
            var table = new egret.Bitmap();
            table.texture = RES.getRes("background_png");
            var num = 500;
            var rate = table.width / num;
            table.width = num;
            table.height = table.height / rate;
            this.addChild(table);
            table.x = -50;
            table.y = -50;
            // for (; num < 500; num++) {
            //
            // }
        };
        /*
        * 直接更新棋盘
        * */
        GameView.prototype.initPiece = function () {
            //移除旧有的棋子
            var self = this;
            if (this._pieces) {
                this._pieces.forEach(function (piece) {
                    self.removeChild(piece);
                });
            }
            this._pieces = [];
            for (var n = 0; n < 9; n++) {
                for (var m = 0; m < 10; m++) {
                    if (!!this.InitMap[n][m]) {
                        var piece = new chess.Piece(n, m, this.InitMap[n][m]);
                        piece.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchPiece, this);
                        this.addChild(piece);
                        this._pieces.push(piece);
                    }
                }
            }
        };
        /*
        * color方的玩家可以进行移动
        * */
        GameView.prototype.startMove = function (color) {
            // if(this.){}
            this._pieces.forEach(function (piece) {
                if (piece.side == color) {
                    piece.touchEnabled = true;
                }
            });
        };
        GameView.prototype.touchPiece = function (evt) {
            // console.log(evt.target);
            evt.stopPropagation();
            //得到初始的位置以后，计算可以移动到的位置
            this._origin = evt.target.Point;
            var origin = evt.target.Point;
            var type = evt.target.type;
            var targets = this.control.getTargets(origin, type);
            this.showTargets(targets);
            // console.log(targets);
            // this.control.onMovePiece(origin,new egret.Point(origin.x,origin.y-1));
            //点击棋子以后显示棋盘上可以点击的空位
        };
        //展示可以移动到的位置
        GameView.prototype.showTargets = function (points) {
            var _this = this;
            this._targets = points;
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.adjustAction, this);
            if (this._border.length) {
                this._border.forEach(function (border) {
                    _this.removeChild(border);
                });
                this._border = [];
            }
            points.forEach(function (point) {
                var sprite = new chess.PieceBorder(point);
                _this._border.push(sprite);
                _this.addChild(sprite);
            });
            //在整个棋盘上添加点击事件
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.adjustAction, this, true);
            // this.touchEnabled = true;
            // console.log(this);
            //整个棋盘加上点击事件，判断点击的位置来决定是否发送移动请求
            //直接在border上面加点击事件
            this._border.forEach(function (border) {
                border.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.touchPosition, _this);
            });
            // console.log(this._border);
        };
        GameView.prototype.touchPosition = function (evt) {
            evt.stopPropagation(); //阻止向上冒泡
            var border = evt.currentTarget, self = this;
            // console.log(border);
            border.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchPosition, this);
            var destination = evt.currentTarget.point;
            for (var n = 0; n < this._targets.length; n++) {
                var point = this._targets[n];
                if (point.x == destination.x && point.y == destination.y) {
                    // console.log("可以到达点：", destination);
                    if (self._border.length) {
                        self._border.forEach(function (border) {
                            self.removeChild(border);
                        });
                        self._border = [];
                    }
                    this.stopMove();
                    this.control.onMovePiece(this._origin, destination);
                    border.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchPosition, this);
                    break;
                }
            }
        };
        GameView.prototype.stopMove = function () {
            this._pieces.forEach(function (piece) {
                piece.touchEnabled = false;
            });
        };
        GameView.prototype.adjustAction = function (evt) {
            // console.log(evt);
            var self = this;
            var x = evt.stageX, y = evt.stageY;
            var destination = new egret.Point((x - 120) / GameView.PIECE_WIDTH, Math.round((y - 320) / GameView.PIECE_WIDTH));
            for (var n = 0; n < this._targets.length; n++) {
                var point = this._targets[n];
                if (point.x == destination.x && point.y == destination.y) {
                    // console.log("可以到达点：", destination);
                    if (self._border.length) {
                        self._border.forEach(function (border) {
                            self.removeChild(border);
                        });
                        self._border = [];
                    }
                    this.control.onMovePiece(this._origin, destination);
                    this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.adjustAction, this, true);
                    break;
                }
            }
        };
        GameView.PIECE_WIDTH = 50;
        GameView.LINE_COLOR = 0xDEB887;
        return GameView;
    }(egret.Sprite));
    chess.GameView = GameView;
})(chess || (chess = {}));
