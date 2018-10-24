namespace chess {

    /**
     * 玩家游戏状态
     * */
    export enum EGamerPlayStatus {
        //准备
        READY,
        //开始
        START,
        //结束
        OVER,
        //结算
        RESULT
    }

    /*
    * 象棋玩家接口
    * */
    export interface IGamePlayer {
        //玩家ID
        id:number;
        //是否该玩家执子走棋
        current:boolean;
        //阵营
        side:SIDE;
        //该玩家连接的服务器
        server:ActionServer;
        //玩家状态
        playStatus:EGamerPlayStatus

        //开始游戏
        startGame(data:number[][]):void;
        //准备操作
        readyForAction(action:IReadyAction):void;
        //验证操作
        assertAction(action:IChessAction):boolean;
        //完成操作
        applyAction(action:IChessAction):void;
        //撤销操作
        cancelAction(action:IChessAction):boolean;
        //向服务器发送请求移动
        requestMove(action:INewAction):void;
    }

    export interface INewAction{
        origin:egret.Point;
        destination:egret.Point;
    }
    /*
    * 象棋棋牌Table接口
    * */
    export interface IChessTableData {
        //棋盘
        view:IGameView;
        //服务器
        server:IServerSimulator;
        //对手玩家
        player:IGamePlayer;
        //当前玩家
        currentPlay:IGamePlayer;
        //棋盘上的棋子
        pieces:IPiece[];
        //初始化棋盘
        onInit(p_server:GameServer,view:GameView,main:IMain):void;
        //棋子移动
        onMovePiece(from:egret.Point,to:egret.Point):void;
    }

    /*
    * control 象棋游戏流程接口
    * */
    export interface GameControl extends IChessTableData{
        //玩家连接
        onTakeConnection(player:number):void;
        //游戏开始
        onGameStart():void;
        //游戏结束
        onGameOver():void;
    }

    export interface ILogMessage{

    }

}