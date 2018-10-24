namespace chess {
    export class Piece extends egret.Sprite implements IPiece {

        public static LINE_COLOR = [0xFF0000, 0x000000];

        /*
        * 各类棋基础行进方式
        * */
        // public static PIECE_TARGETS = {
        //     0: [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}],
        //     1: [{x: 1, y: 0}, {x: 0, y: 1}],
        //     2: [{x: 1, y: 0}, {x: 0, y: 1}],
        //     3: [{x: -1, y: 2}, {x: 1, y: 2}, {x: -1, y: -2}, {x: 1, y: -2}, {x: -2, y: 1}, {x: -2, y: -1}, {
        //         x: 2,
        //         y: 1
        //     }, {x: 2, y: -1}],
        //     4: [{x: -2, y: 2}, {x: 2, y: 2}, {x: -2, y: -2}, {x: 2, y: -2}],
        //     5: [{x: -1, y: 1}, {x: 1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}],
        //     6: [{x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0}]
        // };

        side: SIDE;
        //棋子坐标
        private cachePoint: egret.Point;
        //棋种类
        type: EChessType;
        //可行进路线
        targets: egret.Point[];
        private _lineColor:number;


        constructor(x: number, y: number, type: number) {
            super();

            this.point = new egret.Point(x, y);
            //通过种类决定棋子的行进方式
            this.type = Math.abs(type);
            this.side = type > 0 ? 1 : 0;
            this._lineColor = this.side > 0 ? Piece.LINE_COLOR[0] : Piece.LINE_COLOR[1];
            this.drawPiece();

            //添加事件
            this.touchEnabled = false;
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touched,this);
        }

        private touched(e:egret.Event):void{
            // this.parent.getMes(this.Point);
            // console.log(`${this.side}方${this.type}准备移动`);
        }

        set point(point:egret.Point){
            this.cachePoint = point;
            this.x = point.x * GameView.PIECE_WIDTH - GameView.PIECE_WIDTH/2;
            this.y = point.y * GameView.PIECE_WIDTH - GameView.PIECE_WIDTH/2;
        }

        get Point():egret.Point{
            return this.cachePoint;
        }

        /*
        * 棋子半径为25
        * 问题，画出来的如何移动
        * 如何加入到主容器当中
        * */
        private drawPiece(): void {
            // this.graphics.lineStyle(1, this._lineColor);//this.side > 0?0xFF0000:0x000000
            // this.graphics.beginFill(0xDEB887,0.7);
            // this.graphics.drawCircle(0, 0, 23);
            // this.graphics.endFill();
            //
            // //字
            // let label = new egret.TextField();
            // this.addChild( label );
            // label.width = 30;
            // label.height = 30;
            // label.x = -label.width/2;
            // label.y = -label.height/2;
            // label.fontFamily = "Impact";
            // label.textColor = this._lineColor;
            // label.text = this.getCText()[0];
            // label.textAlign = egret.HorizontalAlign.CENTER;
            // label.verticalAlign = egret.VerticalAlign.MIDDLE;
            let name = "";
            switch (Math.abs(this.type)) {
                case 1:
                    name = "pawn";
                    break;
                case 2:
                    name = "cannon";
                    break;
                case 3:
                    name = "rook";
                    break;
                case 4:
                    name = "knight";
                    break;
                case 5:
                    name = "bishop";
                    break;
                case 6:
                    name = "advisor";
                    break;
                case 7:
                    name = "king";
                    break;

            }
            name += this.side;
            name += "_png";
            let bitmap = new egret.Bitmap();
            bitmap.texture = RES.getRes(name);
            this.addChild(bitmap);
        }

        private getCText(): string[] {
            let T = [];
            switch (this.side?this.type:-this.type) {
                case (0):
                    return null;
                case (-1):
                    T[0] = "卒";
                    T[1] = "BR";
                    break;
                case (-2):
                    T[0] = "炮";
                    T[1] = "PR";
                    break;
                case (-3):
                    T[0] = "车";
                    T[1] = "JR";
                    break;
                case (-4):
                    T[0] = "马";
                    T[1] = "MR";
                    break;
                case (-5):
                    T[0] = "象";
                    T[1] = "XR";
                    break;
                case (-6):
                    T[0] = "士";
                    T[1] = "SR";
                    break;
                case (-7):
                    T[0] = "将";
                    T[1] = "J";
                    break;
                case (1):
                    T[0] = "兵";
                    T[1] = "BB";
                    break;
                case (2):
                    T[0] = "炮";
                    T[1] = "PB";
                    break;
                case (3):
                    T[0] = "车";
                    T[1] = "JB";
                    break;
                case (4):
                    T[0] = "马";
                    T[1] = "MB";
                    break;
                case (5):
                    T[0] = "相";
                    T[1] = "XB";
                    break;
                case (6):
                    T[0] = "士";
                    T[1] = "SB";
                    break;
                case (7):
                    T[0] = "帅";
                    T[1] = "S";
                    break;
                default :
                    return null;
            }
            return T;
        }

        /*
        * 更新该棋子的行进路线，需要整个棋盘的布局
        * */
        updateTargets(): void {

        }

        //棋子回收(被吃)
        recycle(source: string, subString: string): boolean {
            if(this.parent){
                this.parent.removeChild(this);
                return true;
            }else{
                return false;
            }
        };

        //棋子移动
        move(x: number, y: number): void {
            egret.Tween.get(this).to({})
        };

    }
}