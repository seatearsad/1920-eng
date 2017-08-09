cc.Class({
    extends: cc.Component,

    properties: {
        pagePre:cc.Prefab,
        diceBtn:cc.Button
    },

    // use this for initialization
    onLoad: function () {
        var page_all = 5;
        this.page_size = 400;

        this.pv = this.getComponent("cc.PageView");
        
        this.frame_res = cc.instantiate(this.pagePre).getChildByName("frame").getComponent(cc.Sprite).spriteFrame;

        this.node.on("scroll-ended",this.scrollEvent,this);
        
        cc.log(this.pv.content.width);
        cc.log(this.pv.pageEvents);
        //加载选中框
        var loadFrame = this.loadFrame.bind(this);
        cc.loader.loadRes("cover/hover_frame",cc.SpriteFrame,loadFrame);
        
        //骰子游戏
        this.diceBtn.node.tag = 0;
        this.diceBtn.node.on("click",this.startDice,this);
        //记录load游戏关卡数量
        this.loadNum = 0;
        //记录时间
        this.totalTime = 0;
        this.isLoadPre = false;
    },
    loadFrame:function(err,res){
        this.hoverF_res = res;
    },
    loadCome:function(err,res){
        this.come_res = res;
    },
    loadCover:function(){
        //加载coming soon
        var loadCome = this.loadCome.bind(this);
        cc.loader.loadRes("cover/cs_cover",cc.SpriteFrame,loadCome);
        //加载关卡id及cover
        this.gameLevelList = cacheManager.gameLevelList;
        var loadGameLevel = this.loadGameLevel.bind(this);
        var getLoadNum = this.getLoadNum.bind(this);
        for(var i=0;i<this.gameLevelList.length;++i){
            var cover_url = "cover/" + this.gameLevelList[i].cover;
            this.gameLevelList[i].totalNum = this.gameLevelList.length;
            this.gameLevelList[i].callFun = loadGameLevel;
            this.gameLevelList[i].getLoadNum = getLoadNum;
            var loadCoverRes = this.loadCoverRes.bind(this.gameLevelList[i]);
            cc.loader.loadRes(cover_url,cc.SpriteFrame,loadCoverRes);
        }
    },
    getLoadNum:function(){
        this.loadNum++;
        return this.loadNum;
    },
    preLoad:function(err,asset){

    },
    loadCoverRes:function(err,res){
        this.res = res;
        var lNum = this.getLoadNum();
        if(lNum == this.totalNum){
            this.callFun();
        }
    },
    loadGameLevel:function(){
        for(var i=0;i<this.gameLevelList.length;++i){
            var tPage = cc.instantiate(this.pagePre);
            tPage.on("click",this.pageClick,this);
            tPage.tag = Number(this.gameLevelList[i].id) + 1;
            tPage.getChildByName("cover").getComponent(cc.Sprite).spriteFrame = this.gameLevelList[i].res;
            this.pv.addPage(tPage);
        }
        var tPage = cc.instantiate(this.pagePre);
        tPage.getChildByName("cover").getComponent(cc.Sprite).spriteFrame = this.come_res;
        tPage.tag = this.gameLevelList.length + 1;
        tPage.on("click",this.toComingSoon,this);
        this.pv.addPage(tPage);

        this.pv.content.width = this.page_size * (this.gameLevelList.length + 1);
        this.pv.setCurrentPageIndex(cacheManager.loadGameId + 1);
    },
    toComingSoon:function(event){
        var btn = event.detail;
        this.pv.scrollToPage(btn.node.tag);
    },
    scrollEvent:function(event){
        // cc.log(this.pv.getCurrentPageIndex());
        var allPage = this.pv.getPages();
        for(var i=0;i<allPage.length;++i){
            var tPage = allPage[i];
            if(i == this.pv.getCurrentPageIndex()){
                tPage.y = 20;
                tPage.getChildByName("frame").getComponent(cc.Sprite).spriteFrame = this.hoverF_res;
            }else{
                tPage.y = 0;
                tPage.getChildByName("frame").getComponent(cc.Sprite).spriteFrame = this.frame_res;
            }
        }
    },
    pageClick:function(event){
        var page = event.detail;
        cc.log(page.node.tag,this.pv.getCurrentPageIndex());
        if(page.node.tag == this.pv.getCurrentPageIndex()){
            // cc.director.end();
            this.enterGame();
        }
        else
            this.pv.scrollToPage(page.node.tag);
    },
    startDice:function(event){
        var btn = event.detail;
        if(this.pv.getCurrentPageIndex() == btn.node.tag){
            this.enterGame();
        }else{
            this.pv.scrollToPage(btn.node.tag);
        }
    },
    enterGame:function(){
        if(this.pv.getCurrentPageIndex() == 0){
            this.main.dice_bg.active = true;
            this.main.dice_game.active = true;
        }else if(this.pv.getCurrentPageIndex() > 0 && this.pv.getCurrentPageIndex() <= this.gameLevelList.length){
            //loading字样
            cc.log("click game!");
            this.main.load.active = true;
            this.main.load_txt.node.active = true;
            cacheManager.loadGameId = this.pv.getCurrentPageIndex() - 1;
            cc.director.preloadScene("game", function () {
                cc.log("enter game!");
                cc.director.loadScene("game");
            });
        }
        
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // this.totalTime += dt;
        // if(!this.isLoadPre && this.totalTime > 2){
        //     //预加载
        //     var loadDir = ["ui/fruits","ui/zodiac","star","fruits","pre"];
        //     for(var i=0;i<loadDir.length;++i){
        //         cc.loader.loadResDir(loadDir[i],this.loadDir);
        //     }
        //     this.isLoadPre = true;
        // }
    },
});
