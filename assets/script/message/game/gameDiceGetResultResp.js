window.gameDiceGetResultResp = {
    init:function(resp){
        this.GameResult = resp.gameDiceResult;
        this.playerInfo = resp.playerInfo;

        return this;
    }
}