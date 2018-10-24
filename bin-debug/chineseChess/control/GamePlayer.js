var chess;
(function (chess) {
    var RED_FROM = ["九", "八", "七", "六", "五", "四", "三", "二", "一"];
    var BLACK_FROM = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var RED_PIECE = ["兵", "炮", "车", "马", "相", "士", "帅"];
    var BLACK_PIECE = ["卒", "炮", "车", "马", "象", "士", "将"];
    var GamePlayerControl = /** @class */ (function () {
        function GamePlayerControl() {
            this._piecePosition = [];
            this._chessboard = [];
            // this.server = server;
            // this.playStatus = this.updateStatus();
            this.playStatus = chess.EGamerPlayStatus.READY;
            this.moveMaster = new chess.MoveMaster();
        }
        //更新游戏状态
        // private updateStatus():EGamerPlayStatus{
        //     return
        // }
        /*
        * 玩家进行动作
        *  用轮次来规定是哪个玩家进行动作
        *  用一个服务器传来的参数来决定哪一个玩家进行操作
        * */
        GamePlayerControl.prototype.actionPatcher = function (data) {
        };
        /*
        * 连接服务器,onJoinServer
        * */
        GamePlayerControl.prototype.connection = function (server) {
            this.server = server;
        };
        /*
        * 游戏开始,传入的数据是各个棋子的位置以及类型
        * 客户端接收消息
        * */
        GamePlayerControl.prototype.startGame = function (data) {
            //此处是否是调用连接服务器的操作
            //根据side将全局位置转变成本地位置
            for (var n = 0; n < data.length; n++) {
                this._piecePosition[n] = [];
                for (var m = 0; m < data[0].length; m++) {
                    this._piecePosition[n][m] = data[n][m];
                }
            }
            this.playStatus = chess.EGamerPlayStatus.START;
            this.moveMaster.updateMap(this._piecePosition);
            if (this.control) {
                var reverseData = this.changeData(this._piecePosition);
                this.control.startGame(reverseData);
            }
        };
        //全局坐标与本地坐标转换
        GamePlayerControl.prototype.changeData = function (data) {
            if (this.side == chess.SIDE.RED) {
                return data;
            }
            else {
                //x,y轴全都对称变化
                var back = [];
                for (var n = 0; n < 9; n++) {
                    var arr = [];
                    for (var m = 0; m < 10; m++) {
                        arr[m] = data[8 - n][9 - m];
                    }
                    back[n] = arr;
                }
                // console.log(back);
                return back;
            }
        };
        //单个坐标本地与全局坐标的转换
        GamePlayerControl.prototype.changeSinger = function (origin) {
            if (this.side == chess.SIDE.RED) {
                return origin;
            }
            else {
                var back = new egret.Point(8 - origin.x, 9 - origin.y);
                return back;
            }
        };
        //准备操作
        GamePlayerControl.prototype.readyForAction = function (action) {
            console.log("\u73A9\u5BB6\u8FDB\u5165\u5EA7\u4F4D" + this.id);
        };
        ;
        //验证操作
        GamePlayerControl.prototype.assertAction = function (action) {
            return;
        };
        ;
        /*
        * 响应操作
        * 客户端接收服务器的消息
        * */
        GamePlayerControl.prototype.applyAction = function (action) {
            // if(this.playStatus == EGamerPlayStatus.START ){
            switch (action.action) {
                case chess.EChessAction.MOVE:
                    //更改棋盘
                    this.log(action);
                    var origin = this._piecePosition[action.origin.x][action.origin.y], destination = this._piecePosition[action.destination.x][action.destination.y];
                    this._piecePosition[action.destination.x][action.destination.y] = origin;
                    this._piecePosition[action.origin.x][action.origin.y] = 0;
                    this.moveMaster.updateMap(this._piecePosition);
                    var reverseData = this.changeData(this._piecePosition);
                    if (this.control) {
                        var router = {
                            origin: this.changeSinger(action.origin),
                            destination: this.changeSinger(action.destination)
                        };
                        this.control.updateTable(reverseData, router);
                    }
                    //如何判断游戏结束
                    //通过piecePosition判断游戏结束，主将直面游戏结束
                    var boss = void 0, length_1 = 0, col = void 0, row = void 0;
                    for (var n = 0; n < this._piecePosition.length; n++) {
                        for (var m = 0; m < this._piecePosition[0].length; m++) {
                            if (Math.abs(this._piecePosition[n][m]) == 7) {
                                boss = this._piecePosition[n][m];
                                col = n;
                                row = m;
                                length_1++;
                            }
                        }
                    }
                    if (length_1 == 1) {
                        //将帅只有一个时候，游戏结束
                        this._winSide = boss > 0 ? "红色方" : "黑色方";
                        console.log("\u6E38\u620F\u7ED3\u675F\uFF0C\u80DC\u5229\u65B9\u662F" + (boss > 0 ? "红色方" : "黑色方"));
                        this.requestOver();
                    }
                    else if (length_1 < 1) {
                        console.log("将帅棋子错误：", boss);
                    }
                    else if (length_1 == 2) {
                        var sign = false, direction = void 0;
                        this._piecePosition[col][row] > 0 ? direction = -1 : direction = 1;
                        for (var x = row + direction; x < this._piecePosition[0].length && x >= 0;) {
                            if (this._piecePosition[col][x] != 0) {
                                if (Math.abs(this._piecePosition[col][x]) == 7) {
                                    sign = true;
                                }
                                break;
                            }
                            x += direction;
                        }
                        if (sign) {
                            this._winSide = action.side ? "黑色方" : "红色方";
                            console.log("\u6E38\u620F\u7ED3\u675F\uFF0C\u80DC\u5229\u65B9\u662F" + this._winSide);
                            this.requestOver();
                        }
                    }
                    break;
                case chess.EChessAction.OVER:
                    // if(action.id == this.id){
                    console.log(this._chessboard);
                    this.showResult();
                    // }
                    break;
            }
            // }
        };
        ;
        GamePlayerControl.prototype.showResult = function () {
            if (this.control) {
                this.control.showResult();
                this.control.resetButton();
            }
        };
        GamePlayerControl.prototype.requestStart = function () {
            this.server.requestReady();
        };
        GamePlayerControl.prototype.requestOver = function () {
            // console.log("请求游戏结束");
            if (this.playStatus == chess.EGamerPlayStatus.START) {
                this.playStatus = chess.EGamerPlayStatus.OVER; //结束
                this.server.requestOver();
            }
        };
        GamePlayerControl.prototype.log = function (action) {
            var type, from, destination, //进、退、平
            to;
            var fromFun, typeFunc;
            var origin = this._piecePosition[action.origin.x][action.origin.y];
            var sign = action.destination.y - action.origin.y;
            if (sign > 0) {
                if (origin > 0) {
                    destination = "退";
                }
                else {
                    destination = "进";
                }
            }
            else if (sign == 0) {
                destination = "平";
            }
            else {
                if (origin > 0) {
                    destination = "进";
                }
                else {
                    destination = "退";
                }
            }
            if (origin > 0) {
                fromFun = RED_FROM;
                typeFunc = RED_PIECE;
                if ((Math.abs(origin) == 2 || Math.abs(origin) == 3 || Math.abs(origin) == 1) && sign != 0) {
                    this._chessboard.push("" + typeFunc[Math.abs(origin) - 1] + fromFun[action.origin.x] + destination + fromFun[9 - Math.abs(sign)]);
                    console.log("" + typeFunc[Math.abs(origin) - 1] + fromFun[action.origin.x] + destination + fromFun[9 - Math.abs(sign)]);
                }
                else {
                    this._chessboard.push("" + typeFunc[Math.abs(origin) - 1] + fromFun[action.origin.x] + destination + fromFun[action.destination.x]);
                    console.log("" + typeFunc[Math.abs(origin) - 1] + fromFun[action.origin.x] + destination + fromFun[action.destination.x]);
                }
            }
            else {
                fromFun = BLACK_FROM;
                typeFunc = BLACK_PIECE;
                if ((Math.abs(origin) == 2 || Math.abs(origin) == 3 || Math.abs(origin) == 1) && sign != 0) {
                    this._chessboard.push("   " + typeFunc[Math.abs(origin) - 1] + fromFun[action.origin.x] + destination + fromFun[Math.abs(sign) - 1]);
                    console.log("   " + typeFunc[Math.abs(origin) - 1] + fromFun[action.origin.x] + destination + fromFun[Math.abs(sign) - 1]);
                }
                else {
                    this._chessboard.push("   " + typeFunc[Math.abs(origin) - 1] + fromFun[action.origin.x] + destination + fromFun[action.destination.x]);
                    console.log("   " + typeFunc[Math.abs(origin) - 1] + fromFun[action.origin.x] + destination + fromFun[action.destination.x]);
                }
            }
        };
        //撤销操作
        GamePlayerControl.prototype.cancelAction = function (action) {
            return;
        };
        ;
        /*
        * 玩家执棋
        * */
        GamePlayerControl.prototype.startMove = function () {
            // console.log(`玩家${this.id}执棋开始行动`);
            //首先是touchEnabled
            if (this.control) {
                this.control.startMove(this.side);
            }
        };
        /*
        * 发送消息给服务器，通知行棋过程
        * data:需要初始的位置，目标的位置（），位置是全局坐标；
        * */
        GamePlayerControl.prototype.requestMove = function (data) {
            //现在就改变本地棋盘
            var back = {
                origin: this.changeSinger(data.origin),
                destination: this.changeSinger(data.destination)
            };
            this.server.requestMove(back);
        };
        GamePlayerControl.prototype.getTargets = function (origin, type) {
            var _this = this;
            var globalOrigin = this.changeSinger(origin); //转化为全局坐标
            var back = [];
            var globalTargets = [];
            switch (type) {
                case 1:
                    globalTargets = this.moveMaster.binMove(globalOrigin, this.side);
                    break;
                case 2:
                    globalTargets = this.moveMaster.paoMove(globalOrigin, this.side);
                    break;
                case 3:
                    globalTargets = this.moveMaster.juMove(globalOrigin, this.side);
                    break;
                case 4:
                    globalTargets = this.moveMaster.maMove(globalOrigin, this.side);
                    break;
                case 5:
                    globalTargets = this.moveMaster.xiangMove(globalOrigin, this.side);
                    break;
                case 6:
                    globalTargets = this.moveMaster.shiMove(globalOrigin, this.side);
                    break;
                case 7:
                    globalTargets = this.moveMaster.bossMove(globalOrigin, this.side);
                    break;
            }
            globalTargets.forEach(function (point) {
                back.push(_this.changeSinger(point));
            });
            return back;
        };
        return GamePlayerControl;
    }());
    chess.GamePlayerControl = GamePlayerControl;
})(chess || (chess = {}));
