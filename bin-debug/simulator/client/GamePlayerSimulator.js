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
    //极大极小值搜索深度
    var MIN_MAX_DEPTH = 3;
    //自动响应的机器人
    var GamePlayerSimulator = /** @class */ (function (_super) {
        __extends(GamePlayerSimulator, _super);
        function GamePlayerSimulator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //准备操作
        GamePlayerSimulator.prototype.readyForAction = function (action) {
            console.log("\u673A\u5668\u4EBA\u8FDB\u5165\u5EA7\u4F4D" + this.id);
            // this.requestStart();
        };
        ;
        GamePlayerSimulator.prototype.applyAction = function (action) {
            if (this.playStatus == chess.EGamerPlayStatus.START) {
                switch (action.action) {
                    case chess.EChessAction.MOVE:
                        //更改棋盘
                        // this.log(action);
                        var origin = this._piecePosition[action.origin.x][action.origin.y], destination = this._piecePosition[action.destination.x][action.destination.y];
                        this._piecePosition[action.destination.x][action.destination.y] = origin;
                        this._piecePosition[action.origin.x][action.origin.y] = 0;
                        this.moveMaster.updateMap(this._piecePosition);
                        var reverseData = this.changeData(this._piecePosition);
                        if (this.control) {
                            this.control.updateTable(reverseData);
                        }
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
                }
            }
        };
        ;
        GamePlayerSimulator.prototype.requestOver = function () {
            _super.prototype.requestOver.call(this);
            this.requestStart();
        };
        GamePlayerSimulator.prototype.startMove = function () {
            // console.log("机器人执棋开始行动");
            if (this.playStatus == chess.EGamerPlayStatus.START) {
                this.autoRequest();
            }
        };
        /**
         * 随机出牌的AI
         * */
        GamePlayerSimulator.prototype.autoRequest = function () {
            var all = [];
            var first = [];
            var back;
            // all = this.getAll(this._piecePosition,this.side);
            // let number = Math.floor(Math.random() * all.length);
            // back = all[number];
            // this.server.requestMove(back);
            this.maxMinSearch(this._piecePosition, 0);
            this.server.requestMove(this._nextAction);
        };
        /**
         * 局面判断：棋子价值可以量化为：
         * 兵    士   相   炮   马   车   帅
         * 10   20    20   45   40   90   1000
         * */
        /**
         * 兵   士   相   炮   马   车   帅
         * P    A    B    C    N    R    K
         * */
        /**
         * 每个棋子都有一个与绝对位置相关的价值数组(暂未考虑)
         * */
        /**
         * 判断整个棋盘的局势
         * +：数字越大，代表对红色方越有利
         * -：数字越小，代表对黑色方越有利
         * 暂时只考虑棋子价值作为局势判断依据，以后加入绝对位置数组
         * */
        GamePlayerSimulator.prototype.judgeSituation = function (piece) {
            var situations = 0;
            // let piece = this.copyPosition(pieces);
            for (var n = 0; n < piece.length; n++) {
                for (var m = 0; m < piece[0].length; m++) {
                    situations += this.getPieceValue(piece[n][m]);
                }
            }
            return situations;
        };
        /**
         * 得到棋子的权重值
         * */
        GamePlayerSimulator.prototype.getPieceValue = function (piece) {
            var back = 0;
            switch (Math.abs(piece)) {
                case 1:
                    back = 10;
                case 2:
                    back = 45;
                    break;
                case 3:
                    back = 90;
                    break;
                case 4:
                    back = 40;
                    break;
                case 5:
                    back = 20;
                    break;
                case 6:
                    back = 20;
                    break;
                case 7:
                    back = 1000;
                    break;
            }
            if (piece < 0) {
                back = -back;
            }
            return back;
        };
        /**
         * 复制棋盘
         * */
        GamePlayerSimulator.prototype.copyPosition = function (pieces) {
            var back = [];
            for (var n = 0; n < pieces.length; n++) {
                back[n] = [];
                for (var m = 0; m < pieces[0].length; m++) {
                    back[n][m] = pieces[n][m];
                }
            }
            return back;
        };
        /**
         * 走一步棋以后整个的局势
         * */
        GamePlayerSimulator.prototype.movePiece = function (pieces, action) {
            var piece = this.copyPosition(pieces);
            piece[action.destination.x][action.destination.y] = piece[action.origin.x][action.origin.y];
            piece[action.origin.x][action.origin.y] = 0;
            return piece;
        };
        // private _num:number = 0;
        /**
         * 极大极小值搜索
         * 拓展于深度优先搜索
         * */
        GamePlayerSimulator.prototype.maxMinSearch = function (piece, depth) {
            var _this = this;
            // this._num++;
            //关于评价函数
            //1、使用评估函数返回局势
            if (depth == MIN_MAX_DEPTH) {
                return this.judgeSituation(piece);
            }
            var nSituation;
            if ((this.side + depth) % 2 == chess.SIDE.RED) {
                nSituation = Number.NEGATIVE_INFINITY; //初始局势是无穷小
            }
            else {
                nSituation = Number.POSITIVE_INFINITY; //初始局势无穷大
            }
            //2、获得所有的子节点（当前情况下所有的步数）
            var copyPosition1 = this.copyPosition(piece);
            var side = (this.side + depth) % 2; //0
            var nextAction = this.getAll(copyPosition1, side);
            var getAction = nextAction[0];
            nextAction.forEach(function (action, index) {
                var copyPosition2 = _this.copyPosition(copyPosition1);
                var nextPieces = _this.movePiece(copyPosition2, action);
                var nTemp = _this.maxMinSearch(nextPieces, depth + 1);
                if ((_this.side + depth) % 2 == chess.SIDE.RED) {
                    if (nTemp > nSituation) {
                        nSituation = nTemp;
                        getAction = action;
                    }
                    // nSituation = Math.max(nSituation, nTemp);
                }
                else {
                    if (nTemp < nSituation) {
                        nSituation = nTemp;
                        getAction = action;
                    }
                }
            });
            // let
            this._nextAction = getAction;
            return nSituation;
            //3、如果轮到对手走棋，是极小节点，选择一个得分最小的走法
            //4、如果是自己走棋，是极大节点，选择一个得分最大的走法
            //存储一个最优解,大个子
            // let piecePosition1 = this.copyPosition(this._piecePosition);
            // let action = this.getAll(piecePosition1, this.side);//代表当前所能移动的步数
            //
            // for (let x = 0; x < action.length; x++) {
            //     let piecePosition2 = this.movePiece(piecePosition1, action[x]);
            //     let piecePosition3 = this.copyPosition(piecePosition2);
            //
            //     let action2 = this.getAll(piecePosition3, this.side ? 0 : 1);
            //
            //     let cacheAction: INewAction = action2[0], breakCount: number = 0;
            //     for (let count = 0; count < action2.length; count++) {
            //         //
            //     }
            //
            //     action2.forEach(acc => {
            //         //得到局势
            //     })
            // }
            //
            // action.forEach(ac => {
            //     //执行该步骤以后，再次得到所有的步数
            //     let piecePosition2 = this.movePiece(piecePosition1, ac);
            //     let piecePosition3 = this.copyPosition(piecePosition2);
            //
            //     let action2 = this.getAll(piecePosition3, this.side ? 0 : 1);
            //
            //     let cacheAction: INewAction = action2[0], breakCount: number = 0;
            //     for (let count = 0; count < action2.length; count++) {
            //
            //     }
            //
            //     action2.forEach(acc => {
            //         //得到局势
            //     })
            //     //选择一个对自己最有利的局势，得到最上层的操作，该操作就是需要的操作
            // })
        };
        /**
         * 得到既定棋盘下，某阵营所有行棋路线
         * @param piece:既定棋盘下
         * @param side:指定阵营
         * */
        GamePlayerSimulator.prototype.getAll = function (piece, side) {
            var all = [];
            //首先遍历获得所有可以移动的棋子位置
            var point = [];
            var sign = side ? 1 : -1; //1代表红色棋子，-1代表黑色棋子
            for (var n = 0; n < 9; n++) {
                for (var m = 0; m < 10; m++) {
                    if (piece[n][m] * sign > 0) {
                        point.push(new egret.Point(n, m));
                    }
                }
            }
            //得到当时的行为控制器
            var moveMaster = new chess.MoveMaster();
            moveMaster.updateMap(piece);
            point.forEach(function (origin) {
                var destinations = [];
                switch (Math.abs(piece[origin.x][origin.y])) {
                    case 1: {
                        destinations = moveMaster.binMove(origin, side);
                        break;
                    }
                    case 2: {
                        destinations = moveMaster.paoMove(origin, side);
                        break;
                    }
                    case 3: {
                        destinations = moveMaster.juMove(origin, side);
                        break;
                    }
                    case 4: {
                        destinations = moveMaster.maMove(origin, side);
                        break;
                    }
                    case 5: {
                        destinations = moveMaster.xiangMove(origin, side);
                        break;
                    }
                    case 6: {
                        destinations = moveMaster.shiMove(origin, side);
                        break;
                    }
                    case 7: {
                        destinations = moveMaster.bossMove(origin, side);
                        break;
                    }
                }
                destinations.forEach(function (destination) {
                    var step = {
                        origin: origin,
                        destination: destination
                    };
                    all.push(step);
                });
            });
            return all;
        };
        return GamePlayerSimulator;
    }(chess.GamePlayerControl));
    chess.GamePlayerSimulator = GamePlayerSimulator;
})(chess || (chess = {}));
