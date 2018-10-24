namespace chess {
    export class RouteBorder extends egret.Sprite{

        point:egret.Point;

        constructor(point:egret.Point){
            super();
            this.point = point;
            this.drawBorder();
            this.x = this.point.x * GameView.PIECE_WIDTH;
            this.y = this.point.y * GameView.PIECE_WIDTH;
        }

        drawBorder():void{
            this.graphics.lineStyle(3, 0x3CB371);//deb887
            // this.graphics.drawRect(0,0,GameView.PIECE_WIDTH,GameView.PIECE_WIDTH);
            this.graphics.moveTo(-25,-15);
            this.graphics.lineTo(-25,-25);
            this.graphics.lineTo(-15,-25);
            this.graphics.moveTo(15,-25);
            this.graphics.lineTo(25,-25);
            this.graphics.lineTo(25,-15);
            this.graphics.moveTo(25,15);
            this.graphics.lineTo(25,25);
            this.graphics.lineTo(15,25);
            this.graphics.moveTo(-15,25);
            this.graphics.lineTo(-25,25);
            this.graphics.lineTo(-25,15);
            this.graphics.endFill();
        }
    }
}