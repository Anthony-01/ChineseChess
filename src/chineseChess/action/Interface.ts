namespace chess{

    export enum EChessGamer {
        MINE,//本家
        OPPOSITE,//对家
        NONE,//尚未有归属
    }

    /*
    * 游戏阶段
    * */
    export enum ECheRound {
        START,//开局
        RUNNING,//下棋
        END//结束
    }

    /**
     * 棋盘数据
     * 要将棋盘数据与玩家桌面上显示的数据区分开来，分为localPoint以及globalPoint//只做最后显示的处理
     * */
    export interface ITableData {
        //玩家列表
        gamers:ICheGamerData[];
        //当前轮次
        currentRound:ECheRound;
        //上一个操作玩家
        lastGamer:EChessGamer;
        //当前操作玩家
        currentGamer:EChessGamer;
        //准备操作
        readyAction(action:IReadyAction):void;
        //执行操作
        gamerAction(action:IChessAction):void;
    }

    /**
     * 玩家数据
     * */
    export interface ICheGamerData {
        //阵营
        side:EChessGamer,
        //上一个操作
        lastAction:IChessAction;
        //所有棋子
        pieces:Piece[];
    }

    /**
     * 玩家准备操作
     * */
    export interface IReadyAction {
        //玩家方位
        gamerID?:EChessGamer;
        //操作集合
        // actionMask:number;
        action:EChessAction;
        //上个玩家操作棋子
        lastDiscard?:Piece;
        tiles?:Piece;
        //操作目标
        destination?:egret.Point;
    }

    /**
     * 玩家操作数据
     * */
    export interface IChessAction {
        //座位号
        id?:number;
        //玩家阵营
        side?:SIDE;
        //操作
        action:EChessAction;
        //操作棋子,棋子中包含棋子位置
        origin?:egret.Point;
        //操作目标
        destination?:egret.Point;
    }

    /**
     * 玩家动作状态
     * */
    export enum EGamerActionStatus {
        USER_FREE,//玩家空闲
        USER_READY,//玩家准备
        ACTION_FREE,//操控空闲
        ACTION_READY,//准备操作
    }

    /**
     * 玩家操作类型枚举;象棋操作分为行进和吃，玩家的操作还有进入游戏以及退出游戏，选择棋子（=>显示）。将军
     * 麻将相关操作；行进操作需要对象需要阵营以及棋子的数据（包括类型以及原来的位置等）
     * */
    export enum EChessAction {
        JOIN        =0x200,
        LEFT        =0x201,
        MOVE        =0x01,  //行进
        EAT         =0x02,  //吃
        WARNING     =0x04,  //将军
        OVER        =0x08,  //结束
        CANCEL      =0xFFFF //取消
    }


}