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
    var PlayerServer = /** @class */ (function (_super) {
        __extends(PlayerServer, _super);
        function PlayerServer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 玩家连接服务
         * */
        PlayerServer.prototype.onTakenControl = function (user) {
            this.user = user;
            user.id = this.index;
            this.actionStatus = chess.EGamerActionStatus.USER_READY; //进入准备状态
            this.user.connection(this);
            //全局消息，玩家进入
            this.server.dispatchAction({
                side: this.index,
                action: chess.EChessAction.JOIN
            });
        };
        ;
        /**
         * 全局消息
         * */
        PlayerServer.prototype.dispatchAction = function (action) {
            if (this.user) {
                this.user.applyAction(action);
            }
        };
        ;
        /**
         * 准备信号
         * */
        PlayerServer.prototype.dispatchReady = function (action) {
            if (this.user) {
                this.user.readyForAction(action);
            }
        };
        ;
        /**
         * 移动请求
         * */
        PlayerServer.prototype.requestMove = function (data) {
            this.server.requestMove(data, this.index, this.side);
        };
        ;
        return PlayerServer;
    }(chess.ActionServer));
    chess.PlayerServer = PlayerServer;
})(chess || (chess = {}));
