window.gameBonusResultResp = {
    init:function(resp){
        this.winNum = resp.winNum;
        this.playerInfo = resp.playerInfo;

        return this;
    }
}