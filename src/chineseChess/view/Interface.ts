namespace chess {
    /*
    * 游戏表现暂时用console来代替
    * */
    export interface IGameView{
        onMovePiece(origin:egret.Point,destination:egret.Point):void
    }

    export interface IMain{
        showResult():void
    }
}