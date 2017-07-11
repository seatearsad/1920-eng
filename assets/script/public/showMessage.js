cc.Class({
    extends: cc.Component,

    properties: {
        message_font:cc.Label,
        close_btn:cc.Button
    },

    // use this for initialization
    onLoad: function () {
        this.node.on("touchstart",this.emptyFunc,this);
        this.close_btn.node.on("click",this.btnCallBack,this);
        this.node.opacity = 0;
        this.node.scale = 0.3;
    },
    emptyFunc:function (event) {
        event.stopPropagation();
    },
    btnCallBack:function(){
        this.node.removeFromParent();
        if(typeof(this.parentFun) != "undefined") this.parentFun();//返回操作
    },
    changeTxt:function(str,callBack){//callBack为弹出框关闭后返回的函数
        this.message_font.string = str;
        this.parentFun = callBack;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
