namespace chess{
    export class PieceBorder extends egret.Sprite{
        point:egret.Point;

        constructor(point:egret.Point){
            super();
            this.touchEnabled = true;
            this.updatePoint(point);
            this.drawCir();
        }

        updatePoint(point:egret.Point):void{
            this.point = point;
        }

        private drawCir():void{
            this.graphics.lineStyle(2, 0x3CB371);//this.side > 0?0xFF0000:0x000000，00008b
            this.graphics.beginFill(0xDEB887,0);
            this.graphics.drawCircle(0, 0, 25);
            this.graphics.endFill();
            this.x = this.point.x * GameView.PIECE_WIDTH;
            this.y = this.point.y * GameView.PIECE_WIDTH;
        }
    }
}