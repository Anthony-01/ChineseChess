namespace chess{

    //动画

    export class PieceMovie{
        constructor(){

        }

        movePiece(origin:egret.Point,destination:egret.Point,piece:Piece):Promise<void>{
            return new Promise(resolve=>{
                // egret.Tween.get(piece).to{x:}
            })
        }
    }
}