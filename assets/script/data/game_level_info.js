var symbolInfo = require("symbolInfo");
module.exports = {
    create(obj,num,allNum){
        var gameLevel = {};
        gameLevel.id = obj.id;
        gameLevel.symbol = obj.symbol;
        gameLevel.ui = obj.ui;
        gameLevel.line = obj.line;
        gameLevel.bet = obj.bet;
        gameLevel.symbolList = new Array();

        gameLevel.allNum = allNum;
        gameLevel.currNum = num;

        var url = "data/" + gameLevel.symbol;
        var loadSymbolList = this.loadSymbolList.bind(gameLevel);
        cc.loader.loadRes(url,loadSymbolList);

        cc.log("gameLevel");
        return gameLevel;
    },
    loadSymbolList:function(err,res){
        while(res.length > 0){
			var newM = res.pop();
			var t_data = symbolInfo.create(newM);
            cc.log(t_data);
			this.symbolList[t_data.id] = t_data;
		}
        // 暂时没有加载其他数据，所以等加载完所有图表数据后运行cc.log(this.allNum,this.currNum);
        if(this.allNum == this.currNum){
            cc.log("LOADall");
            // cacheManager.main.loadGameLevel(); 
        }
    }
}