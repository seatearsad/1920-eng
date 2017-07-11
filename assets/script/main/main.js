cc.Class({
    extends: cc.Component,

    properties: {
        load:cc.Node,
        load_txt:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        cc.log("rotation",this.node.rotation);
        if(!cacheManager.isInit)
            cacheManager.init();
        //slotScene
        // this.load.getComponent("loading").main = this;
        // cacheManager.main = this;

        if(typeof(cacheManager.playerInfo.id) == "undefined"){
            this.load.active = true;
            this.load_txt.node.active = true;
            this.load.getComponent("loading").main = this;
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
        this.removeLoading();
    },
    removeLoading:function(){
        this.load.removeFromParent();
        this.load_txt.node.removeFromParent();
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
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // var width = cc.view.resizeWithBrowserSize(true).width;
        // var height = cc.view.resizeWithBrowserSize(true).height;
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        // cc.log("direction",this.node.parent.getComponentInChildren(cc.PageView).direction);
        // cc.log(width,height);cc.log(this.node.parent.width);
        if(width > height){
            this.node.parent.rotation = 0;
            this.node.parent.scale = 1;
            this.isFan = false;
            // this.node.parent.getComponent(cc.Canvas).fitheight = true;
        }else{
            this.node.parent.rotation = 90;
            var sca = width/this.node.parent.height;

            this.node.parent.scale = sca;
            this.isFan = true;
            // this.node.parent.getComponent(cc.Canvas).fitWidth = true;
        }
    },
});
