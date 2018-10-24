namespace chess{
    export class ActionExecute{

        //玩家
        host:GamePlayerControl;

        constructor(host:GamePlayerControl){
            this.host =  host;
        }

        /*
        * 验证操作
        * */
        assertAction(action:IChessAction):boolean{

            return
        }
    }
}