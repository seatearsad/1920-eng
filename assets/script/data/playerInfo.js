module.exports = {
    create:function(obj){
        this.id = obj.id;
        this.playerName = obj.playerName;
        this.gender = obj.gender;//0 男 1 女
	    this.exp = obj.exp;
        this.level = obj.level;
        this.total_screen = obj.total_screen;
        this.total_win = obj.total_win;
        this.total_amount = obj.total_amount;
        this.curr_amount = obj.curr_amount;
        this.free_times = obj.free_times;
        this.level_bet = obj.level_bet;
        this.level_line = obj.level_line;
        this.loginKey;

        return this;
    }
}