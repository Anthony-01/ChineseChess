var chess;
(function (chess) {
    /*
    * 移动位置控制器
    * */
    var MoveMaster = /** @class */ (function () {
        function MoveMaster() {
        }
        MoveMaster.prototype.updateMap = function (map) {
            this.map = map;
        };
        /*
        * 兵移动位置预测
        * point:棋子的位置
        * side:阵营
        * return where can move
        * */
        MoveMaster.prototype.binMove = function (point, side) {
            var back = [];
            var pass, //标志是否过河
            direction = 0, //方向
            sign = side ? 1 : -1;
            if (side == chess.SIDE.RED) {
                pass = point.y < 5; //y指的是行
                direction = -1;
            }
            else {
                pass = point.y > 4;
                direction = 1;
            }
            if (point.y + direction >= 0 && point.y + direction <= this.map.length) {
                if (this.map[point.x][point.y + direction] * sign <= 0) {
                    var target = new egret.Point(point.x, point.y + direction);
                    back.push(target);
                }
            }
            if (pass) {
                //剔除越界的情况
                if (point.x - 1 >= 0) {
                    if (this.map[point.x - 1][point.y] * sign <= 0) {
                        back.push(new egret.Point(point.x - 1, point.y));
                    }
                }
                if (point.x + 1 <= 8) {
                    if (this.map[point.x + 1][point.y] * sign <= 0) {
                        back.push(new egret.Point(point.x + 1, point.y));
                    }
                }
            }
            else {
                // back.push(new egret.Point(point.x, point.y + direction));
            }
            return back;
        };
        /*
        * 炮
        * */
        MoveMaster.prototype.paoMove = function (point, side) {
            var back = [];
            for (var direction = 0; direction < 4; direction++) {
                back = back.concat(this.paoMove_(point, direction, side));
            }
            return back;
        };
        MoveMaster.prototype.paoMove_ = function (point, direction, side) {
            var _this = this;
            var back = [];
            var col = point.x, row = point.y;
            var rowAdd = 0, colAdd = 0, sign = side ? 1 : -1; //
            var adjust;
            switch (direction) {
                case 0:
                    adjust = function (q, w) { return q >= 0; };
                    colAdd = -1;
                    break;
                case 1:
                    adjust = function (q, w) { return w >= 0; };
                    rowAdd = -1;
                    break;
                case 2:
                    adjust = function (q, w) { return q < _this.map.length; };
                    colAdd = 1;
                    break;
                case 3:
                    adjust = function (q, w) { return w < _this.map[0].length; };
                    rowAdd = 1;
                    break;
            }
            var eat = false;
            while (true) {
                if (!adjust(col, row))
                    break; //检测到边界循环结束
                if (col == point.x && row == point.y) {
                    col += colAdd;
                    row += rowAdd;
                    continue;
                }
                if (this.map[col][row] == 0) {
                    if (!eat)
                        back.push(new egret.Point(col, row));
                }
                else {
                    if (eat) {
                        if (this.map[col][row] * sign < 0) {
                            back.push(new egret.Point(col, row));
                            eat = false;
                        }
                        break;
                    }
                    eat = true;
                }
                row += rowAdd;
                col += colAdd;
            }
            return back;
        };
        MoveMaster.prototype.juMove = function (point, side) {
            var back = [];
            for (var row = point.y; row >= 0; row--) {
                if (row == point.y)
                    continue;
                if (!this.fastMove(new egret.Point(point.x, row), side, back))
                    break;
            }
            for (var col = point.x; col >= 0; col--) {
                if (col == point.x)
                    continue;
                if (!this.fastMove(new egret.Point(col, point.y), side, back))
                    break;
            }
            for (var row = point.y; row < this.map[0].length; row++) {
                if (row == point.y)
                    continue;
                if (!this.fastMove(new egret.Point(point.x, row), side, back))
                    break;
            }
            for (var col = point.x; col < this.map.length; col++) {
                if (col == point.x)
                    continue;
                if (!this.fastMove(new egret.Point(col, point.y), side, back))
                    break;
            }
            return back;
        };
        MoveMaster.prototype.fastMove = function (point, side, back) {
            var sign = side ? 1 : -1;
            if (this.map[point.x][point.y] == 0) {
                back.push(new egret.Point(point.x, point.y));
                return true;
            }
            else {
                if (this.map[point.x][point.y] * sign < 0) {
                    back.push(new egret.Point(point.x, point.y));
                }
                return false;
            }
        };
        MoveMaster.prototype.maMove = function (point, side) {
            //按照撇脚方位计算，四个撇脚分别为
            var back = [];
            back = back.concat(this.maMove_(point, side, -1, 0));
            back = back.concat(this.maMove_(point, side, 1, 0));
            back = back.concat(this.maMove_(point, side, 0, -1));
            back = back.concat(this.maMove_(point, side, 0, 1));
            return back;
        };
        MoveMaster.prototype.maMove_ = function (point, side, x, y) {
            var back = [], sign = side ? 1 : -1;
            if (point.x + x >= 0 && point.x + x < this.map.length && point.y + y >= 0 && point.y + y < this.map[0].length) {
                if (this.map[point.x + x][point.y + y] == 0) {
                    var x1 = 0, y1 = 0;
                    if (x == 0) {
                        x1 = -1;
                    }
                    else {
                        y1 = -1;
                    }
                    var col1 = point.x + 2 * x - x1, row1 = point.y + 2 * y - y1;
                    if (col1 >= 0 && col1 < this.map.length && row1 >= 0 && row1 < this.map[0].length) {
                        if (this.map[col1][row1] * sign <= 0) {
                            back.push(new egret.Point(col1, row1));
                        }
                    }
                    var col2 = point.x + 2 * x + x1, row2 = point.y + 2 * y + y1;
                    if (col2 >= 0 && col2 < this.map.length && row2 >= 0 && row2 < this.map[0].length) {
                        if (this.map[col2][row2] * sign <= 0) {
                            back.push(new egret.Point(col2, row2));
                        }
                    }
                }
            }
            return back;
        };
        MoveMaster.prototype.xiangMove = function (point, side) {
            var back = [];
            //原理同马，四个撇脚位置
            back = back.concat(this.xiangMove_(point, side, 1, 1));
            back = back.concat(this.xiangMove_(point, side, -1, 1));
            back = back.concat(this.xiangMove_(point, side, -1, -1));
            back = back.concat(this.xiangMove_(point, side, 1, -1));
            return back;
        };
        MoveMaster.prototype.xiangMove_ = function (point, side, x, y) {
            var back = [];
            var sign = side ? 1 : -1;
            var originX = point.x + x, originY = point.y + y;
            if (originX >= 0 && originX < this.map.length && originY >= 0 && originY < this.map[0].length) {
                if (this.map[originX][originY] == 0) {
                    if (this.map[point.x + 2 * x][point.y + 2 * y] * sign <= 0) {
                        if (sign > 0) {
                            if (point.y + 2 * y > 4) {
                                back.push(new egret.Point(point.x + 2 * x, point.y + 2 * y));
                            }
                        }
                        else {
                            if (point.y + 2 * y < 5) {
                                back.push(new egret.Point(point.x + 2 * x, point.y + 2 * y));
                            }
                        }
                    }
                }
            }
            return back;
        };
        MoveMaster.prototype.shiMove = function (point, side) {
            var back = [];
            //四个方向，方向规则不超过
            back = back.concat(this.shiMove_(point, side, 1, 1));
            back = back.concat(this.shiMove_(point, side, -1, 1));
            back = back.concat(this.shiMove_(point, side, -1, -1));
            back = back.concat(this.shiMove_(point, side, 1, -1));
            return back;
        };
        MoveMaster.prototype.shiMove_ = function (point, side, x, y) {
            var back = [];
            var sign = side ? 1 : -1;
            var limitUpY, limitDownY;
            if (side == chess.SIDE.RED) {
                limitUpY = 7;
                limitDownY = 9;
            }
            else {
                limitUpY = 0;
                limitDownY = 2;
            }
            var targetX = point.x + x, targetY = point.y + y;
            if (targetX >= 3 && targetX <= 5 && targetY >= limitUpY && targetY <= limitDownY) {
                if (this.map[targetX][targetY] * sign <= 0) {
                    back.push(new egret.Point(targetX, targetY));
                }
            }
            return back;
        };
        MoveMaster.prototype.bossMove = function (point, side) {
            var back = [];
            back = back.concat(this.shiMove_(point, side, 1, 0));
            back = back.concat(this.shiMove_(point, side, 0, 1));
            back = back.concat(this.shiMove_(point, side, -1, 0));
            back = back.concat(this.shiMove_(point, side, 0, -1));
            return back;
        };
        return MoveMaster;
    }());
    chess.MoveMaster = MoveMaster;
})(chess || (chess = {}));
