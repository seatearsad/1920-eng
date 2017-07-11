window.playerGameLevelBetReq = {
    getData:function(obj){
        this.loginKey = obj.loginKey;
        this.levelId = obj.levelId;
        this.bet = obj.bet;
        
        return this;
    }
}