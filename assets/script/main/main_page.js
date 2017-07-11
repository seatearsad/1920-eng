cc.Class({
    extends: cc.Component,

    properties: {
        pagePre:cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        var page_all = 5;
        var page_size = 240;

        this.pv = this.getComponent("cc.PageView");
        for(var i=0;i<page_all;++i){
            var tPage = cc.instantiate(this.pagePre);
            tPage.on("click",this.pageClick,this);
            tPage.tag = i;
            this.pv.addPage(tPage);
            if(i == 0){
                tPage.y = 20;
            }
        }
        this.node.on("scroll-ended",this.scrollEvent,this);
        this.pv.content.width = page_size * page_all;
        cc.log(this.pv.content.width);
        cc.log(this.pv.pageEvents);
    },
    scrollEvent:function(event){
        // cc.log(this.pv.getCurrentPageIndex());
        var allPage = this.pv.getPages();
        for(var i=0;i<allPage.length;++i){
            var tPage = allPage[i];
            if(i == this.pv.getCurrentPageIndex())
                tPage.y = 20;
            else
                tPage.y = 0;
        }
    },
    pageClick:function(event){
        var page = event.detail;
        cc.log(page.node.tag,this.pv.getCurrentPageIndex());
        if(page.node.tag == this.pv.getCurrentPageIndex()){
            // cc.director.end();
            cc.director.preloadScene("game", function () {
                cc.director.loadScene("game");
            });
        }
        else
            this.pv.scrollToPage(page.node.tag);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
