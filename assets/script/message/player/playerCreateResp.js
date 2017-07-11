window.playerCreateResp = {
    init:function(resp){
        this.info = resp.info;
        this.loginKey = resp.loginKey;
        
        return this;
    }
}