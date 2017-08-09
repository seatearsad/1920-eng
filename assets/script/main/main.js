cc.Class({
    extends: cc.Component,

    properties: {
        load:cc.Node,
        load_txt:cc.Label,
        main_page:cc.Node,
        dice_bg:cc.Node,
        dice_game:cc.Node,
        start_btn:cc.Button,
        cash_label:cc.Label,
        dice_anim:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        // cc.view.enableAntiAlias(false);
        cc.log("rotation",cc.view.isAntiAliasEnabled());
        if(!cacheManager.isInit)
            cacheManager.init();
        else
            this.main_page.getComponent("main_page").loadCover();
        
        cacheManager.index = this;
        //startBtn
        this.start_btn.node.on("click",this.startGame,this);
        //slotScene
        // this.load.getComponent("loading").main = this;
        // cacheManager.main = this;

        //测试动画
        // this.dice_anim.getComponent(cc.Animation).play("dice");
        // this.dice_anim.getComponent(cc.Animation).stop("dice");

        if(typeof(cacheManager.playerInfo.id) == "undefined"){
            //预加载
            this.loadNum = 0;
            this.loadDirFile = ["cover","ui/fruits","ui/zodiac","star","fruits","pre"];
            var loadDirCall = this.loadDir.bind(this);
            for(var i=0;i<this.loadDirFile.length;++i){
                cc.loader.loadResDir(this.loadDirFile[i],loadDirCall);
            }

            this.load.active = true;
            this.load_txt.node.active = true;
            this.load.getComponent("loading").main = this;
        }else{
            this.updatePlayer();
        }
        //监听游戏进入后台
        cc.game.on(cc.game.EVENT_HIDE,this.gameHide);
        //监听按键
        this.isExit = false;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //监听移动
        this.isFan = false;
        this.node.parent.on("touchmove",function(event){
            if(this.isFan){
                event.getDelta().x = event.getDelta().y;
            }
            //cc.log(event.getDelta().x);
        })
        //监看FPS
        // cc.director.setDisplayStats(true);
        this.main_page.getComponent("main_page").main = this;
        this.dice_game.getComponent("diceGame").main = this;
    },
    loadDir:function(err,res){
        cc.log("loadDirRes");
        this.loadNum++;
        this.load.getComponent("loading").addLoadBar(0.1);
        if(this.loadNum == this.loadDirFile.length){
            //加载后执行登录程序
            this.load.getComponent("loading").starLogin();
        }
    },
    startGame:function(){
        this.main_page.getComponent("main_page").enterGame();
    },
    gameHide:function(){
        cc.log("gameHide");
    },
    onKeyDown:function(event){//退出游戏
        if(event.keyCode == cc.KEY.back){
            if(!this.isExit){
                this.showMessage("exit_game");
                this.isExit = true;
            }else{
                cc.director.end();
            }
            
        } 
    },
    loadGameLevel:function(){
        // this.removeLoading();
        this.main_page.getComponent("main_page").loadCover();
    },
    removeLoading:function(){
        this.load.active = false;
        this.load_txt.node.active = false;
        this.updatePlayer();
        // this.main_page.getComponent("main_page").loadCover();
    },
    showMessage:function(str){
        this.showMessageTxt = cacheManager.language[str];
        var loadShowMessage = this.loadShowMessage.bind(this);
        cc.loader.loadRes("pre/showMessage", loadShowMessage);
    },
    loadShowMessage:function(err,prefab){
        var showMessageNode = cc.instantiate(prefab);
        var changeExit = this.changeExit.bind(this);
        showMessageNode.getComponent("showMessage").changeTxt(this.showMessageTxt,changeExit);
        this.node.parent.addChild(showMessageNode);
        var seq = cc.sequence(
            cc.fadeIn(0.2),
            cc.scaleTo(0.2,1.05),
            cc.scaleTo(0.1,1)
        )
        showMessageNode.runAction(seq);
    },
    changeExit:function(){
        this.isExit = false;
    },
    updatePlayer:function(){
        var playerInfo = cacheManager.playerInfo;
        this.cash_label.string = playerInfo.curr_amount;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // var width = cc.view.resizeWithBrowserSize(true).width;
        // var height = cc.view.resizeWithBrowserSize(true).height;
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        // cc.log("direction",this.node.parent.getComponentInChildren(cc.PageView).direction);
        // cc.log(width,height);cc.log(this.node.parent.width);
        // if(width > height){
        //     this.node.parent.rotation = 0;
        //     this.node.parent.scale = 1;
        //     this.isFan = false;
        //     // this.node.parent.getComponent(cc.Canvas).fitheight = true;
        // }else{
        //     this.node.parent.rotation = 90;
        //     var sca = width/this.node.parent.height;

        //     this.node.parent.scale = sca;
        //     this.isFan = true;
        //     // this.node.parent.getComponent(cc.Canvas).fitWidth = true;
        // }
    },
});
