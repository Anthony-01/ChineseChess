namespace chess{

    const C_YELLOW = 0xFFA500;
    const C_GRAY = 0xDCDCDC;

    export class Button extends egret.Sprite{

        private _text:egret.TextField = new egret.TextField();

        constructor(text:string){
            super();
            this.addText(text);
            this.drawBack(C_YELLOW);
            this.setEnable(true);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.changeToGray,this);
            this.addEventListener(egret.TouchEvent.TOUCH_END,this.changeToYellow,this);
        }

        private addText(text: string) {
            this._text.fontFamily = "Impact";
            this._text.text = text;
            this._text.width = 100;
            this._text.height = 50;
            this._text.textColor = 0xFFFFFF;//336699
            this._text.textAlign = egret.HorizontalAlign.CENTER;
            this._text.verticalAlign = egret.VerticalAlign.MIDDLE;
            this._text.strokeColor = 0x6699cc;
            this._text.stroke = 2;
            this.addChild(this._text);
        }

        setEnable(sign:boolean){
            if(sign){
                this.touchEnabled = true;
                this.drawBack(C_YELLOW);
            }else{
                this.touchEnabled = false;
                this.drawBack(C_GRAY);
            }
        }

        private changeToGray(){
            this.drawBack(C_GRAY);
        }

        private changeToYellow(){
            this.drawBack(C_YELLOW);
        }

        private drawBack(color:number):void{
            this.graphics.clear();
            // this.graphics.lineStyle(2,0x000000);
            this.graphics.beginFill(color,0.5);
            this.graphics.drawRoundRect(0,0,100,50,20,20);
            this.graphics.endFill();
        }
    }
}