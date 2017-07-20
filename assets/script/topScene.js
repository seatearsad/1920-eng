cc.Class({
    extends: cc.Component,

    properties: {
        cash_label:cc.Label,
        uppop:cc.Node,
        free_spins:cc.Node,
        auto_spins:cc.Node,
        times_label:cc.Label,
        back_btn:cc.Button,
        free_spins_frame:cc.SpriteFrame,
        free_spin_frame:cc.SpriteFrame,
        auto_spins_frame:cc.SpriteFrame,
        auto_spin_frame:cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function () {
        this.uppop.opacity = 0;
        this.back_btn.node.on('click',this.backMain,this);
        this.showLabel = false;
    },
    show_uppop:function(stat){
        //stat 0 auto 1 free
        if(stat == 0) {
            // this.txt_label.string = cacheManager.language["auto_spin"];
            this.auto_spins.active = true;
            this.free_spins.active = false;
            this.times_label.string = cacheManager.auto_times;
        }
        if(stat == 1) {
            // this.txt_label.string = cacheManager.language["free_spin"];
            this.auto_spins.active = false;
            this.free_spins.active = true;
            this.times_label.string = cacheManager.playerInfo.free_times[this.main.gameLevelId].free;
        }

        var seq = cc.fadeIn(0.5);
        this.uppop.runAction(seq);
        this.showLabel = true;
    },
    hidden_uppop:function(){
        var seq = cc.fadeOut(0.5);
        this.uppop.runAction(seq);
        this.showLabel = false;
    },
    backMain:function(){
        cc.director.preloadScene("main", function () {
            cc.director.loadScene("main");
        });
    },
    updatePlayer:function(){
        var playerInfo = cacheManager.playerInfo;
        this.cash_label.string = playerInfo.curr_amount;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.times_label.string == 1){
            if(this.auto_spins.active)
                this.auto_spins.getComponent(cc.Sprite).spriteFrame = this.auto_spin_frame;
            if(this.free_spins.active)
                this.free_spins.getComponent(cc.Sprite).spriteFrame = this.free_spin_frame;
        }else if(this.times_label.string > 1){
            if(this.auto_spins.active)
                this.auto_spins.getComponent(cc.Sprite).spriteFrame = this.auto_spins_frame;
            if(this.free_spins.active)
                this.free_spins.getComponent(cc.Sprite).spriteFrame = this.free_spins_frame;
        }
    },
});
