window.playerLoginResp = {
    init:function(resp){
        this.isP = resp.isP;
        this.info = resp.info;
        this.loginKey = resp.loginKey;
        
        return this;
    }
}