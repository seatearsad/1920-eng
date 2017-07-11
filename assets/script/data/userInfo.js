module.exports = {
    serverAddr:"",
    serverId:"",
    create:function(obj){
        this.userId = obj.userId;
        this.userName = obj.userName;
        this.sessionId = obj.sessionId;
        this.loginCode = obj.loginCode;

        return this;
    }
}