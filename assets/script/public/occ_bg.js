cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.node.on("touchstart",this.emptyFunc,this);
    },
    emptyFunc:function (event) {
        event.stopPropagation();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
