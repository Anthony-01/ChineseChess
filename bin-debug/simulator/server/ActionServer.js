var chess;
(function (chess) {
    /**
     * 分管一个玩家，
     * 玩家所有的数据，包括状态等是否应该保存在此
     * 还是所有数据分散到客户端保存
     * */
    var ActionServer = /** @class */ (function () {
        function ActionServer() {
            this.actionStatus = chess.EGamerActionStatus.USER_FREE; //初始化时座位处于空闲free状态
        }
        /**
         * 玩家的连接
         * @param user:玩家
        * */
        ActionServer.prototype.onTakenControl = function (user) {
            this.user = user;
            user.id = this.index;
            this.actionStatus = chess.EGamerActionStatus.USER_READY; //进入准备状态
            this.user.connection(this);
            //全局消息，玩家进入
            this.server.dispatchAction({
                id: this.index,
                action: chess.EChessAction.JOIN
            });
        };
        ActionServer.prototype.dispatchAction = function (action) {
            if (this.user) {
                this.user.applyAction(action);
            }
        };
        /**
         * 释放准备信号
         * */
        ActionServer.prototype.dispatchReady = function (action) {
            if (this.user) {
                this.user.readyForAction(action);
            }
        };
        //开始游戏
        ActionServer.prototype.startGame = function (data) {
            this.actionStatus = chess.EGamerActionStatus.ACTION_FREE;
            this.playStatus = chess.EGamerPlayStatus.START;
            //传递初始的棋盘配置
            this.user.side = this.side;
            this.user.startGame(data);
        };
        ActionServer.prototype.readyForAction = function (action) {
            //准备进行操作
            this.actionStatus = chess.EGamerActionStatus.ACTION_READY;
            this._action = action.action;
            switch (this._action) {
                case chess.EChessAction.MOVE:
                    //机器人的操作，立刻回调服务器的操作
                    // this.server.requestMove(this.index);
                    //正常：调用客户端方法，等待获得客户端的输入
                    this.startMove();
                    break;
                case chess.EChessAction.EAT:
                    break;
                case chess.EChessAction.WARNING:
                    break;
                case chess.EChessAction.CANCEL:
                    break;
                default:
                    break;
            }
        };
        //验证操作
        ActionServer.prototype.assertAction = function (action) {
            if (this.actionStatus != chess.EGamerActionStatus.ACTION_READY) {
                return false;
            }
            var actionID = action.action; //操作ID
            if (actionID = chess.EChessAction.CANCEL) {
                return this.assertCancel(); //取消操作?
            }
            else {
                //麻将是根据玩家的手牌进行判断能否进行该操作
                //象棋转变思路，判断的依据该棋子能否移动到目的地
                //移动以及吃的操作，第一是棋本身能否移动到
                //第二是有没有其他棋堵住位置而不能移动
                //需要的信息，整个棋盘各个棋子的落位
                //遍历pieces
                return true;
            }
        };
        ;
        /**
         * 完成操作
         * */
        ActionServer.prototype.applyAction = function (action) {
            this.server.dispatchAction(action);
        };
        /**
         * 取消操作
         * */
        ActionServer.prototype.cancelAction = function (action) {
            console.log("\u53D6\u6D88\u64CD\u4F5C:" + action);
        };
        /*
        * 轮到该玩家进行操作
        * */
        ActionServer.prototype.startMove = function () {
            this.actionStatus = chess.EGamerActionStatus.ACTION_READY;
            this.user.startMove();
        };
        ActionServer.prototype.assertCancel = function () {
            return;
        };
        /*
        * 请求准备
        * */
        ActionServer.prototype.requestReady = function () {
            // if(this.playStatus != EGamerPlayStatus.READY){
            // this.actionStatus = EGamerActionStatus.USER_READY;//进入准备状态
            this.playStatus = chess.EGamerPlayStatus.READY;
            this.server.requestReady(this.index);
            // }
        };
        /*
        * 座位号为id的玩家请求移动
        * */
        ActionServer.prototype.requestMove = function (data) {
            this.server.requestMove(data, this.index, this.side);
        };
        /**
         * 请求结束游戏，显示结算
         * */
        ActionServer.prototype.requestOver = function () {
            var data;
            this.server.requestOver(this.index);
        };
        return ActionServer;
    }());
    chess.ActionServer = ActionServer;
})(chess || (chess = {}));
