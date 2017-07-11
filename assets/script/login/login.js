var MD5 = require("md5");

module.exports = {
    callback:{},
    userLogin:function(config,callBack){
        this.isClear = false;
        this.save_name = "slots*-*userName";
        this.save_password = "slots*-*passWord";

        this.callback = callBack;

        if(this.isClear){
            cc.sys.localStorage.removeItem(this.save_name);
            cc.sys.localStorage.removeItem(this.save_password);
        }
        
        this.userName = cc.sys.localStorage.getItem(this.save_name);
		this.passWord = cc.sys.localStorage.getItem(this.save_password);
        cc.log("userName:",this.userName);

        var isSend = 0;
        var params = new Array();
        if(this.userName == null || this.userName == ""){
            if(config.channelId == "N1000"){
                params['cmd'] = "GUEST";
                var thisData = {"channelId":config.channelId,"batchId":"","version":"","model":""};
                params['data'] = JSON.stringify(thisData);
                isSend = 1;
            }else{
                // this.checkChannelId();
            }
        }else{
            params['cmd'] = "LOGIN";
            var thisData = {"userName":this.userName,"passWord":this.passWord,"channelId":config.channelId,"batchId":"","version":"","model":""};
            params['data'] = JSON.stringify(thisData);
            isSend = 1;
        }

        if(isSend == 1){
            params['cpId'] = config.cpId;
            params['productId'] = config.productId;
            params['sign'] = MD5.encrypt(params['cmd'] + params['cpId'] + params['productId'] + params['data'] + config.secretKey);
            var reqParam = message.ArrayToUrlParam(params);
            cc.log(reqParam);
            httpContact.sendXHR(config.requestUrl,reqParam,this,this.callback);
        }
    },
    setResp:function(response,thisCallBack){
        if(response == null){
            cc.log("httpErro");
			//layer.addChild(ShowMessage(Information.prompt_1, null));
			// if(!isErro){
			// 	cc.director.pause();
			// 	isErro = true;
			// 	new ContactErro(Information.network_erro,Information.login_again,false);
			// }
		}else{
            var resp = JSON.parse(response);
            var state = resp.state;
            if(state.code == 100){
                var userData = JSON.parse(resp.data);
				if(config.channelId == "N1000"){
					cc.sys.localStorage.setItem(this.save_name,userData.userName);
					cc.sys.localStorage.setItem(this.save_password,userData.passWord);
				}
				
				cacheManager.initUserInfo(userData);
                this.time = 0;
                cc.log("sessonId:",cacheManager.userInfo.sessionId + ":" + this.time);

                thisCallBack.getGameServer();
            }
        }
    },
}