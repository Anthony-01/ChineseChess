//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

import ChessTable = chess.ChessTable;
import GameView = chess.GameView;
import IGameView = chess.IGameView;
import GameServer = chess.GameServer;
import GamePlayerControl = chess.GamePlayerControl;
import GamePlayerSimulator = chess.GamePlayerSimulator;
import IMain = chess.IMain;
import Button = chess.Button;
import RouteBorder = chess.RouteBorder;

class Main extends egret.DisplayObjectContainer implements IMain{



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        });

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        };

        /*
        * 初始化棋盘=>玩家加入=>游戏开始=>红子先行=>游戏结束=>重新开始按钮
        *
        * 不同玩家进入，显示不同的游戏界面，服务器保存的数据是一样的，
        * 客户端与服务器交换的数据格式：棋盘数据，分为红色以及黑色两部分
        * 一个棋局需要的数据：
        *   1、各方棋子的位置block:,red:
        *   2、用户数据
        *   3、根据历史数据来验证操作是否合理
        * */
        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("game", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    p_server:GameServer;

    p_control:ChessTable;

    p_view:GameView;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.p_view = new GameView();
        this.adjustView();
        this.addChild(this.p_view);
        // this.addChild(new RouteBorder(new egret.Point(5,5)));
        this.p_control = new ChessTable();
        this.p_control.onInit(this.p_server,this.p_view,this);

        let testPlay = new GamePlayerSimulator();
        this.p_control.onPlayConnect(testPlay);
        testPlay.requestStart();
    }

    private adjustView() {
        //白色背景图
        let StageSprite: egret.Sprite = new egret.Sprite();
        StageSprite.graphics.beginFill(0xFFFFFF);
        StageSprite.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        StageSprite.graphics.endFill();
        this.addChild(StageSprite);

        //棋盘居中
        this.p_view.x = this.stage.stageWidth / 2 - this.p_view.width / 2 +50;
        this.p_view.y = this.stage.stageHeight / 2 - this.p_view.height / 2 +50;
        console.log(this.p_view.width);
    }

    showResult():void{
        //结算框,写按钮
    }


}