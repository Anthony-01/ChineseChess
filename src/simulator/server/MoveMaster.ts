namespace chess {
    /*
    * 移动位置控制器
    * */
    export class MoveMaster {

        private map: number[][];//标识各个棋子位置的数组

        constructor() {

        }

        updateMap(map: number[][]): void {
            this.map = map;
        }

        /*
        * 兵移动位置预测
        * point:棋子的位置
        * side:阵营
        * return where can move
        * */
        binMove(point: egret.Point, side: SIDE): egret.Point[] {
            let back = [];
            let pass, //标志是否过河
                direction = 0, //方向
                sign = side ? 1 : -1;

            if (side == SIDE.RED) { //红色阵营
                pass = point.y < 5;//y指的是行
                direction = -1;
            } else {
                pass = point.y > 4;
                direction = 1;
            }

            if (point.y + direction >= 0 && point.y + direction <= this.map.length) {
                if (this.map[point.x][point.y + direction] * sign <= 0) {//如果没有棋子或者是敌方棋子的情况下(0),相乘为负数
                    let target = new egret.Point(point.x, point.y + direction);
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
            } else {
                // back.push(new egret.Point(point.x, point.y + direction));
            }
            return back;
        }

        /*
        * 炮
        * */
        paoMove(point: egret.Point, side: SIDE): egret.Point[] {
            let back = [];
            for (let direction = 0; direction < 4; direction++) {
                back = back.concat(this.paoMove_(point, direction, side));
            }
            return back;
        }

        private paoMove_(point: egret.Point, direction: number, side: SIDE): egret.Point[] {
            let back = [];

            let col = point.x, row = point.y;
            let rowAdd = 0, colAdd = 0, sign = side ? 1 : -1;//

            let adjust: (q, w) => boolean;

            switch (direction) {
                case 0:
                    adjust = (q, w) => q >= 0;
                    colAdd = -1;
                    break;
                case 1:
                    adjust = (q, w) => w >= 0;
                    rowAdd = -1;
                    break;
                case 2:
                    adjust = (q, w) => q < this.map.length;
                    colAdd = 1;
                    break;
                case 3:
                    adjust = (q, w) => w < this.map[0].length;
                    rowAdd = 1;
                    break;
            }

            let eat = false;
            while (true) {
                if (!adjust(col, row)) break;//检测到边界循环结束
                if (col == point.x && row == point.y) {
                    col += colAdd;
                    row += rowAdd;
                    continue;
                }
                if (this.map[col][row] == 0) { //该位置没有棋子
                    if (!eat) back.push(new egret.Point(col, row));
                } else { //如果有棋子，那么跳过此位置，遍历能吃的敌方棋子
                    if (eat) {
                        if (this.map[col][row] * sign < 0) { //如果是敌方棋子，吃。否则直接break
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
        }

        juMove(point: egret.Point, side: SIDE): egret.Point[] {
            let back = [];

            for (let row = point.y; row >= 0; row--) { //行减遍历
                if (row == point.y) continue;
                if (!this.fastMove(new egret.Point(point.x, row), side, back)) break;
            }
            for (let col = point.x; col >= 0; col--) {
                if (col == point.x) continue;
                if (!this.fastMove(new egret.Point(col, point.y), side, back)) break;
            }
            for (let row = point.y; row < this.map[0].length; row++) {
                if (row == point.y) continue;
                if (!this.fastMove(new egret.Point(point.x, row), side, back)) break;
            }
            for (let col = point.x; col < this.map.length; col++) {
                if (col == point.x) continue;
                if (!this.fastMove(new egret.Point(col, point.y), side, back)) break;
            }

            return back;
        }

        private fastMove(point: egret.Point, side: SIDE, back: egret.Point[]): boolean {
            let sign = side ? 1 : -1;

            if (this.map[point.x][point.y] == 0) {
                back.push(new egret.Point(point.x, point.y));
                return true;
            } else {
                if (this.map[point.x][point.y] * sign < 0) {
                    back.push(new egret.Point(point.x, point.y));
                }
                return false;
            }
        }

        maMove(point: egret.Point, side): egret.Point[] {
            //按照撇脚方位计算，四个撇脚分别为
            let back = [];
            back = back.concat(this.maMove_(point, side, -1, 0));
            back = back.concat(this.maMove_(point, side, 1, 0));
            back = back.concat(this.maMove_(point, side, 0, -1));
            back = back.concat(this.maMove_(point, side, 0, 1));

            return back;
        }

        private maMove_(point: egret.Point, side: SIDE, x, y): egret.Point[] {
            let back = [],
                sign = side ? 1 : -1;
            if (point.x + x >= 0 && point.x + x < this.map.length && point.y + y >= 0 && point.y + y < this.map[0].length) {
                if (this.map[point.x + x][point.y + y] == 0) {
                    let x1 = 0, y1 = 0;
                    if (x == 0) {
                        x1 = -1;
                    } else {
                        y1 = -1;
                    }
                    let col1 = point.x + 2 * x - x1, row1 = point.y + 2 * y - y1;
                    if (col1 >= 0 && col1 < this.map.length && row1 >= 0 && row1 < this.map[0].length) {
                        if (this.map[col1][row1] * sign <= 0) {
                            back.push(new egret.Point(col1, row1));
                        }
                    }
                    let col2 = point.x + 2 * x + x1, row2 = point.y + 2 * y + y1;
                    if (col2 >= 0 && col2 < this.map.length && row2 >= 0 && row2 < this.map[0].length) {
                        if (this.map[col2][row2] * sign <= 0) {
                            back.push(new egret.Point(col2, row2));
                        }
                    }
                }
            }

            return back;
        }

        xiangMove(point: egret.Point, side: SIDE): egret.Point[] {
            let back = [];
            //原理同马，四个撇脚位置
            back = back.concat(this.xiangMove_(point, side, 1, 1));
            back = back.concat(this.xiangMove_(point, side, -1, 1));
            back = back.concat(this.xiangMove_(point, side, -1, -1));
            back = back.concat(this.xiangMove_(point, side, 1, -1));

            return back;
        }

        private xiangMove_(point: egret.Point, side, x, y): egret.Point[] {
            let back = [];

            let sign = side ? 1 : -1;
            let originX = point.x + x,
                originY = point.y + y;
            if (originX >= 0 && originX < this.map.length && originY >= 0 && originY < this.map[0].length) {
                if (this.map[originX][originY] == 0) {
                    if (this.map[point.x + 2 * x][point.y + 2 * y] * sign <= 0) {
                        if(sign > 0){
                            if(point.y + 2 * y > 4){
                                back.push(new egret.Point(point.x + 2 * x, point.y + 2 * y));
                            }
                        }else{
                            if(point.y + 2 * y < 5){
                                back.push(new egret.Point(point.x + 2 * x, point.y + 2 * y));
                            }
                        }
                    }
                }
            }
            return back;
        }

        shiMove(point: egret.Point, side: SIDE): egret.Point[] {
            let back = [];
            //四个方向，方向规则不超过
            back = back.concat(this.shiMove_(point, side, 1, 1));
            back = back.concat(this.shiMove_(point, side, -1, 1));
            back = back.concat(this.shiMove_(point, side, -1, -1));
            back = back.concat(this.shiMove_(point, side, 1, -1));
            return back;
        }

        private shiMove_(point: egret.Point, side: SIDE, x: number, y: number): egret.Point[] {
            let back = [];

            let sign = side ? 1 : -1;
            let limitUpY, limitDownY;
            if (side == SIDE.RED) {
                limitUpY = 7;
                limitDownY = 9;
            } else {
                limitUpY = 0;
                limitDownY = 2;
            }
            let targetX = point.x + x,
                targetY = point.y + y;
            if (targetX >= 3 && targetX <= 5 && targetY >= limitUpY && targetY <= limitDownY) {
                if (this.map[targetX][targetY] * sign <= 0) {
                    back.push(new egret.Point(targetX, targetY));
                }
            }
            return back;
        }

        bossMove(point: egret.Point, side): egret.Point[] {
            let back = [];

            back = back.concat(this.shiMove_(point, side, 1, 0));
            back = back.concat(this.shiMove_(point, side, 0, 1));
            back = back.concat(this.shiMove_(point, side, -1, 0));
            back = back.concat(this.shiMove_(point, side, 0, -1));
            return back;
        }

    }
}