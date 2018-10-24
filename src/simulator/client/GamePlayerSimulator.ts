namespace chess {

    //极大极小值搜索深度
    const MIN_MAX_DEPTH = 3;

    //红色方兵的位置价值数组
    const PAWN_ARRAY = [
        9, 9, 9, 11, 13, 11, 9, 9, 9,
        19, 24, 34, 42, 44, 42, 34, 24, 19,
        19, 24, 32, 37, 37, 37, 32, 24, 19,
        19, 23, 27, 29, 30, 29, 27, 23, 19,
        14, 18, 20, 27, 29, 27, 20, 18, 14,
        7, 0, 13, 0, 16, 0, 13, 0, 7,
        7, 0, 7, 0, 15, 0, 7, 0, 7,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    //自动响应的机器人
    export class GamePlayerSimulator extends GamePlayerControl {
        //准备操作
        readyForAction(action: IReadyAction): void {
            console.log(`机器人进入座位${this.id}`);
            // this.requestStart();
        };

        applyAction(action: IChessAction): void {
            if (this.playStatus == EGamerPlayStatus.START) {
                switch (action.action) {
                    case EChessAction.MOVE:
                        //更改棋盘
                        // this.log(action);
                        let origin = this._piecePosition[action.origin.x][action.origin.y],
                            destination = this._piecePosition[action.destination.x][action.destination.y];
                        this._piecePosition[action.destination.x][action.destination.y] = origin;
                        this._piecePosition[action.origin.x][action.origin.y] = 0;
                        this.moveMaster.updateMap(this._piecePosition);

                        let reverseData = this.changeData(this._piecePosition);

                        if (this.control) {
                            this.control.updateTable(reverseData);
                        }
                        let boss,
                            length = 0,
                            col, row;
                        for (let n = 0; n < this._piecePosition.length; n++) {
                            for (let m = 0; m < this._piecePosition[0].length; m++) {
                                if (Math.abs(this._piecePosition[n][m]) == 7) {
                                    boss = this._piecePosition[n][m];
                                    col = n;
                                    row = m;
                                    length++;
                                }
                            }
                        }
                        if (length == 1) {
                            //将帅只有一个时候，游戏结束
                            this._winSide = boss > 0 ? "红色方" : "黑色方";
                            console.log(`游戏结束，胜利方是${boss > 0 ? "红色方" : "黑色方"}`);
                            this.requestOver();
                        } else if (length < 1) {
                            console.log("将帅棋子错误：", boss);
                        } else if (length == 2) {
                            let sign = false, direction;
                            this._piecePosition[col][row] > 0 ? direction = -1 : direction = 1;
                            for (let x = row + direction; x < this._piecePosition[0].length && x >= 0;) {
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
                                console.log(`游戏结束，胜利方是${this._winSide}`);
                                this.requestOver();
                            }
                        }
                        break;
                }
            }
        };

        requestOver(): void {
            super.requestOver();
            this.requestStart();
        }


        startMove(): void {
            // console.log("机器人执棋开始行动");
            if (this.playStatus == EGamerPlayStatus.START) {
                this.autoRequest();
            }
        }

        /**
         * 随机出牌的AI
         * */
        private autoRequest(): void {
            let all: INewAction[] = [];
            let first: INewAction[] = [];
            let back: INewAction;

            // all = this.getAll(this._piecePosition,this.side);
            // let number = Math.floor(Math.random() * all.length);
            // back = all[number];
            // this.server.requestMove(back);

            this.maxMinSearch(this._piecePosition, 0);
            this.server.requestMove(this._nextAction);
        }

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
        private judgeSituation(piece: number[][]): number {
            let situations = 0;
            // let piece = this.copyPosition(pieces);

            for (let n = 0; n < piece.length; n++) {
                for (let m = 0; m < piece[0].length; m++) {
                    situations += this.getPieceValue(piece[n][m]);
                }
            }


            return situations;

        }

        /**
         * 得到棋子的权重值
         * */
        private getPieceValue(piece: number): number {
            let back = 0;
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
        }


        /**
         * 复制棋盘
         * */
        private copyPosition(pieces: number[][]): number[][] {
            let back = [];
            for (let n = 0; n < pieces.length; n++) {
                back[n] = [];
                for (let m = 0; m < pieces[0].length; m++) {
                    back[n][m] = pieces[n][m];
                }
            }
            return back;
        }

        /**
         * 走一步棋以后整个的局势
         * */
        private movePiece(pieces: number[][], action: INewAction): number[][] {
            let piece = this.copyPosition(pieces);

            piece[action.destination.x][action.destination.y] = piece[action.origin.x][action.origin.y];
            piece[action.origin.x][action.origin.y] = 0;
            return piece;
        }

        private _nextAction: INewAction;

        // private _num:number = 0;
        /**
         * 极大极小值搜索
         * 拓展于深度优先搜索
         * */
        private maxMinSearch(piece: number[][], depth: number): number {
            // this._num++;
            //关于评价函数
            //1、使用评估函数返回局势
            if (depth == MIN_MAX_DEPTH) {
                return this.judgeSituation(piece);
            }

            let nSituation;
            if ((this.side + depth) % 2 == SIDE.RED) {
                nSituation = Number.NEGATIVE_INFINITY;//初始局势是无穷小
            } else {
                nSituation = Number.POSITIVE_INFINITY;//初始局势无穷大
            }

            //2、获得所有的子节点（当前情况下所有的步数）
            let copyPosition1 = this.copyPosition(piece);
            let side = (this.side + depth) % 2;//0
            let nextAction = this.getAll(copyPosition1, side);
            let getAction: INewAction = nextAction[0];
            nextAction.forEach((action, index) => {
                let copyPosition2 = this.copyPosition(copyPosition1);
                let nextPieces = this.movePiece(copyPosition2, action);

                let nTemp = this.maxMinSearch(nextPieces, depth + 1);

                if ((this.side + depth) % 2 == SIDE.RED) {
                    if (nTemp > nSituation) {
                        nSituation = nTemp;
                        getAction = action;
                    }
                    // nSituation = Math.max(nSituation, nTemp);
                } else {
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
        }

        /**
         * 得到既定棋盘下，某阵营所有行棋路线
         * @param piece:既定棋盘下
         * @param side:指定阵营
         * */
        private getAll(piece: number[][], side: number): INewAction[] { //sign：1当前红色棋子，0当前黑色棋子
            let all: INewAction[] = [];
            //首先遍历获得所有可以移动的棋子位置
            let point: egret.Point[] = [];
            let sign = side ? 1 : -1; //1代表红色棋子，-1代表黑色棋子
            for (let n = 0; n < 9; n++) {
                for (let m = 0; m < 10; m++) {
                    if (piece[n][m] * sign > 0) {
                        point.push(new egret.Point(n, m));
                    }
                }
            }

            //得到当时的行为控制器
            let moveMaster = new MoveMaster();
            moveMaster.updateMap(piece);

            point.forEach(origin => {
                let destinations = [];
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
                destinations.forEach(destination => {
                    let step: INewAction = {
                        origin: origin,
                        destination: destination
                    };
                    all.push(step);
                })

            });

            return all;
        }
    }
}