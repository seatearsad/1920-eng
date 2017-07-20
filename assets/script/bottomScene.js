cc.Class({
    extends: cc.Component,

    properties: {
        start_btn:cc.Button,
        stop_btn:cc.Button,
        info_btn:cc.Button,
        max_bet_btn:cc.Button,
        auto_btn:cc.Button,
        line_btn:cc.Button,
        bet_btn:cc.Button,
        win_label:cc.Label,
        bet_total_label:cc.Label,
        line_label:cc.Label,
        bet_label:cc.Label,
        auto_list:cc.Node,
        line_bg:cc.Node,
        bet_bg:cc.Node,
        line_gray:cc.Node,
        bet_gray:cc.Node,
        // line_list:cc.ScrollView,
        win_num:0,
        bet_num:1
    },

    // use this for initialization
    onLoad: function () {
        this.start_btn.node.on('click',this.startGame,this);
        this.info_btn.node.on('click',this.btnCallBack,this);
        this.max_bet_btn.node.on('click',this.btnCallBack,this);
        this.auto_btn.node.on('click',this.autoCallBack,this);
        this.line_btn.node.on('click',this.btnCallBack,this);
        this.bet_btn.node.on('click',this.btnCallBack,this);

        this.auto_num = [10,20,50,100,200];

        var loadAutoList = this.loadAutoList.bind(this);
        this.auto_show = false;
        // this.auto_list.opacity = 0;
        // this.auto_list.zIndex = this.auto_btn.node.zIndex - 1;

        this.line_show = false;
        this.bet_show = false;

        cc.loader.loadRes("pre/auto_num_btn", loadAutoList);
    },
    startGame:function(){
        cc.log("start game!");
            //上次免费未结束返回后进行处理
        if(!this.main.jackpot.getComponent("slotScene").isFree && cacheManager.playerInfo.free_times[this.main.gameLevelId].free > 0){
            if(this.main.jackpot.getComponent("slotScene").isAuto){
                this.main.jackpot.getComponent("slotScene").clearAuto();
                this.main.jackpot.getComponent("slotScene").nextAuto = true;
            }
            this.main.jackpot.getComponent("slotScene").freeStart();
            this.main.top.getComponent("topScene").show_uppop(1);
            this.startFree();
        }else{
            this.main.jackpot.getComponent("slotScene").startSlots();
            this.changeState(1);
            this.stop_btn.node.on("click",this.stopSpin,this);
        }
        //取消滚动菜单
        if(this.bet_show){
            this.hideBetShow();
        }
        if(this.line_show){
            this.hideLineShow();
        }
        //取消自动旋转菜单
        if(this.auto_show) this.autoCallBack();
    },
    autoCallBack:function(){
        if(this.auto_show){
            var finished = cc.callFunc(function() {
                    this.auto_list.getComponentInChildren(cc.Sprite).node.rotation = 0;
            }, this);
            
            var seq = cc.sequence(
                cc.moveTo(0.2,cc.v2(377, -435)),
                finished
            )
            this.auto_show = false;
            
        }else{
            var finished = cc.callFunc(function() {
                    this.auto_list.getComponentInChildren(cc.Sprite).node.rotation = 180;
            }, this);

            var seq = cc.sequence(
                cc.fadeIn(0.2),
                cc.moveTo(0.2,cc.v2(377, 0)),
                finished
            )
            this.auto_show = true;
            
        }

        this.auto_list.runAction(seq);
    },
    hideBetShow:function(){
        this.bet_show = false;
        this.select_scroll.removeFromParent();
        this.bet_bg.y = 168;
        this.bet_gray.active = true;
    },
    hideLineShow:function(){
        this.line_show = false;
        this.select_scroll.removeFromParent();
        this.line_bg.y = 168;
        this.line_gray.active = true;
    },
    btnCallBack:function(event){
       var btn = event.detail;
       cc.log(btn.name);

       if(btn.name == "line_btn<Button>"){//选择线数
           if(this.bet_show){
                this.hideBetShow();
           }
           
           if(this.line_show){
               this.hideLineShow();
           }else{
               this.line_show = true;
           }
       }else if(btn.name == "bet_btn<Button>"){//选择下注数
           if(this.line_show){
                this.hideLineShow();
           }
           
           if(this.bet_show){
               this.hideBetShow();
           }else{
               this.bet_show = true;
           }
       }else if(btn.name == "max_bet_btn<Button>"){//最大赌注
           var betArr = cacheManager.gameLevelList[this.main.gameLevelId].bet;
           var maxBet = betArr[betArr.length - 1];

           var send = {"levelId":this.main.gameLevelId,"bet":maxBet};
           message.sendData(messageDefine.levelBet,send,this);

           this.startGame();
       }
       if(this.line_show || this.bet_show){
            var testLoadScroll = this.testLoadScroll.bind(this);
            cc.loader.loadRes("pre/select_bg",testLoadScroll);
       }
    },
    testLoadScroll:function(err,res){
        this.select_scroll = cc.instantiate(res);
        this.select_scroll.y = 60;
        this.select_scroll.zIndex = 10;

        if(this.line_show){
            this.line_gray.active = false;
            this.line_btn.node.addChild(this.select_scroll);
            this.line_bg.y =  this.select_scroll.height + 50;
        }else if(this.bet_show){
            this.bet_gray.active = false;
            this.bet_btn.node.addChild(this.select_scroll);
            this.bet_bg.y = this.select_scroll.height + 50;
        }
        
        this.loadBottomData();
    },
    loadBottomData:function(){
        var loadLineBetList = this.loadLineBetList.bind(this);
        cc.loader.loadRes("pre/line_bet_btn",loadLineBetList);
    },
    loadAutoList:function(err,res){
        this.buttonPre = res;

        for(var i=0;i < this.auto_num.length;++i){
            var base_space = 10;

            var num_btn = cc.instantiate(this.buttonPre);
            var height = num_btn.height;
            num_btn.on("click",this.clickAutoNum,this);

            num_btn.getComponentInChildren(cc.Label).string = this.auto_num[i];
            this.auto_list.addChild(num_btn);

            var hh = (height + base_space) * i + base_space;
            num_btn.position = cc.v2(0, hh);
        }
    },
    loadLineBetList:function(err,res){
        var allLineNum = cacheManager.gameLevelList[this.main.gameLevelId].line;
        var betArr = cacheManager.gameLevelList[this.main.gameLevelId].bet;
        var buttonPre = res;
        var content = this.select_scroll.getComponentInChildren(cc.ScrollView).content;
        
        var base_space = 8;

        if(this.line_show){
            for(var i=allLineNum;i > 0;i--){
                var num_btn = cc.instantiate(buttonPre);
                var height = num_btn.height;
                num_btn.on("click",this.changeLineNum,this);

                num_btn.getComponentInChildren(cc.Label).string = i;
                content.addChild(num_btn);

                var hh = -(height + base_space) * (allLineNum - i) - base_space;
                num_btn.position = cc.v2(0, hh);
            }
            content.height = (height + base_space) * allLineNum + base_space;
        }

        if(this.bet_show){
            for(var i=betArr.length-1;i >= 0;i--){
                var num_btn = cc.instantiate(buttonPre);
                var height = num_btn.height;
                num_btn.on("click",this.changeBetNum,this);

                num_btn.getComponentInChildren(cc.Label).string = betArr[i];
                
                content.addChild(num_btn);

                var hh = -(height + base_space) * (betArr.length - i - 1) - base_space;
                num_btn.position = cc.v2(0, hh);
            }
            content.height = (height + base_space) * betArr.length + base_space;
        }

        
    },
    changeLineNum:function(event){
        var btn = event.detail;
        var num = btn.node.getComponentInChildren(cc.Label).string;
        this.line_label.string = num;

        this.hideLineShow();

        var lineArr = new Array();
        for(var i=0;i<num;++i){
            lineArr[i]=i;
        }
        var line_m = this.main.jackpot.getComponent("slotScene").line_total.getComponent("lineManager");
        line_m.removeLine(cacheManager.gameLevelList[this.main.gameLevelId].line);
        line_m.getComponent("lineManager").showLine(lineArr);

        var send = {"levelId":this.main.gameLevelId,"line":num};
        message.sendData(messageDefine.levelLine,send,this);
    },
    changeBetNum:function(event){
        var btn = event.detail;
        var num = btn.node.getComponentInChildren(cc.Label).string;
        this.bet_label.string = num;
        
        this.hideBetShow();
        
        var send = {"levelId":this.main.gameLevelId,"bet":num};
        message.sendData(messageDefine.levelBet,send,this);
    },
    httpResp:function(resp){
        // cc.log("isAllow",resp.isAllow);
        if(!resp.isAllow) this.showMessage("not_allowed");
        cacheManager.initPlayerInfo(resp.info);
        this.main.updatePlayer();
    },
    showMessage:function(str){//网络连接错误
        this.showMessageTxt = cacheManager.language[str];
        var loadShowMessage = this.loadShowMessage.bind(this);
        cc.loader.loadRes("pre/showMessage", loadShowMessage);
    },
    loadShowMessage:function(err,prefab){
        var showMessageNode = cc.instantiate(prefab);
        showMessageNode.getComponent("showMessage").changeTxt(this.showMessageTxt);
        this.main.node.addChild(showMessageNode);
        var seq = cc.sequence(
            cc.fadeIn(0.2),
            cc.scaleTo(0.2,1.05),
            cc.scaleTo(0.1,1)
        )
        showMessageNode.runAction(seq);
    },
    clickAutoNum:function(event){
        var btn = event.detail;
        var num = btn.node.getComponentInChildren(cc.Label).string;
        cacheManager.auto_times = num;

        this.autoCallBack();

        this.startAuto();
        //取消滚动菜单
        if(this.bet_show){
            this.hideBetShow();
        }
        if(this.line_show){
            this.hideLineShow();
        }
    },
    startAuto:function(){
        this.main.top.getComponent("topScene").show_uppop(0);

        this.main.jackpot.getComponent("slotScene").autoStart();
        
        //处理开始按钮的样式
        this.changeState(1);

        this.stop_btn.node.on("click",this.stopAuto,this);
    },
    startFree:function(){
        //处理开始按钮的样式
        this.changeState(1);
        this.stop_btn.node.off("click",this.stopAuto,this);
        this.stop_btn.node.off("click",this.stopSpin,this);
        this.stop_btn.node.on("click",this.stopFree,this);
    },
    changeState:function(stat){//stat 0 结束 1 开始
        if(stat == 1){
            this.start_btn.node.active = false;
            this.stop_btn.node.active = true;
        }else{
            this.start_btn.node.active = true;
            this.stop_btn.node.active = false;
        }
        //改变其他按钮的状态
        this.disableBtn(stat);
    },
    disableBtn:function(stat){
        if(stat == 1){
            this.info_btn.interactable = false;
            this.max_bet_btn.interactable = false;
            this.auto_btn.interactable = false;
            this.line_btn.interactable = false;
            this.bet_btn.interactable = false;
        }else{
            this.info_btn.interactable = true;
            this.max_bet_btn.interactable = true;
            this.auto_btn.interactable = true;
            this.line_btn.interactable = true;
            this.bet_btn.interactable = true;
        }
    },
    stopAuto:function(){
        this.stop_btn.node.off("click",this.stopAuto,this);
        cacheManager.auto_times = 0;
        this.main.jackpot.getComponent("slotScene").clearAuto();
    },
    stopSpin:function(){
        this.stop_btn.node.off("click",this.stopSpin,this);
        this.main.jackpot.getComponent("slotScene").fastStop();
    },
    stopFree:function(){
        this.stop_btn.node.off("click",this.stopFree,this);
        this.changeState(0);
        this.main.jackpot.getComponent("slotScene").clearFree();
    },
    updatePlayer:function(){
        var playerInfo = cacheManager.playerInfo;
        this.bet_label.string = playerInfo.level_bet[this.main.gameLevelId].bet;
        this.line_label.string = playerInfo.level_line[this.main.gameLevelId].line;
        this.bet_total_label.string = playerInfo.level_bet[this.main.gameLevelId].bet * playerInfo.level_line[this.main.gameLevelId].line;
        this.win_label.string = this.win_num;
    },
    updateWin:function(win){
        this.win_label.string = win;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
