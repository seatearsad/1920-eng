window.gameBonusResultReq = {
    getData:function(obj){
        this.loginKey = obj.loginKey;
        this.gameId = obj.gameId;
        this.score = obj.score;

        return this;
    }
}