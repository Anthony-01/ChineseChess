var chess;
(function (chess) {
    var EChessGameStatus;
    (function (EChessGameStatus) {
        EChessGameStatus[EChessGameStatus["getReady"] = 0] = "getReady";
        EChessGameStatus[EChessGameStatus["start"] = 1] = "start";
        EChessGameStatus[EChessGameStatus["gameOver"] = 2] = "gameOver";
        EChessGameStatus[EChessGameStatus["showResult"] = 3] = "showResult"; //显示结算
    })(EChessGameStatus = chess.EChessGameStatus || (chess.EChessGameStatus = {}));
})(chess || (chess = {}));
