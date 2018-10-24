var chess;
(function (chess) {
    /*
    *棋类
    * */
    var EChessType;
    (function (EChessType) {
        EChessType[EChessType["E_PAWN"] = 1] = "E_PAWN";
        EChessType[EChessType["E_CANNONS"] = 2] = "E_CANNONS";
        EChessType[EChessType["E_ROOK"] = 3] = "E_ROOK";
        EChessType[EChessType["E_KNIGHT"] = 4] = "E_KNIGHT";
        EChessType[EChessType["E_ELEPHANT"] = 5] = "E_ELEPHANT";
        EChessType[EChessType["E_GUARD"] = 6] = "E_GUARD";
        EChessType[EChessType["E_KING"] = 7] = "E_KING"; //将帅
    })(EChessType = chess.EChessType || (chess.EChessType = {}));
    /*
    * 楚汉
    * */
    var SIDE;
    (function (SIDE) {
        SIDE[SIDE["BLACK"] = 0] = "BLACK";
        SIDE[SIDE["RED"] = 1] = "RED";
    })(SIDE = chess.SIDE || (chess.SIDE = {}));
})(chess || (chess = {}));
