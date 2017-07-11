var MD5 = require("md5");
module.exports = {
    callback:{},
    getServer:function(callBack){
        this.callback = callBack;
		var params = new Array();
		params['cpId'] = config.cpId;
		params['productId'] = config.productId;
		params['cmd'] = "SERVER";
		var thisData = {"userId":cacheManager.userInfo.userId};
		params['data'] = JSON.stringify(thisData);
		
		params['sign'] = MD5.encrypt(params['cmd'] + params['cpId'] + params['productId'] + params['data'] + config.secretKey);
		var reqParam = message.ArrayToUrlParam(params);

		httpContact.sendXHR(config.requestUrl,reqParam,this,callBack);
	},
	setResp:function(response,callback){
		if(response == null){
			// layer.addChild(ShowMessage(Information.prompt_1, null));
		}else{
			var resp = JSON.parse(response);
			var state = resp.state;
			if(state.code == 100){
                cc.log("serverData:",resp.data);
				var data = JSON.parse(resp.data);
				var server = data.servers[0].url;
				var serverId = data.servers[0].id;
				cacheManager.userInfo.serverAddr = server;
				cacheManager.userInfo.serverId = serverId;
				
                callback.playerLogin();
                // message.sendData(messageDefine.login);
//				if(server != null && server != "" && server != 'undefined'){
//					cc.director.runScene(new cc.TransitionFade(1.5, new GameScene(),cc.color(255,255,255)));
//				}
			}
		}
	}
}