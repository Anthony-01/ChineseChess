var chess;
(function (chess) {
    var ActionExecute = /** @class */ (function () {
        function ActionExecute(host) {
            this.host = host;
        }
        /*
        * 验证操作
        * */
        ActionExecute.prototype.assertAction = function (action) {
            return;
        };
        return ActionExecute;
    }());
    chess.ActionExecute = ActionExecute;
})(chess || (chess = {}));
