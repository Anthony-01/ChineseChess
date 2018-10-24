var chess;
(function (chess) {
    /*
    * 服务器如何交互控制玩家进行操作
    * 从移动请求中提取上一个进行操作的玩家
    * 然后再广播的时候，遍历不同的方向的玩家
    * 让该玩家进行移动操作
    * 关于阵营分配，不同座位的玩家根据服务器给出的消息来更换阵营
    *
    * */
    var GameServer = /** @class */ (function () {
        function GameServer() {
            //服务器中控制两个gamer部分
            this.gamers = [];
            this.InitMap = [];
            // 游戏状态
            this.gameStatus = chess.EChessGameStatus.getReady;
            //加入机器人，准备开始游戏
            for (var n = 0; n < 2; n++) {
                var gamer = new chess.ActionServer();
                gamer.index = n;
                gamer.server = this;
                this.gamers.push(gamer);
            }
        }
        //玩家连接
        GameServer.prototype.onPlayerConnect = function (player) {
            //如何让玩家控制table
            if (this.gameStatus == chess.EChessGameStatus.getReady) {
                for (var n = 0; n < this.gamers.length; n++) {
                    //检查哪个座位空闲
                    if (this.gamers[n].actionStatus == chess.EGamerActionStatus.USER_FREE) {
                        this.gamers[n].onTakenControl(player);
                        console.log("\u73A9\u5BB6\u8FDE\u63A5\u4E8E" + n + "\u53F7\u5EA7\u4F4D");
                        break;
                    }
                }
                // this.checkStart();
            }
            else {
                console.log('房间玩家已满');
            }
        };
        ;
        GameServer.prototype.checkStart = function () {
            if (this.gameStatus == chess.EChessGameStatus.getReady) {
                var gamers = this.gamers;
                var totalGamers = gamers.length;
                //遍历玩家状态
                for (var i = 0; i < totalGamers; i++) {
                    if (gamers[i].actionStatus == chess.EGamerActionStatus.USER_FREE) {
                        console.warn("开始游戏失败，座位未满");
                        return;
                    }
                    else if (gamers[i].playStatus != chess.EGamerPlayStatus.READY) {
                        console.warn(i + "\u73A9\u5BB6\u672A\u51C6\u5907");
                        return;
                    }
                }
                this.gameStart();
            }
        };
        /**
         * 发送全局消息
         * @param action:行为
         * */
        GameServer.prototype.dispatchAction = function (action) {
            this.gamers.forEach(function (gamer) {
                gamer.dispatchAction(action);
            });
        };
        /**
         * 释放准备信号
         * @param action:准备动作
         * */
        GameServer.prototype.dispatchReady = function (action) {
            this.gamers.forEach(function (gamer) {
                gamer.dispatchReady(action);
            });
        };
        /**
         * 初始化棋盘配置
         * */
        GameServer.prototype.initPieces = function () {
            for (var n = 0; n < 9; n++) {
                var arr = [];
                for (var m = 0; m < 10; m++) {
                    arr[m] = 0;
                }
                this.InitMap[n] = arr;
            }
            this.InitMap[0][0] = -3;
            this.InitMap[0][9] = 3;
            this.InitMap[1][0] = -4;
            this.InitMap[1][9] = 4;
            this.InitMap[2][0] = -5;
            this.InitMap[2][9] = 5;
            this.InitMap[3][0] = -6;
            this.InitMap[3][9] = 6;
            this.InitMap[4][0] = -7;
            this.InitMap[4][9] = 7;
            this.InitMap[5][0] = -6;
            this.InitMap[5][9] = 6;
            this.InitMap[6][0] = -5;
            this.InitMap[6][9] = 5;
            this.InitMap[7][0] = -4;
            this.InitMap[7][9] = 4;
            this.InitMap[8][0] = -3;
            this.InitMap[8][9] = 3;
            this.InitMap[1][2] = -2;
            this.InitMap[1][7] = 2;
            this.InitMap[7][2] = -2;
            this.InitMap[7][7] = 2;
            this.InitMap[0][3] = -1;
            this.InitMap[0][6] = 1;
            this.InitMap[2][3] = -1;
            this.InitMap[2][6] = 1;
            this.InitMap[4][3] = -1;
            this.InitMap[4][6] = 1;
            this.InitMap[6][3] = -1;
            this.InitMap[6][6] = 1;
            this.InitMap[8][3] = -1;
            this.InitMap[8][6] = 1;
        };
        GameServer.prototype.gameStart = function () {
            var _this = this;
            console.log("游戏开始");
            //初始化棋盘配置
            this.initPieces();
            this.gameStatus = chess.EChessGameStatus.start;
            //取随机方为红色方
            var randomNumber = Math.round(Math.random());
            this.gamers[0].side = randomNumber;
            this.gamers[1].side = randomNumber ? 0 : 1;
            //通知客户端开始游戏
            this.gamers.forEach(function (gamer) {
                gamer.startGame(_this.InitMap);
            });
            this.currentSide = chess.SIDE.RED;
            //通知红色方的客户端进行操作
            this.gamers.forEach(function (gamer) {
                if (gamer.side == _this.currentSide) {
                    gamer.readyForAction({
                        action: chess.EChessAction.MOVE
                    });
                }
            });
        };
        ;
        /**
         * 验证玩家操作是否规范
         * */
        GameServer.prototype.checkAction = function (action) {
            var back;
            console.log("验证操作");
            return back;
        };
        ;
        /**
         *
         * */
        GameServer.prototype.requestReady = function (id) {
            this.gameStatus = chess.EChessGameStatus.getReady;
            this.checkStart();
        };
        /**
         * 玩家请求移动
         * @param data:包含origin初始点以及destination目标点
         * @param id:座位号
         * @param side:阵营
         * */
        GameServer.prototype.requestMove = function (data, id, side) {
            var _this = this;
            //首先验证游戏状态，玩家是否可以移动
            if (this.gameStatus == chess.EChessGameStatus.start) {
                var action = {
                    id: id,
                    side: side,
                    action: chess.EChessAction.MOVE,
                    origin: data.origin,
                    destination: data.destination
                };
                //广播该行为->所有客户端表现做出改变
                this.dispatchAction(action);
                //一方移动完毕以后，服务端通知下一个客户端进行移动操作
                this.currentSide = action.side ? chess.SIDE.BLACK : chess.SIDE.RED;
                this.gamers.forEach(function (gamer) {
                    if (gamer.side == _this.currentSide) {
                        gamer.readyForAction({
                            action: chess.EChessAction.MOVE
                        });
                    }
                });
            }
            else {
                console.log("玩家请求移动错误");
            }
        };
        /**
         * 游戏结束时，每个客户端都会请求一次
         * @param id:座位号
         * */
        GameServer.prototype.requestOver = function (id) {
            if (this.gameStatus = chess.EChessGameStatus.start) {
                this.gameStatus = chess.EChessGameStatus.gameOver;
                var action = {
                    id: id,
                    action: chess.EChessAction.OVER
                };
                this.gamers[id].dispatchAction(action);
                console.log("\u901A\u77E5\u5EA7\u4F4D\u53F7\u4E3A" + id + "\u7684\u5BA2\u6237\u7AEF\u7ED3\u675F\uFF0C\u663E\u793A\u76F8\u5E94\u7ED3\u7B97\u754C\u9762");
            }
        };
        return GameServer;
    }());
    chess.GameServer = GameServer;
})(chess || (chess = {}));
