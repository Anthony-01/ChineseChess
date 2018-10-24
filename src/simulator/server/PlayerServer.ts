namespace chess{
    export class PlayerServer extends ActionServer implements IGamerService{
        /**
         * 玩家连接服务
         * */
        onTakenControl(user:GamePlayerControl):void{
            this.user = user;
            user.id = this.index;
            this.actionStatus = EGamerActionStatus.USER_READY;//进入准备状态
            this.user.connection(this);

            //全局消息，玩家进入
            this.server.dispatchAction({
                side: this.index,
                action: EChessAction.JOIN
            })
        };
        /**
         * 全局消息
         * */
        dispatchAction(action:IChessAction):void{
            if(this.user){
                this.user.applyAction(action);
            }
        };
        /**
         * 准备信号
         * */
        dispatchReady(action:IReadyAction):void{
            if(this.user){
                this.user.readyForAction(action);
            }
        };
        /**
         * 移动请求
         * */
        requestMove(data:INewAction):void{
            this.server.requestMove(data,this.index,this.side);
        };
    }
}