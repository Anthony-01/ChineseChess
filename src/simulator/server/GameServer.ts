namespace chess {

    /*
    * 服务器如何交互控制玩家进行操作
    * 从移动请求中提取上一个进行操作的玩家
    * 然后再广播的时候，遍历不同的方向的玩家
    * 让该玩家进行移动操作
    * 关于阵营分配，不同座位的玩家根据服务器给出的消息来更换阵营
    *
    * */

    export class GameServer implements IServerSimulator {

        gameStatus: EChessGameStatus;

        //服务器中控制两个gamer部分
        gamers: ActionServer[] = [];

        // 当前操作阵营
        currentSide: SIDE;

        constructor() {
            // 游戏状态
            this.gameStatus = EChessGameStatus.getReady;
            //加入机器人，准备开始游戏

            for (let n = 0; n < 2; n++) {
                let gamer = new ActionServer();
                gamer.index = n;
                gamer.server = this;
                this.gamers.push(gamer);
            }
        }

        //玩家连接
        onPlayerConnect(player: GamePlayerControl): void {
            //如何让玩家控制table
            if (this.gameStatus == EChessGameStatus.getReady) { //准备中
                for (let n = 0; n < this.gamers.length; n++) {
                    //检查哪个座位空闲
                    if (this.gamers[n].actionStatus == EGamerActionStatus.USER_FREE) {
                        this.gamers[n].onTakenControl(player);
                        console.log(`玩家连接于${n}号座位`);
                        break;
                    }
                }
                // this.checkStart();
            } else {
                console.log('房间玩家已满');
            }
        };

        private checkStart(): void {
            if (this.gameStatus == EChessGameStatus.getReady) {
                let gamers = this.gamers;
                let totalGamers = gamers.length;
                //遍历玩家状态
                for (let i = 0; i < totalGamers; i++) {
                    if (gamers[i].actionStatus == EGamerActionStatus.USER_FREE) {
                        console.warn("开始游戏失败，座位未满");
                        return;
                    }else if(gamers[i].playStatus != EGamerPlayStatus.READY){
                        console.warn(`${i}玩家未准备`);
                        return;
                    }
                }
                this.gameStart();
            }
        }

        /**
         * 发送全局消息
         * @param action:行为
         * */
        dispatchAction(action: IChessAction) {
            this.gamers.forEach(gamer => { //应用新的客户端表现
                gamer.dispatchAction(action);
            });
        }

        /**
         * 释放准备信号
         * @param action:准备动作
         * */
        dispatchReady(action: IReadyAction) {
            this.gamers.forEach(gamer => {
                gamer.dispatchReady(action);
            })
        }

        private InitMap: number[][] = [];

        /**
         * 初始化棋盘配置
         * */
        private initPieces(): void {
            for (let n = 0; n < 9; n++) {
                let arr = [];
                for (let m = 0; m < 10; m++) {
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
        }

        private gameStart(): void {
            console.log("游戏开始");
            //初始化棋盘配置
            this.initPieces();
            this.gameStatus = EChessGameStatus.start;

            //取随机方为红色方
            let randomNumber = Math.round(Math.random());
            this.gamers[0].side = randomNumber;
            this.gamers[1].side = randomNumber ? 0 : 1;
            //通知客户端开始游戏
            this.gamers.forEach(gamer => {
                gamer.startGame(this.InitMap);
            });
            this.currentSide = SIDE.RED;
            //通知红色方的客户端进行操作
            this.gamers.forEach(gamer => {
                if (gamer.side == this.currentSide) {
                    gamer.readyForAction({ //
                        action: EChessAction.MOVE
                    });
                }
            });
        };
        /**
         * 验证玩家操作是否规范
         * */
        private checkAction(action: any): boolean {
            let back;
            console.log("验证操作");
            return back;
        };

        /**
         *
         * */
        requestReady(id:number):void{
            this.gameStatus = EChessGameStatus.getReady;
            this.checkStart();
        }

        /**
         * 玩家请求移动
         * @param data:包含origin初始点以及destination目标点
         * @param id:座位号
         * @param side:阵营
         * */
        requestMove(data: INewAction, id: number, side: SIDE): void {
            //首先验证游戏状态，玩家是否可以移动
            if (this.gameStatus == EChessGameStatus.start) {
                let action: IChessAction = {
                    id: id,
                    side: side,
                    action: EChessAction.MOVE,
                    origin: data.origin,
                    destination: data.destination
                };
                //广播该行为->所有客户端表现做出改变
                this.dispatchAction(action);
                //一方移动完毕以后，服务端通知下一个客户端进行移动操作
                this.currentSide = action.side ? SIDE.BLACK : SIDE.RED;
                this.gamers.forEach(gamer => {
                    if (gamer.side == this.currentSide) {
                        gamer.readyForAction({ //
                            action: EChessAction.MOVE
                        });
                    }
                });
            } else {
                console.log("玩家请求移动错误");
            }
        }

        /**
         * 游戏结束时，每个客户端都会请求一次
         * @param id:座位号
         * */
        requestOver(id: number): void {
            if (this.gameStatus = EChessGameStatus.start) {
                this.gameStatus = EChessGameStatus.gameOver;
                let action = {
                    id:id,
                    action:EChessAction.OVER
                };
                this.gamers[id].dispatchAction(action);
                console.log(`通知座位号为${id}的客户端结束，显示相应结算界面`);
            }
        }
    }
}