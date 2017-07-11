window.playerGameLevelLineReq = {
    getData:function(obj){
        this.loginKey = obj.loginKey;
        this.levelId = obj.levelId;
        this.line = obj.line;
        
        return this;
    }
}