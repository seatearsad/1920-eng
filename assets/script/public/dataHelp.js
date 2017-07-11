var gameLevel = require("game_level_info");
var symbolInfo = require("symbolInfo");

module.exports = {
    dataCreate:function(res,type){
        var this_class;
        var list;
        switch(type){
            case 0://gameLevel
                this_class = gameLevel;
                list = cacheManager.gameLevelList;
                break;
            
            default:
                break;
        }
        // list = new Array(res.length);
        var allNum = res.length;
        var currNum = 1;
        for(var i in res){
			var newM = res[i];
			var t_data = this_class.create(newM,currNum,allNum);
			list[t_data.id] = t_data;
            currNum++;
		}
    }
}