cc.Class({
    extends: cc.Component,

    properties: {
        base_prefab:cc.Prefab,
        base_width:0,
        base_height:0,
        base_space:0
    },

    // use this for initialization
    onLoad: function () {
        var test_num = 10;
        cc.log(this.getComponent(cc.ScrollView).content);
        this.content = this.getComponent(cc.ScrollView).content;
        this.content.height = test_num * (this.base_height + this.base_space) + this.base_space;
        for(var i=0;i<test_num;++i){
            var t_prefab = cc.instantiate(this.base_prefab);
            this.content.addChild(t_prefab);
            t_prefab.setPosition(0, -this.base_height * i - this.base_space * (i + 1));
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});