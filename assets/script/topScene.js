cc.Class({
    extends: cc.Component,

    properties: {
        cash_label:cc.Label,
        uppop:cc.Node,
        txt_label:cc.Label,
        times_label:cc.Label,
        back_btn:cc.Button
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
            this.txt_label.string = cacheManager.language["auto_spin"];
            this.times_label.string = cacheManager.auto_times;
        }
        if(stat == 1) {
            this.txt_label.string = cacheManager.language["free_spin"];
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
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
