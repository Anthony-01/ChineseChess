namespace chess {
    export class GameView extends egret.Sprite implements IGameView {

        public static PIECE_WIDTH = 50;
        static LINE_COLOR = 0xDEB887;

        private _pieces: Piece[];

        control: ChessTable;

        constructor() {
            super();
            // this.width = GameView.PIECE_WIDTH * 8;
            // this.height = GameView.PIECE_WIDTH * 10;
            this.initTable();
            this.addButton();
            console.log("棋盘初始化完成");
        }

        /*
        * 初始化位置对象
        * */
        private initSites(): void {

        }

        private _startButton: Button;

        /**
         * 添加按钮
         * */
        private addButton(): void {
            this._startButton = new Button("开始");
            this._startButton.setEnable(true);
            this._startButton.x = GameView.PIECE_WIDTH * 3;
            this._startButton.y = GameView.PIECE_WIDTH * 10;
            this.addChild(this._startButton);
            this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
        }

        private startGame(): void {
            this.control.requestReady();
            this._startButton.setEnable(false);
        }

        resetButton(): void {
            this._startButton.setEnable(true);
        }

        InitMap: number[][];

        /*
        * 初始化象棋配置
        * */
        private initMap(): void {
            this.InitMap = [];
            for (let n = 0; n < 10; n++) {
                this.InitMap[n] = [];
            }
            this.InitMap[0][0] = -3;
            this.InitMap[9][0] = 3;
            this.InitMap[0][1] = -4;
            this.InitMap[9][1] = 4;
            this.InitMap[0][2] = -5;
            this.InitMap[9][2] = 5;
            this.InitMap[0][3] = -6;
            this.InitMap[9][3] = 6;
            this.InitMap[0][4] = -7;
            this.InitMap[9][4] = 7;
            this.InitMap[0][5] = -6;
            this.InitMap[9][5] = 6;
            this.InitMap[0][6] = -5;
            this.InitMap[9][6] = 5;
            this.InitMap[0][7] = -4;
            this.InitMap[9][7] = 4;
            this.InitMap[0][8] = -3;
            this.InitMap[9][8] = 3;

            this.InitMap[2][1] = -2;
            this.InitMap[7][1] = 2;
            this.InitMap[2][7] = -2;
            this.InitMap[7][7] = 2;
            this.InitMap[3][0] = -1;
            this.InitMap[6][0] = 1;
            this.InitMap[3][2] = -1;
            this.InitMap[6][2] = 1;
            this.InitMap[3][4] = -1;
            this.InitMap[6][4] = 1;
            this.InitMap[3][6] = -1;
            this.InitMap[6][6] = 1;
            this.InitMap[3][8] = -1;
            this.InitMap[6][8] = 1;
        }

        /**
         * 初始化
         * */
        init(data: any): void {
            this.setTable(data);
            this.initPiece();
        }

        /*
        * 根据参数直接更新棋盘
        * */
        setTable(data: number[][]): void {
            this.InitMap = data;
        }


        private _currentPiece: Piece;

        private _targetPiece: Piece;

        private _routerBorder: RouteBorder[] = [];


        /**
         *
         * */
        onMovePiece(origin: egret.Point, destination: egret.Point): void {
            //移动棋子，需要参数origin,destination
            this._pieces.forEach(piece => {
                if (piece.Point.x == origin.x && piece.Point.y == origin.y) {
                    this._currentPiece = piece;
                }
            });

            //检测目标点是否存在棋子
            let targetSign = false;
            let position = 0, target;
            this._pieces.forEach(piece => {
                if (piece.Point.x == destination.x && piece.Point.y == destination.y) {
                    this._targetPiece = piece;
                    targetSign = true;
                    target = position;
                }
                position++;
            });

            //先从棋子数组中移除目标棋子
            if (targetSign) {
                this.removeChild(this._targetPiece);
                this._pieces.splice(target, 1);
            }
            this._currentPiece.point = destination;

            if (this._routerBorder.length) {
                this._routerBorder.forEach(border => {
                    this.removeChild(border);
                });
                this._routerBorder = [];
            }
            let from = new RouteBorder(origin);
            let to = new RouteBorder(destination);
            this.addChild(from);
            this.addChild(to);

            this._routerBorder.push(from);
            this._routerBorder.push(to);

            // console.log("移动棋子");
        }

        clearBorder(): void {
            if (this._routerBorder.length) {
                this._routerBorder.forEach(border => {
                    this.removeChild(border);
                });
                this._routerBorder = [];
            }
        }

        /*
        * 绘制棋盘
        * */
        private initTable(): void {
            // //棋盘横线
            // for (let n = 0; n < 10; n++) {
            //     this.graphics.lineStyle(2, GameView.LINE_COLOR);
            //     this.graphics.moveTo(0, n * GameView.PIECE_WIDTH);
            //     this.graphics.lineTo(GameView.PIECE_WIDTH * 8, n * GameView.PIECE_WIDTH);
            // }
            //
            // //棋盘竖线
            // for (let n = 0; n < 9; n++) {
            //     if (n == 0 || n == 8) {
            //         this.graphics.lineStyle(2, GameView.LINE_COLOR);
            //         this.graphics.moveTo(n * GameView.PIECE_WIDTH, 0);
            //         this.graphics.lineTo(n * GameView.PIECE_WIDTH, GameView.PIECE_WIDTH * 9);
            //     } else {
            //         this.graphics.lineStyle(2, GameView.LINE_COLOR);
            //         this.graphics.moveTo(n * GameView.PIECE_WIDTH, 0);
            //         this.graphics.lineTo(n * GameView.PIECE_WIDTH, GameView.PIECE_WIDTH * 4);
            //
            //         this.graphics.lineStyle(2, GameView.LINE_COLOR);
            //         this.graphics.moveTo(n * GameView.PIECE_WIDTH, GameView.PIECE_WIDTH * 5);
            //         this.graphics.lineTo(n * GameView.PIECE_WIDTH, GameView.PIECE_WIDTH * 9);
            //     }
            // }
            //
            // //绘制九宫格
            // this.graphics.lineStyle(2, GameView.LINE_COLOR);
            // this.graphics.moveTo(3 * GameView.PIECE_WIDTH, 0);
            // this.graphics.lineTo(GameView.PIECE_WIDTH * 5, 2 * GameView.PIECE_WIDTH);
            //
            // this.graphics.lineStyle(2, GameView.LINE_COLOR);
            // this.graphics.moveTo(5 * GameView.PIECE_WIDTH, 0);
            // this.graphics.lineTo(GameView.PIECE_WIDTH * 3, 2 * GameView.PIECE_WIDTH);
            //
            // this.graphics.lineStyle(2, GameView.LINE_COLOR);
            // this.graphics.moveTo(3 * GameView.PIECE_WIDTH, 9 * GameView.PIECE_WIDTH);
            // this.graphics.lineTo(GameView.PIECE_WIDTH * 5, 7 * GameView.PIECE_WIDTH);
            //
            // this.graphics.lineStyle(2, GameView.LINE_COLOR);
            // this.graphics.moveTo(5 * GameView.PIECE_WIDTH, 9 * GameView.PIECE_WIDTH);
            // this.graphics.lineTo(GameView.PIECE_WIDTH * 3, 7 * GameView.PIECE_WIDTH);

            let table = new egret.Bitmap();
            table.texture = RES.getRes("background_png");
            let num = 500;
            let rate = table.width / num;
            table.width = num;
            table.height = table.height / rate;
            this.addChild(table);
            table.x = -50;
            table.y = -50;
        }


        /*
        * 直接更新棋盘
        * */
        private initPiece(): void {
            //移除旧有的棋子
            let self = this;
            if (this._pieces) {
                this._pieces.forEach(piece => {
                    self.removeChild(piece);
                })
            }
            this._pieces = [];
            for (let n = 0; n < 9; n++) {
                for (let m = 0; m < 10; m++) {
                    if (!!this.InitMap[n][m]) {
                        let piece = new Piece(n, m, this.InitMap[n][m]);
                        piece.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchPiece, this);
                        this.addChild(piece);
                        this._pieces.push(piece);
                    }
                }
            }
        }

        /*
        * color方的玩家可以进行移动
        * */
        startMove(color: SIDE): void {
            // if(this.){}
            this._pieces.forEach(piece => {
                if (piece.side == color) {
                    piece.touchEnabled = true;
                }
            })
        }


        private _origin: egret.Point;

        touchPiece(evt: egret.TouchEvent) {
            // console.log(evt.target);
            evt.stopPropagation();
            //得到初始的位置以后，计算可以移动到的位置
            this._origin = evt.target.Point;
            let origin = evt.target.Point;
            let type = evt.target.type;
            let targets = this.control.getTargets(origin, type);
            this.showTargets(targets);

            // console.log(targets);

            // this.control.onMovePiece(origin,new egret.Point(origin.x,origin.y-1));

            //点击棋子以后显示棋盘上可以点击的空位
        }


        private _border: PieceBorder[] = [];
        private _targets: egret.Point[] = [];

        //展示可以移动到的位置
        private showTargets(points: egret.Point[]): void {
            this._targets = points;
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.adjustAction, this);

            if (this._border.length) {
                this._border.forEach(border => {
                    this.removeChild(border);
                });
                this._border = [];
            }
            points.forEach(point => {
                let sprite = new PieceBorder(point);
                this._border.push(sprite);
                this.addChild(sprite);
            });

            //在整个棋盘上添加点击事件
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.adjustAction, this, true);
            // this.touchEnabled = true;
            // console.log(this);
            //整个棋盘加上点击事件，判断点击的位置来决定是否发送移动请求

            //直接在border上面加点击事件
            this._border.forEach(border => {
                border.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchPosition, this);
            })
            // console.log(this._border);
        }

        private touchPosition(evt: egret.TouchEvent): void { //
            evt.stopPropagation();//阻止向上冒泡
            let border = evt.currentTarget,
                self = this;
            // console.log(border);
            border.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchPosition, this);
            let destination = evt.currentTarget.point;

            for (let n = 0; n < this._targets.length; n++) {
                let point = this._targets[n];
                if (point.x == destination.x && point.y == destination.y) {
                    // console.log("可以到达点：", destination);
                    if (self._border.length) {
                        self._border.forEach(border => {
                            self.removeChild(border);
                        });
                        self._border = [];
                    }
                    this.stopMove();
                    this.control.onMovePiece(this._origin, destination);
                    border.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchPosition, this);
                    break;
                }
            }
        }

        private stopMove(): void {
            this._pieces.forEach(piece => {
                piece.touchEnabled = false;
            })
        }

        private adjustAction(evt: egret.TouchEvent): void {
            // console.log(evt);
            let self = this;
            let x = evt.stageX,
                y = evt.stageY;
            let destination = new egret.Point((x - 120) / GameView.PIECE_WIDTH, Math.round((y - 320) / GameView.PIECE_WIDTH));
            for (let n = 0; n < this._targets.length; n++) {
                let point = this._targets[n];
                if (point.x == destination.x && point.y == destination.y) {
                    // console.log("可以到达点：", destination);
                    if (self._border.length) {
                        self._border.forEach(border => {
                            self.removeChild(border);
                        });
                        self._border = [];
                    }
                    this.control.onMovePiece(this._origin, destination);
                    this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.adjustAction, this, true);
                    break;
                }
            }
        }
    }
}