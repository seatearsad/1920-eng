var initDataHelp = require("dataHelp");
var user = require("userInfo");
var player = require("playerInfo");
window.cacheManager = {
    main:null,
    isInit:false,
    // symbol:[],
    gameLevelList:[],
    language:{},
    userInfo:{},
    playerInfo:{},
    auto_times:0,
    init:function(){
        cc.loader.loadRes(dataList.language,this.loadLanguage);
        cc.loader.loadRes(dataList.gameLevelData,this.loadGameLevelList);
        // cc.loader.loadRes(dataList.symbol_1,this.loadSymbol);
        cacheManager.isInit = true;
    },
    loadGameLevelList:function(err,res){
        initDataHelp.dataCreate(res,0);
        // cacheManager.main.loadGameLevel();  
    },
    loadLanguage:function(err,res){
        cacheManager.language = res;
    },
    initUserInfo:function(obj){
        cacheManager.userInfo = user.create(obj);
    },
    initPlayerInfo:function(obj){
        cacheManager.playerInfo = player.create(obj);
    }
    // loadSymbol:function(err,res){
    //     initDataHelp.dataCreate(res,0);
    //     cacheManager.main.loadGameLevel();  
    // }
}
