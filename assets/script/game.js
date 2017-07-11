cc.Class({
    extends: cc.Component,

    properties: {
        jackpot:cc.Node,
        bottom:cc.Node,
        top:cc.Node,
        load:cc.Node,
        load_txt:cc.Label,
        win_bg:cc.Node,
        occ_bg:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        //cache
        cacheManager.main = this;
        // cacheManager.init();
        
        //slotScene
        this.jackpot.getComponent("slotScene").main = this;
        this.bottom.getComponent("bottomScene").main = this;
        this.top.getComponent("topScene").main = this;
        this.load.getComponent("loading").main = this;

        this.isLoad = false;

        this.gameLevelId = 0;

        this.loadGameLevel();
        this.updatePlayer();

        this.isShowAddWinNum = false;
        //load
        // var url = "symbol/icon_10";
        // var loadCallBack = this.loadCallBack.bind(this);
        // cc.loader.loadRes(url,cc.SpriteFrame,loadCallBack);
    },
    loadGameLevel:function(){
        // this.timeAll = 0;
        this.jackpot.getComponent("slotScene").loadAll();
        // this.bottom.getComponent("bottomScene").loadBottomData();
    },
    removeLoading:function(){
        this.load.removeFromParent();
        this.load_txt.node.removeFromParent();
    },
    updatePlayer:function(){
        this.bottom.getComponent("bottomScene").updatePlayer();
        this.top.getComponent("topScene").updatePlayer();
    },
    showWinNum:function(winNum){
        this.occ_bg.active = true;
        this.win_bg.active = true;
        this.win_bg.getComponentInChildren(cc.Label).getComponent("showNum").main = this;
        this.win_bg.getComponentInChildren(cc.Label).getComponent("showNum").showAdd(Number(winNum));

        this.isShowAddWinNum = true;
    },
    loadCallBack:function(err,res){
        // var type = "SpriteFrame";

        // var node = new cc.Node("New " + type);
        // node.anchorX = 0;
        // node.anchorY = 0;
        // // node = cc.instantiate(this.col_prefab);
        // var component = null;
        // component = node.addComponent(cc.Sprite);
        // component.spriteFrame = res;
        // node.setPosition(0, 0);

        // this.jackpot.addChild(node);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // this.timeAll += dt;
        // if(this.timeAll > 1 && !this.isLoad){
        //     this.isLoad = true;
        //     this.jackpot.getComponent("slotScene").loadAll();
        // }
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        // cc.log(width,height);
        if(width > height){
            this.node.rotation = 0;
            this.node.scale = 1;
        }else{
            this.node.rotation = 90;
            var sca = width/this.node.height;

            this.node.scale = sca;
        }
    },
});
