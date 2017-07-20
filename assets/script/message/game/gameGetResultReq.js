window.gameGetResultReq = {
    getData:function(obj){
        this.loginKey = obj.loginKey;
        this.gameId = obj.gameId;
        return this;
    }
}