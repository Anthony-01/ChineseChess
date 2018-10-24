var chess;
(function (chess) {
    /**
     * 玩家游戏状态
     * */
    var EGamerPlayStatus;
    (function (EGamerPlayStatus) {
        //准备
        EGamerPlayStatus[EGamerPlayStatus["READY"] = 0] = "READY";
        //开始
        EGamerPlayStatus[EGamerPlayStatus["START"] = 1] = "START";
        //结束
        EGamerPlayStatus[EGamerPlayStatus["OVER"] = 2] = "OVER";
        //结算
        EGamerPlayStatus[EGamerPlayStatus["RESULT"] = 3] = "RESULT";
    })(EGamerPlayStatus = chess.EGamerPlayStatus || (chess.EGamerPlayStatus = {}));
})(chess || (chess = {}));
