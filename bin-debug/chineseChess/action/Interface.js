var chess;
(function (chess) {
    var EChessGamer;
    (function (EChessGamer) {
        EChessGamer[EChessGamer["MINE"] = 0] = "MINE";
        EChessGamer[EChessGamer["OPPOSITE"] = 1] = "OPPOSITE";
        EChessGamer[EChessGamer["NONE"] = 2] = "NONE";
    })(EChessGamer = chess.EChessGamer || (chess.EChessGamer = {}));
    /*
    * 游戏阶段
    * */
    var ECheRound;
    (function (ECheRound) {
        ECheRound[ECheRound["START"] = 0] = "START";
        ECheRound[ECheRound["RUNNING"] = 1] = "RUNNING";
        ECheRound[ECheRound["END"] = 2] = "END"; //结束
    })(ECheRound = chess.ECheRound || (chess.ECheRound = {}));
    /**
     * 玩家动作状态
     * */
    var EGamerActionStatus;
    (function (EGamerActionStatus) {
        EGamerActionStatus[EGamerActionStatus["USER_FREE"] = 0] = "USER_FREE";
        EGamerActionStatus[EGamerActionStatus["USER_READY"] = 1] = "USER_READY";
        EGamerActionStatus[EGamerActionStatus["ACTION_FREE"] = 2] = "ACTION_FREE";
        EGamerActionStatus[EGamerActionStatus["ACTION_READY"] = 3] = "ACTION_READY";
    })(EGamerActionStatus = chess.EGamerActionStatus || (chess.EGamerActionStatus = {}));
    /**
     * 玩家操作类型枚举;象棋操作分为行进和吃，玩家的操作还有进入游戏以及退出游戏，选择棋子（=>显示）。将军
     * 麻将相关操作；行进操作需要对象需要阵营以及棋子的数据（包括类型以及原来的位置等）
     * */
    var EChessAction;
    (function (EChessAction) {
        EChessAction[EChessAction["JOIN"] = 512] = "JOIN";
        EChessAction[EChessAction["LEFT"] = 513] = "LEFT";
        EChessAction[EChessAction["MOVE"] = 1] = "MOVE";
        EChessAction[EChessAction["EAT"] = 2] = "EAT";
        EChessAction[EChessAction["WARNING"] = 4] = "WARNING";
        EChessAction[EChessAction["OVER"] = 8] = "OVER";
        EChessAction[EChessAction["CANCEL"] = 65535] = "CANCEL"; //取消
    })(EChessAction = chess.EChessAction || (chess.EChessAction = {}));
})(chess || (chess = {}));
