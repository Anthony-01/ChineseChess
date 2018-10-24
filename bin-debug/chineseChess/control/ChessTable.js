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
    var ChessTable = /** @class */ (function (_super) {
        __extends(ChessTable, _super);
        function ChessTable() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //棋盘上的棋子
            _this.pieces = [];
            return _this;
        }
        /*
        *
        * */
        ChessTable.prototype.onInit = function (p_server, view, main) {
            this.mainStage = main;
            this.server = p_server;
            //模拟服务器
            if (!this.server) {
                this.server = new chess.GameServer();
            }
            //初始化玩家
            var gamer = new chess.GamePlayerControl();
            gamer.control = this;
            //玩家加入服务器
            this.server.onPlayerConnect(gamer);
            this.currentPlay = gamer;
            //视图
            this.view = view;
            this.view.control = this;
            console.log("控制器初始化完成");
        };
        /**
         * 开始游戏
         * */
        ChessTable.prototype.startGame = function (data) {
            this.view.init(data);
            this.view.clearBorder();
        };
        /*
        * 更新棋盘
        * */
        ChessTable.prototype.updateTable = function (data, action) {
            //显示上次移动棋子的轨迹
            this.view.setTable(data);
            if (action) {
                this.view.onMovePiece(action.origin, action.destination);
            }
            else {
                this.view.clearBorder();
            }
        };
        /*
        * 对手玩家连接服务器
        * */
        ChessTable.prototype.onPlayConnect = function (player) {
            this.player = player;
            this.server.onPlayerConnect(this.player);
        };
        /*
        * color颜色的玩家开始可以进行移动
        * */
        ChessTable.prototype.startMove = function (color) {
            // console.log(color);
            //control 设置游戏状态是否可行?
            if (this.currentPlay.side == color) {
                this.view.startMove(color);
            }
        };
        ChessTable.prototype.resetButton = function () {
            this.view.resetButton();
        };
        ChessTable.prototype.requestReady = function () {
            this.currentPlay.requestStart();
        };
        //棋子移动
        ChessTable.prototype.onMovePiece = function (from, to) {
            var data = {
                origin: from,
                destination: to
            };
            this.currentPlay.requestMove(data);
        };
        ChessTable.prototype.getTargets = function (origin, type) {
            return this.currentPlay.getTargets(origin, type);
        };
        ChessTable.prototype.showResult = function () {
            //做成弹窗样式结算框
            this.mainStage.showResult();
        };
        return ChessTable;
    }(egret.Sprite));
    chess.ChessTable = ChessTable;
})(chess || (chess = {}));
