namespace chess{

    /**
     * 玩家模拟
     * */
    export interface IGamerSimulator {
        //位置
        id:number;
        //加入服务器
        onJoinServer(service:IServerSimulator):void;
        //准备操作
        readyForAction(action:IReadyAction):void;
        //应用行动
        applyAction(action:IChessAction):void;
    }

    export enum EChessGameStatus {
        getReady = 0,//准备中
        start = 1,//游戏开始
        gameOver = 2, //游戏结束
        showResult =3 //显示结算
    }

    export interface IAuto {
        situation:number;
        action:INewAction;
    }
    /*
    * 模拟游戏服务器
    * */
    export interface IServerSimulator{
        /**
         * 游戏状态
         * */
        gameStatus:EChessGameStatus;
        /**
         * 玩家列表
         * */
        gamers:ActionServer[];
        /**
         * 当前操作阵营
         * */
        currentSide:SIDE;
        /**
         * 玩家连接
         * */
        onPlayerConnect(player:GamePlayerControl):void;
        /**
         * 全局发送消息
         * */
        dispatchAction(action:IChessAction):void;
        /**
         * 发送准备消息
         * */
        dispatchReady(action:IReadyAction):void;
        /**
         * 请求移动
         * */
        requestMove(data:INewAction,id:number,side:SIDE):void;
        /**
         * 请求结束
         * */
        requestOver(id:number):void;
    }

    /**
     * 服务器调用接口
     * 玩家数据以及行为数据
     * 向客户端传递通信
     */
    export interface IGamerActionHost{
        /*
        * 服务器
        * */
        server:GameServer;
        /*
        * 座位
        * */
        index:number;
        /**
         * 阵营
         * */
        side:SIDE;
        /**
         * 行为状态
         * */
        actionStatus:EGamerActionStatus;
        /**
         * 游戏状态
         * */
        playStatus:EGamerPlayStatus;
        /**
         * 准备操作
         * */
        readyForAction(action:IReadyAction):void;
        /**
         * 验证操作
         * */
        assertAction(action:IChessAction):boolean;
        /**
         * 完成操作
         * */
        applyAction(action:IChessAction):void;
        /**
         * 取消操作
         * */
        cancelAction(action:IChessAction):void;
        /**
         * 开始游戏
         * */
        startGame(data:any):void
    }

    /**
     * 客户端调用接口
     * 向服务器传递通信
     * */
    export interface IGamerService{
        /**
         * 玩家连接服务
         * */
        onTakenControl(user:GamePlayerControl):void;
        /**
         * 全局消息
         * */
        dispatchAction(action:IChessAction):void;
        /**
         * 准备信号
         * */
        dispatchReady(action:IReadyAction):void;
        /**
         * 移动请求
         * */
        requestMove(action:INewAction,id:number):void;
    }
}