cc.Class({
    extends: cc.Component,

    properties: {
        main:cc.Node,
        left:cc.Node,
        right:cc.Node,
        jackpot:cc.Node,
        bottom:cc.Node,
        top:cc.Node,
        load:cc.Node,
        load_txt:cc.Label,
        win_bg:cc.Node,
        big_bg:cc.Node,
        mega_bg:cc.Node,
        super_bg:cc.Node,
        back_light:cc.Node,
        occ_bg:cc.Node,
        win_free:cc.Node
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

        this.gameLevelId = cacheManager.loadGameId;
        cc.log("gameLevelId",this.gameLevelId);

        //记录load游戏关卡数量
        this.loadNum = 0;

        var loadGameLevel = this.loadGameLevel.bind(this);
        var getLoadNum = this.getLoadNum.bind(this);

        var ui_arr = ["main_bg","left_side","right_side","top_bg","bottom_bg","jackpot_bg"];
        for(var i=0;i<ui_arr.length;++i){
            var url = "ui/"+cacheManager.gameLevelList[this.gameLevelId].ui+"/" + ui_arr[i];
            var thisUiNode = this.getUiNode(ui_arr[i]);
            thisUiNode.getLoadNum = getLoadNum;
            thisUiNode.totalNum = ui_arr.length;
            thisUiNode.callFun = loadGameLevel;
            var loadUi = this.loadUi.bind(thisUiNode);
            cc.loader.loadRes(url,cc.SpriteFrame,loadUi);
        }
        
        // this.loadGameLevel();
        this.updatePlayer();

        this.isShowAddWinNum = false;
        this.showFree = false;
    },
    getLoadNum:function(){
        this.loadNum++;
        return this.loadNum;
    },
    getUiNode:function(name){
        var rNode = "";
        if(name == "main_bg"){
            rNode = this.main.getComponent(cc.Sprite);
        }else if(name == "left_side"){
            rNode = this.left.getComponent(cc.Sprite);
        }else if(name == "right_side"){
            rNode = this.right.getComponent(cc.Sprite);
        }else if(name == "top_bg"){
            rNode = this.top.getComponent(cc.Sprite);
        }else if(name == "bottom_bg"){
            rNode = this.bottom.getComponent(cc.Sprite);
        }else if(name == "jackpot_bg"){
            rNode = this.jackpot.getComponent(cc.Sprite);
        }

        return rNode;
    },
    loadUi:function(err,res){
        this.spriteFrame = res;
        var lNum = this.getLoadNum();
        if(lNum == this.totalNum){
            this.callFun();
        }
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
    showWinNum:function(winNum,stat){//stat 0 普通胜利 1 big 2 mege 3 super
        this.occ_bg.active = true;
        if(stat != 0){
            this.back_light.active = true;
            this.showLight = true;
        }
        if(stat == -1){
            this.win_free.active = true;
            this.win_free.scale = 0;

            var seq = cc.sequence(
                cc.scaleTo(0.2,1.1),
                cc.scaleTo(0.1,1)
            )

            this.win_free.runAction(seq);
            this.showTime = 0;
            this.showFree = true;
        }else{
            var showlayer;
            switch(stat)
            {
                case 0:
                    showlayer = this.win_bg;
                    break;
                case 1:
                    showlayer = this.big_bg;
                    break;
                case 2:
                    showlayer = this.mega_bg;
                    break;
                case 3:
                    showlayer = this.super_bg;
                    break;
                default:
                    break;
            }
            showlayer.active = true;
            showlayer.getComponentInChildren(cc.Label).getComponent("showNum").main = this;
            showlayer.getComponentInChildren(cc.Label).getComponent("showNum").showAdd(Number(winNum));
        }
        
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

        if(this.showLight){
            this.back_light.rotation += 1;
        }

        if(this.isShowAddWinNum){
            this.showTime += dt;
        }

        if(this.isShowAddWinNum && this.showTime > 2 && this.showFree){
            this.win_free.active = false;
            this.occ_bg.active = false;
            this.isShowAddWinNum = false;
            this.back_light.active = false;
            this.showLight = false;
            this.showFree = false;
        }
    },
});
