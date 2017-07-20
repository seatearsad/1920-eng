window.gameDiceGetResultReq = {
    getData:function(obj){
        this.loginKey = obj.loginKey;
        this.los = obj.los;

        return this;
    }
}