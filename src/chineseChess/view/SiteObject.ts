namespace chess{

    /*
    * 位置对象，置于棋盘，用于放置棋子
    * */
    export class SiteObject extends egret.Sprite{

        position:egret.Point;

        piece:Piece = null;

        constructor(x:number,y:number){
            super();
            this.position = new egret.Point(x,y);
        }

        /*
        * 在该位置增加棋子
        * */
        addPiece(piece:Piece):void{
            this.piece = piece;
        }

        /*
        * 从该位置移除棋子
        * */
        removePiece():void{
            this.piece = null;
        }

        /*
        * 展示棋子被选择边框
        * */
        showChoose():void{

        }

        showTargetBorder():void{

        }

        showEatBorder():void{

        }
    }
}