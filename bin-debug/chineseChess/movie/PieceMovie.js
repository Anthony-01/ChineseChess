var chess;
(function (chess) {
    //动画
    var PieceMovie = /** @class */ (function () {
        function PieceMovie() {
        }
        PieceMovie.prototype.movePiece = function (origin, destination, piece) {
            return new Promise(function (resolve) {
                // egret.Tween.get(piece).to{x:}
            });
        };
        return PieceMovie;
    }());
    chess.PieceMovie = PieceMovie;
})(chess || (chess = {}));
