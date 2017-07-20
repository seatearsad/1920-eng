cc.Class({
    extends: cc.Component,

    properties: {
        bg:cc.Node,
        largeBtn:cc.Button,
        smallBtn:cc.Button,
        startBtn:cc.Button,
        closeBtn:cc.Button,
        showLos:cc.Node,
        dice_1:cc.Node,
        dice_2:cc.Node,
        dice_3:cc.Node,
        showTotal:cc.Label,
        showWin:cc.Node,
        cash_label:cc.Label,
        big_blue:cc.SpriteFrame,
        small_blue:cc.SpriteFrame,
        big_num_blue:cc.SpriteFrame,
        small_num_blue:cc.SpriteFrame,
        big_white:cc.SpriteFrame,
        small_white:cc.SpriteFrame,
        big_num_white:cc.SpriteFrame,
        small_num_white:cc.SpriteFrame,
        chip:cc.SpriteFrame,
        top_big:cc.SpriteFrame,
        top_small:cc.SpriteFrame,
        back_light:cc.Node,
        win:cc.SpriteFrame,
        lose:cc.SpriteFrame,
        dice_anim:cc.AnimationClip
    },

    // use this for initialization
    onLoad: function () {
        this.los = 0;
        this.dice_all_num = 6;
        this.diceSide = [];
        this.startBtn.interactable = false;

        this.startBtn.node.on('click',this.startGame,this);
        this.largeBtn.node.on('click',this.setLarge,this);
        this.smallBtn.node.on('click',this.setSmall,this);
        this.closeBtn.node.on('click',this.closeGame,this);

        for(var i=1;i<=this.dice_all_num;++i){
            this.diceSide[i] = {};
            this.diceSide[i].id = i;
            this.diceSide[i].allNum = this.dice_all_num;
            this.diceSide[i].btn = this.startBtn;
            var loadSide = this.loadSide.bind(this.diceSide[i]);
            cc.loader.loadRes("dice/" + i,cc.SpriteFrame,loadSide);
        }

        this.isStart = false;

        this.allTime = 0;

        this.cash_label.string = cacheManager.playerInfo.curr_amount;
    },
    closeGame:function(){
        this.node.active = false;
        this.bg.active = false;
    },
    loadSide:function(err,res){
        this.res = res;
        cc.log(this.res);
        if(this.allNum == this.id) this.btn.interactable = true;
    },
    startGame:function(){
        cc.log("startGame");
        this.isStart = true;
        this.allTime = 0;
        this.showTotal.string = "";
        this.showLos.getComponent(cc.Sprite).spriteFrame = null;
        this.disableBtn(1);

        var send = {"los":this.los};
        message.sendData(messageDefine.dice_game_result,send,this);

        this.dice_1.getComponent(cc.Sprite).destroy();
        this.dice_2.getComponent(cc.Sprite).destroy();
        this.dice_3.getComponent(cc.Sprite).destroy();

        this.dice_1.getChildByName("anim").active = true;
        this.dice_2.getChildByName("anim").active = true;
        this.dice_3.getChildByName("anim").active = true;

        this.dice_1.getChildByName("anim").getComponent(cc.Animation).play("dice",1);
        this.dice_2.getChildByName("anim").getComponent(cc.Animation).play("dice",2);
        this.dice_3.getChildByName("anim").getComponent(cc.Animation).play("dice",3);
        // var component = null;
        // component = this.dice_1.addComponent(cc.Sprite)
        // component.spriteFrame = this.diceSide[3].res;
    },
    httpResp:function(resp){
        this.result = resp.GameResult;
        this.isResult = true;
        this.showTime = 0;
        this.showWin.string = "";
        this.showWin.getComponent(cc.Sprite).spriteFrame = null;
        this.back_light.active = false;

        //减低下注金额
        if(this.result.isEnough){
            this.main.cash_label.string = this.main.cash_label.string - 50;
            this.cash_label.string = this.cash_label.string - 50;
            cacheManager.initPlayerInfo(resp.playerInfo);
        }
    },
    setLarge:function(){
        this.los = 1;
    },
    setSmall:function(){
        this.los = 0;
    },
    disableBtn:function(stat){
        if(stat == 1){
            this.startBtn.interactable = false;
            this.largeBtn.interactable = false;
            this.smallBtn.interactable = false;
        }else{
            this.startBtn.interactable = true;
            this.largeBtn.interactable = true;
            this.smallBtn.interactable = true;
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.allTime += dt;
        this.showTime += dt;
        if(this.los == 0){
            this.largeBtn.node.getChildByName("big_txt").getComponent(cc.Sprite).spriteFrame = this.big_white;
            this.largeBtn.node.getChildByName("big_num").getComponent(cc.Sprite).spriteFrame = this.big_num_white;
            this.smallBtn.node.getChildByName("small_txt").getComponent(cc.Sprite).spriteFrame = this.small_blue;
            this.smallBtn.node.getChildByName("small_num").getComponent(cc.Sprite).spriteFrame = this.small_num_blue;
            
            this.smallBtn.node.getChildByName("chip").getComponent(cc.Sprite).spriteFrame = this.chip;
            this.largeBtn.node.getChildByName("chip").getComponent(cc.Sprite).spriteFrame = null;
        }else{
            this.largeBtn.node.getChildByName("big_txt").getComponent(cc.Sprite).spriteFrame = this.big_blue;
            this.largeBtn.node.getChildByName("big_num").getComponent(cc.Sprite).spriteFrame = this.big_num_blue;
            this.smallBtn.node.getChildByName("small_txt").getComponent(cc.Sprite).spriteFrame = this.small_white;
            this.smallBtn.node.getChildByName("small_num").getComponent(cc.Sprite).spriteFrame = this.small_num_white;

            this.largeBtn.node.getChildByName("chip").getComponent(cc.Sprite).spriteFrame = this.chip;
            this.smallBtn.node.getChildByName("chip").getComponent(cc.Sprite).spriteFrame = null;
        }
        //背光旋转
        if(this.back_light.active) this.back_light.rotation += 1;

        if(this.showTime > 1 && this.isResult){
            this.isResult = false;
            this.isStart = false;
            this.allTime = 0;
            this.showTotal.string = this.result.total;

            if(this.result.re_los == 0) this.showLos.getComponent(cc.Sprite).spriteFrame = this.top_small;
            else this.showLos.getComponent(cc.Sprite).spriteFrame = this.top_big;

            if(this.result.isWin){
                this.showWin.getComponent(cc.Sprite).spriteFrame = this.win;
                this.back_light.active = true;
            } 
            else this.showWin.getComponent(cc.Sprite).spriteFrame = this.lose;

            this.dice_1.getChildByName("anim").getComponent(cc.Animation).stop("dice");
            this.dice_2.getChildByName("anim").getComponent(cc.Animation).stop("dice");
            this.dice_3.getChildByName("anim").getComponent(cc.Animation).stop("dice");

            this.dice_1.getChildByName("anim").active = false;
            this.dice_2.getChildByName("anim").active = false;
            this.dice_3.getChildByName("anim").active = false;

            var showList = this.result.diceOne;

            this.dice_1.addComponent(cc.Sprite).spriteFrame = this.diceSide[showList[0]].res;
            this.dice_2.addComponent(cc.Sprite).spriteFrame = this.diceSide[showList[1]].res;
            this.dice_3.addComponent(cc.Sprite).spriteFrame = this.diceSide[showList[2]].res;

            this.main.updatePlayer();
            this.cash_label.string = cacheManager.playerInfo.curr_amount;
            this.disableBtn(0);
        }
        if(this.showTime > 2 && !this.isResult){
            this.showWin.getComponent(cc.Sprite).spriteFrame = null;
            this.back_light.active = false;
        }
        // if(this.isStart && this.allTime > 0.1){
        //     this.dice_1.getComponent(cc.Sprite).destroy();
        //     this.dice_2.getComponent(cc.Sprite).destroy();
        //     this.dice_3.getComponent(cc.Sprite).destroy();

        //     var num_1 = Math.floor(Math.random()*60/10) + 1;
        //     var num_2 = Math.floor(Math.random()*60/10) + 1;
        //     var num_3 = Math.floor(Math.random()*60/10) + 1;
        //     // component = this.dice_1.addComponent(cc.Sprite)
        //     this.dice_1.addComponent(cc.Sprite).spriteFrame = this.diceSide[num_1].res;
        //     this.dice_2.addComponent(cc.Sprite).spriteFrame = this.diceSide[num_2].res;
        //     this.dice_3.addComponent(cc.Sprite).spriteFrame = this.diceSide[num_3].res;

        //     this.allTime = 0;
        // }
        
    },
});
