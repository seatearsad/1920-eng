cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {

    },
    showLine:function(lineArr){
        for(var i=0;i<lineArr.length;++i){
            var lineNum = lineArr[i] + 1;
            if(!isNaN(lineNum)){
                var lineN = "line_" + lineNum;cc.log(lineN);
                this.node.getChildByName(lineN).active = true;
            }
            
        }
    },
    waverLine:function(lineId,callFun){
        var lineN = "line_" + (lineId+1);
        this.node.getChildByName(lineN).active = true;
        var seq = cc.sequence(
            cc.fadeOut(0.3),
            cc.fadeIn(0.3),
            cc.fadeOut(0.3),
            cc.fadeIn(0.3),
            cc.fadeOut(0.3),
            cc.fadeIn(0.3),
            callFun
        )
        this.node.getChildByName(lineN).runAction(seq);
    },
    removeLine:function(allNum){
        for(var i=0;i<allNum;++i){
            var lineN = "line_" + (i+1);
            this.node.getChildByName(lineN).active = false;
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
