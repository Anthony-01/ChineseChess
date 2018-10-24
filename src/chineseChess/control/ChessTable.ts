namespace chess{

    export class ChessTable extends egret.Sprite implements IChessTableData{

        //棋盘视图
        view: GameView;
        //服务器
        server:GameServer;
        //对手玩家
        player:GamePlayerControl;
        //当前玩家
        currentPlay:GamePlayerControl;
        //棋盘上的棋子
        pieces:IPiece[] = [];
        //舞台
        mainStage:IMain;

        /*
        *
        * */
        onInit(p_server:GameServer,view:GameView,main:IMain):void{
            this.mainStage = main;
            this.server = p_server;
            //模拟服务器
            if(!this.server){
                this.server = new GameServer();
            }

            //初始化玩家
            let gamer = new GamePlayerControl();
            gamer.control = this;
            //玩家加入服务器
            this.server.onPlayerConnect(gamer);

            this.currentPlay = gamer;

            //视图
            this.view = view;

            this.view.control = this;

            console.log("控制器初始化完成");
        }

        /**
         * 开始游戏
         * */
        startGame(data:any):void{
            this.view.init(data);
            this.view.clearBorder();
        }

        /*
        * 更新棋盘
        * */
        updateTable(data:number[][],action?:any):void{
            //显示上次移动棋子的轨迹
            this.view.setTable(data);
            if(action){
                this.view.onMovePiece(action.origin,action.destination);
            }else{
                this.view.clearBorder();
            }
        }

        /*
        * 对手玩家连接服务器
        * */
        onPlayConnect(player:GamePlayerControl):void{
            this.player = player;
            this.server.onPlayerConnect(this.player);
        }

        /*
        * color颜色的玩家开始可以进行移动
        * */
        startMove(color:SIDE):void{
            // console.log(color);

            //control 设置游戏状态是否可行?
            if(this.currentPlay.side == color){
                this.view.startMove(color);
            }
        }

        resetButton():void{
            this.view.resetButton();
        }

        requestReady():void{
            this.currentPlay.requestStart();
        }

        //棋子移动
        onMovePiece(from:egret.Point,to:egret.Point):void{
            let data :INewAction = {
                origin:from,
                destination:to
            };
            this.currentPlay.requestMove(data);
        }

        getTargets(origin:egret.Point,type:number):egret.Point[]{
            return this.currentPlay.getTargets(origin,type);
        }

        showResult():void{
            //做成弹窗样式结算框
            this.mainStage.showResult();
        }


    }
}