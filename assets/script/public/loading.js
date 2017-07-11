var login = require("login");
var getServer = require("server");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.node.on("touchstart",this.emptyFunc,this);
        var callBack = this.callBack.bind(this);
        cc.loader.loadRes(dataList.configData,callBack);
    },
    emptyFunc:function (event) {
        event.stopPropagation();
    },
    callBack:function(err,res){
        config.init(res);
        login.userLogin(config,this);
    },
    playerLogin:function(){
        var send = {"userId":cacheManager.userInfo.userId};
        cc.log(send);
        message.sendData(messageDefine.login,send,this);
    },
    getGameServer:function(){
        getServer.getServer(this);
    },
    showMessage:function(str){
        this.main.load_txt.string = cacheManager.language[str];
    },
    httpResp:function(resp){
        // this.main.removeLoading();
        if(typeof(resp.info) == "undefined"){
            if(!resp.isP){
                var send = {"userId":cacheManager.userInfo.userId};
                message.sendData(messageDefine.create,send,this);
            }
        }else{
            cacheManager.initPlayerInfo(resp.info);
            cacheManager.playerInfo.loginKey = resp.loginKey;
            
            // this.main.updatePlayer();
            this.main.removeLoading();
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
