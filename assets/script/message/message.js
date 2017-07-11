var MD5 = require("md5");
window.message = {
    m:{},
    callback:null,
    secretKey:"stolScoRfloW",
    sendData:function(messageId,obj,callback){
        //message.m = new ArrayBuffer();

        var pid = cacheManager.playerInfo.id;
        if(typeof(pid) == "undefined"){
            pid = 0;
        }
        message.m["mid"] = messageId;
        message.m["pid"] = pid;
        
        var dataClass;
        switch(messageId){
            case messageDefine.login:
                dataClass = playerLoginReq;
                break;
            case messageDefine.create:
                dataClass = playerCreateReq;
                break;
            case messageDefine.levelLine:
                dataClass = playerGameLevelLineReq;
                break;
            case messageDefine.levelBet:
                dataClass = playerGameLevelBetReq;
                break;
            case messageDefine.game_result:
                dataClass = gameGetResultReq;
                break;
            default:
                break;
        }
        //输入loginkey
        if(messageId != messageDefine.login && messageId != messageDefine.create){
            obj.loginKey = cacheManager.playerInfo.loginKey;
        }
        message.m["sid"] = "1001";
        message.m["data"] = JSON.stringify(dataClass.getData(obj));
        // cc.log("ss",message.m["mid"].toString() + message.m["pid"].toString() + message.m["sid"].toString() + message.m["data"].toString() + message.secretKey);
        message.m["sign"] = MD5.encrypt(message.m["mid"].toString() + message.m["pid"].toString() + message.m["sid"].toString() + message.m["data"].toString() + message.secretKey);
        var tString = message.ArrayToUrlParam(message.m);

        message.callback = callback;
        cc.log(tString);
        var url = cacheManager.userInfo.serverAddr;
        // httpContact.sendXHR(cacheManager.userInfo.serverAddr,tString,message);
        httpContact.sendXHR(url,tString,message,message.callback);
    },
    setResp:function(response){
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
			var result = resp.result;
			var mid = resp.messageId;
            if(result == 100){
                message.getResp(mid,resp);
            }
        }
    },
    getResp:function(mid,resp){
        var r_class = null;
        switch(mid){
            case messageDefine.login_r:
                r_class = playerLoginResp;
                break;
            case messageDefine.create_r:
                r_class = playerCreateResp;
                break;
            case messageDefine.levelLine_r:
                r_class = playerGameLevelLineResp;
                break;
            case messageDefine.levelBet_r:
                r_class = playerGameLevelBetResp;
                break;
            case messageDefine.game_result_r:
                r_class = gameGetResultResp;
                break;
            default:
                break;
        }
        r_class.init(resp);
        message.callback.httpResp(r_class);
    },
    ArrayToUrlParam:function(arr){
	var str;
	var i = 0;
	for(var key in arr){
		if(i == 0){
			str = key + "=" + arr[key];
		}else{
			str = str + "&" + key + "=" + arr[key];
		}
		i++;
	}
	return str;
}
}