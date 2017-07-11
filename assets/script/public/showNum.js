cc.Class({
    extends: cc.Component,

    properties: {
        startNum:0,
        stopNum:0
    },

    // use this for initialization
    onLoad: function () {
        
    },
    showAdd:function(num){
        this.getComponent(cc.Label).string = this.startNum;
        this.stopNum = num;
        this.currNum = this.startNum;
        this.totalTime = 0;
        this.baseTime = 0.1;
        this.isEnd = false;
        this.baseAdd = Math.ceil(num/61); 
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.totalTime +=dt;
        if (this.totalTime > this.baseTime) {
            if(!this.isEnd){
                this.currNum += this.baseAdd;
                this.currNum = this.currNum > this.stopNum ? this.stopNum : this.currNum;
                if(this.currNum == this.stopNum){
                    this.isEnd = true;
                    this.totalTime = 0;
                }
                this.getComponent(cc.Label).string = this.currNum;
            }
        }
        if(this.totalTime > 1 && this.isEnd){
            this.node.parent.active = false;
            this.main.occ_bg.active = false;
            this.main.isShowAddWinNum = false;
        }
    }
});
