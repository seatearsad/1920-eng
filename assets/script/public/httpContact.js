window.httpContact = {
    sendXHR: function (url,data,backclass,callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        
        xhr.open("POST", url,true);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		
		xhr.onreadystatechange = function () {
			// cc.log("response 1",xhr.status);
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				var httpStatus = xhr.statusText;
				var response = xhr.responseText;
				cc.log("response",response);
				backclass.callback = callback;
				backclass.setResp(response,callback);
			}else{
				backclass.setResp(null);
			}
		};
		xhr.send(data);
		//////////////////////////////////////////////
		xhr.ontimeout = function(){//网络连接超时调用
			cc.log("http ontimeout");
		}
		xhr.onerror = function(){//网络连接失败时调用
			//到调用页面显示错误消息
			backclass.callback.showMessage("netError");
		}
    }
}