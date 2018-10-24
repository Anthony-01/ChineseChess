namespace chess{


    /*
    *棋类
    * */
    export enum EChessType{
        E_PAWN = 1,//兵卒
        E_CANNONS = 2,//炮
        E_ROOK = 3,//车
        E_KNIGHT = 4,//马
        E_ELEPHANT = 5,//象
        E_GUARD = 6, //士
        E_KING = 7//将帅
    }
    /*
    * 楚汉
    * */
    export enum SIDE{
        BLACK = 0,
        RED = 1
    }
    /*
    * 棋子的动作
    * */
    export interface IActionPiece {
        /*
        * 棋子回收(被吃)
        * */
        recycle(source: string, subString: string): boolean;
        /*
        * 棋子移动
        * */
        move(x:number,y:number):void;
        /*
        * 更新该棋子的行进方式
        * */
        updateTargets():void
    }

    export interface IPiece extends IActionPiece{
        side:SIDE;
        //棋子坐标
        // point(value:egret.Point);
        //棋种类
        type:EChessType
    }
}