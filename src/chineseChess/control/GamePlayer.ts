namespace chess {

    const RED_FROM = ["九", "八", "七", "六", "五", "四", "三", "二", "一"];
    const BLACK_FROM = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const RED_PIECE = ["兵", "炮", "车", "马", "相", "士", "帅"];
    const BLACK_PIECE = ["卒", "炮", "车", "马", "象", "士", "将"];


    export class GamePlayerControl implements IGamePlayer {

        //玩家ID
        id: number;
        //是否该玩家执子走棋
        current: boolean;
        //楚汉
        side: SIDE;

        server: ActionServer;

        //游戏界面控制
        control: ChessTable;

        //行为控制器
        private _actionMaster: ActionExecute;

        moveMaster: MoveMaster;


        //玩家列表下可以行动的棋子
        piece: Piece[];

        playStatus: EGamerPlayStatus;

        constructor() { //参数需要服务器
            // this.server = server;
            // this.playStatus = this.updateStatus();
            this.playStatus = EGamerPlayStatus.READY;
            this.moveMaster = new MoveMaster();
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
        actionPatcher(data: any): void {

        }

        /*
        * 连接服务器,onJoinServer
        * */
        connection(server: ActionServer): void {
            this.server = server;
        }

        _piecePosition: number[][] = [];

        /*
        * 游戏开始,传入的数据是各个棋子的位置以及类型
        * 客户端接收消息
        * */
        startGame(data: number[][]): void {
            //此处是否是调用连接服务器的操作
            //根据side将全局位置转变成本地位置
            for (let n = 0; n < data.length; n++) {
                this._piecePosition[n] = [];
                for (let m = 0; m < data[0].length; m++) {
                    this._piecePosition[n][m] = data[n][m];
                }
            }

            this.playStatus = EGamerPlayStatus.START;
            this.moveMaster.updateMap(this._piecePosition);
            if (this.control) {
                let reverseData = this.changeData(this._piecePosition);
                this.control.startGame(reverseData);
            }
        }

        //全局坐标与本地坐标转换
        public changeData(data: number[][]): number[][] {
            if (this.side == SIDE.RED) {
                return data;
            } else {
                //x,y轴全都对称变化
                let back = [];
                for (let n = 0; n < 9; n++) {
                    let arr = [];
                    for (let m = 0; m < 10; m++) {
                        arr[m] = data[8 - n][9 - m];
                    }
                    back[n] = arr;
                }
                // console.log(back);
                return back;
            }
        }

        //单个坐标本地与全局坐标的转换
        private changeSinger(origin: egret.Point): egret.Point {
            if (this.side == SIDE.RED) {
                return origin;
            } else {
                let back = new egret.Point(8 - origin.x, 9 - origin.y);
                return back;
            }
        }


        //准备操作
        readyForAction(action: IReadyAction): void {
            console.log(`玩家进入座位${this.id}`);
        };

        //验证操作
        assertAction(action: IChessAction): boolean {
            return
        };

        /*
        * 响应操作
        * 客户端接收服务器的消息
        * */
        applyAction(action: IChessAction): void {
            // if(this.playStatus == EGamerPlayStatus.START ){
            switch (action.action) {
                case EChessAction.MOVE:
                    //更改棋盘
                    this.log(action);
                    let origin = this._piecePosition[action.origin.x][action.origin.y],
                        destination = this._piecePosition[action.destination.x][action.destination.y];
                    this._piecePosition[action.destination.x][action.destination.y] = origin;
                    this._piecePosition[action.origin.x][action.origin.y] = 0;
                    this.moveMaster.updateMap(this._piecePosition);

                    let reverseData = this.changeData(this._piecePosition);

                    if (this.control) {
                        let router = {
                            origin: this.changeSinger(action.origin),
                            destination: this.changeSinger(action.destination)
                        };

                        this.control.updateTable(reverseData, router);
                    }
                    //如何判断游戏结束
                    //通过piecePosition判断游戏结束，主将直面游戏结束
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
                        for (let x = row + direction; x < this._piecePosition[0].length && x >= 0; ) {
                            if(this._piecePosition[col][x] != 0){
                                if(Math.abs(this._piecePosition[col][x]) == 7){
                                    sign = true;
                                }
                                break;
                            }
                            x += direction;
                        }
                        if(sign){
                            this._winSide = action.side?"黑色方":"红色方";
                            console.log(`游戏结束，胜利方是${this._winSide}`);
                            this.requestOver();
                        }
                    }
                    break;
                case EChessAction.OVER:
                    // if(action.id == this.id){
                    console.log(this._chessboard);
                    this.showResult();
                    // }
                    break;
            }
            // }
        };

        public _winSide: string;

        private showResult(): void {
            if (this.control) {
                this.control.showResult();
                this.control.resetButton();
            }
        }

        requestStart(): void {
            this.server.requestReady();
        }

        requestOver(): void { //请求结束游戏
            // console.log("请求游戏结束");
            if (this.playStatus == EGamerPlayStatus.START) {
                this.playStatus = EGamerPlayStatus.OVER;//结束
                this.server.requestOver();
            }
        }

        private _chessboard: string[] = [];

        private log(action: IChessAction): void {
            let type,
                from,
                destination,//进、退、平
                to;
            let fromFun, typeFunc;
            let origin = this._piecePosition[action.origin.x][action.origin.y];
            let sign = action.destination.y - action.origin.y;
            if (sign > 0) {
                if (origin > 0) {
                    destination = "退";
                } else {
                    destination = "进";
                }
            } else if (sign == 0) {
                destination = "平";
            } else {
                if (origin > 0) {
                    destination = "进";
                } else {
                    destination = "退";
                }
            }
            if (origin > 0) { //不需要空格
                fromFun = RED_FROM;
                typeFunc = RED_PIECE;
                if ((Math.abs(origin) == 2 || Math.abs(origin) == 3 || Math.abs(origin) == 1) && sign != 0) {
                    this._chessboard.push(`${typeFunc[Math.abs(origin) - 1]}${fromFun[action.origin.x]}${destination}${fromFun[9 - Math.abs(sign)]}`);
                    console.log(`${typeFunc[Math.abs(origin) - 1]}${fromFun[action.origin.x]}${destination}${fromFun[9 - Math.abs(sign)]}`);
                } else {
                    this._chessboard.push(`${typeFunc[Math.abs(origin) - 1]}${fromFun[action.origin.x]}${destination}${fromFun[action.destination.x]}`)
                    console.log(`${typeFunc[Math.abs(origin) - 1]}${fromFun[action.origin.x]}${destination}${fromFun[action.destination.x]}`);
                }
            } else { //空格
                fromFun = BLACK_FROM;
                typeFunc = BLACK_PIECE;
                if ((Math.abs(origin) == 2 || Math.abs(origin) == 3 || Math.abs(origin) == 1) && sign != 0) {
                    this._chessboard.push(`   ${typeFunc[Math.abs(origin) - 1]}${fromFun[action.origin.x]}${destination}${fromFun[Math.abs(sign) - 1]}`);
                    console.log(`   ${typeFunc[Math.abs(origin) - 1]}${fromFun[action.origin.x]}${destination}${fromFun[Math.abs(sign) - 1]}`);
                } else {
                    this._chessboard.push(`   ${typeFunc[Math.abs(origin) - 1]}${fromFun[action.origin.x]}${destination}${fromFun[action.destination.x]}`);
                    console.log(`   ${typeFunc[Math.abs(origin) - 1]}${fromFun[action.origin.x]}${destination}${fromFun[action.destination.x]}`);
                }
            }
        }

        //撤销操作
        cancelAction(action: IChessAction): boolean {
            return
        };

        /*
        * 玩家执棋
        * */
        startMove(): void {
            // console.log(`玩家${this.id}执棋开始行动`);
            //首先是touchEnabled
            if (this.control) {
                this.control.startMove(this.side);
            }
        }

        /*
        * 发送消息给服务器，通知行棋过程
        * data:需要初始的位置，目标的位置（），位置是全局坐标；
        * */
        requestMove(data: INewAction): void {
            //现在就改变本地棋盘
            let back: INewAction = {
                origin: this.changeSinger(data.origin),
                destination: this.changeSinger(data.destination)
            };
            this.server.requestMove(back);
        }

        getTargets(origin: egret.Point, type: number): egret.Point[] {
            let globalOrigin = this.changeSinger(origin);//转化为全局坐标
            let back = [];
            let globalTargets = [];
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

            globalTargets.forEach(point => { //转化为本地坐标
                back.push(this.changeSinger(point));
            });
            return back;
        }
    }
}