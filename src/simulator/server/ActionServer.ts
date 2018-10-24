namespace chess {
    /**
     * 分管一个玩家，
     * 玩家所有的数据，包括状态等是否应该保存在此
     * 还是所有数据分散到客户端保存
     * */
    export class ActionServer implements IGamerActionHost{

        //座位号
        public index: number;

        //阵营
        side:SIDE;

        server: GameServer;

        //玩家模拟
        user: GamePlayerControl;

        //行为状态
        actionStatus: EGamerActionStatus;

        //用来识别操作是否能够进行?具体可以进行的操作?
        playStatus:EGamerPlayStatus;

        constructor() {
            this.actionStatus = EGamerActionStatus.USER_FREE;//初始化时座位处于空闲free状态
        }

        /**
         * 玩家的连接
         * @param user:玩家
        * */
        onTakenControl(user: GamePlayerControl): void {
            this.user = user;
            user.id = this.index;
            this.actionStatus = EGamerActionStatus.USER_READY;//进入准备状态
            this.user.connection(this);

            //全局消息，玩家进入
            this.server.dispatchAction({
                id: this.index,
                action: EChessAction.JOIN
            })
        }

        dispatchAction(action: IChessAction): void { //更新棋盘象棋操作
            if(this.user){
                this.user.applyAction(action);
            }
        }

        /**
         * 释放准备信号
         * */
        dispatchReady(action: IReadyAction): void {
            if(this.user){
                this.user.readyForAction(action);
            }
        }

        //开始游戏
        startGame(data:number[][]):void{
            this.actionStatus = EGamerActionStatus.ACTION_FREE;
            this.playStatus = EGamerPlayStatus.START;

            //传递初始的棋盘配置
            this.user.side = this.side;
            this.user.startGame(data);
        }

        private _action:EChessAction;

        readyForAction(action:IReadyAction):void{
            //准备进行操作
            this.actionStatus = EGamerActionStatus.ACTION_READY;
            this._action = action.action;
            switch (this._action){
                case EChessAction.MOVE:
                    //机器人的操作，立刻回调服务器的操作
                    // this.server.requestMove(this.index);

                    //正常：调用客户端方法，等待获得客户端的输入
                    this.startMove();

                    break;
                case EChessAction.EAT:
                    break;
                case EChessAction.WARNING:
                    break;
                case EChessAction.CANCEL:
                    break;
                default:
                    break;
            }
        }

        //验证操作
        assertAction(action:IChessAction):boolean{
            if(this.actionStatus != EGamerActionStatus.ACTION_READY){
                return false;
            }
            let actionID:EChessAction = action.action;//操作ID
            if(actionID = EChessAction.CANCEL){
                return this.assertCancel();//取消操作?
            }else{
                //麻将是根据玩家的手牌进行判断能否进行该操作
                //象棋转变思路，判断的依据该棋子能否移动到目的地
                //移动以及吃的操作，第一是棋本身能否移动到
                //第二是有没有其他棋堵住位置而不能移动
                //需要的信息，整个棋盘各个棋子的落位
                //遍历pieces
                return true;
            }
        };

        /**
         * 完成操作
         * */
        applyAction(action:IChessAction):void{
            this.server.dispatchAction(action);
        }

        /**
         * 取消操作
         * */
        cancelAction(action:IChessAction):void{
            console.log(`取消操作:${action}`);
        }

        /*
        * 轮到该玩家进行操作
        * */
        startMove():void{ //
            this.actionStatus = EGamerActionStatus.ACTION_READY;
            this.user.startMove();
        }

        private assertCancel():boolean{
            return
        }

        /*
        * 请求准备
        * */
        requestReady():void{
            // if(this.playStatus != EGamerPlayStatus.READY){
                // this.actionStatus = EGamerActionStatus.USER_READY;//进入准备状态
                this.playStatus = EGamerPlayStatus.READY;
                this.server.requestReady(this.index);
            // }
        }

        /*
        * 座位号为id的玩家请求移动
        * */
        requestMove(data:INewAction):void{
            this.server.requestMove(data,this.index,this.side);
        }

        /**
         * 请求结束游戏，显示结算
         * */
        requestOver():void{
            let data;
            this.server.requestOver(this.index);
        }
    }
}