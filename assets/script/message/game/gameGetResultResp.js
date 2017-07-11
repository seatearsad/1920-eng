window.gameGetResultResp = {
    init:function(resp){
        this.GameResult = resp.GameResult;
        this.playerInfo = resp.playerInfo;

        return this;
    }
}