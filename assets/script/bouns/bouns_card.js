cc.Class({
    extends: cc.Component,

    properties: {
        rule_page:cc.Node,
        game_main:cc.Node,
        game_result:cc.Node,
        ok_btn:cc.Button,
        back_btn:cc.Button,
        score_num:cc.Label,
        totao_num_label:cc.Label,
        formula_label:cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.ok_btn.node.on("click",this.startGame,this);
        // this.card_btn.node.on("click",this.turnCard,this);
        this.back_btn.node.on("click",this.closeGame,this);

        this.init();

        var loadCard = this.loadCard.bind(this);
        cc.loader.loadRes("pre/card", loadCard);
    },
    init:function(){
        this.complete = false;

        this.rule_page.active = true;
        this.rule_page.opacity = 255;

        this.scoreNum = 0;
        this.totalNum = 0;
        this.formula;

        this.total_score = 100;
        this.total_card = 15;

        this.deathNum = 0;

        this.cardWinNum = 6;

        this.cardArr = [];

        this.score_num.string = this.scoreNum;
    },
    loadCard:function(err,res){
        this.cardPre = res;

        for(var i=0;i<this.total_card;++i){
            var sNum = 0;
            if(i < this.cardWinNum){
                if(i == this.cardWinNum - 1)
                    sNum = this.total_score;
                else
                    sNum = Math.floor(Math.random()*(this.total_score - (this.cardWinNum - i)*Math.floor(this.total_score / 10))) + 1;

                this.total_score -= sNum;
            }
            
            this.cardArr[i] = {};
            this.cardArr[i].num = sNum;
            this.cardArr[i].res = cc.instantiate(res);
            this.cardArr[i].res.getChildByName("card_win").getChildByName("card_num").getComponent(cc.Label).string = this.cardArr[i].num;
            this.cardArr[i].turnWin = this.turnWin;
            this.cardArr[i].showResult = this.showResult;
            this.cardArr[i].main = this;
            this.cardArr[i].res.on("click",this.turnCard,this.cardArr[i]);
        }

        this.cardArr.sort(function(){return Math.random()>0.5 ? -1 : 1;});
        this.cardArr.reverse();
        this.cardArr.sort(function(){return Math.random()>0.5 ? -1 : 1;});
        for(var i=0;i<this.total_card;++i){
            var yNum = i%5;
            var zNum = Math.floor(i / 5);
            this.game_main.addChild(this.cardArr[i].res);
            this.cardArr[i].res.setPosition(-500 + (50 + this.cardArr[i].res.width) * yNum,100 - zNum*(this.cardArr[i].res.height - 5));
        }
    },
    startGame:function(){cc.log("startGame");
        var action = cc.fadeOut(0.3);
        this.rule_page.runAction(action);
        this.rule_page.active = false;

        var seq = cc.sequence(
            cc.scaleTo(0.3,1),
            cc.fadeIn(0.2)
        )
        this.game_main.runAction(seq);
    },
    turnCard:function(){
        var callFun = cc.callFunc(this.turnWin,this);
        var seq = cc.sequence(
            cc.scaleTo(0.2,0,1),
            callFun
        )
        this.res.getChildByName("card_back").runAction(seq);
    },
    turnWin:function(){
        var callFun = cc.callFunc(function(){},this);
        
        var name = "card_win";
        if(this.num == 0){
            name = "card_death";
            this.main.deathNum++;
            if(this.main.deathNum == 2){
                callFun = cc.callFunc(this.main.showAll,this.main);
                this.main.complete = true;
            }
        }else{
            if(!this.main.complete){
                this.main.scoreNum += this.num;
                this.main.score_num.string = this.main.scoreNum;
            }
        }

        var seq = cc.sequence(
            cc.scaleTo(0.2,1),
            callFun
        )

        this.res.getChildByName(name).runAction(seq);
    },
    showAll:function(){
        for(var i=0;i<this.total_card;++i){
            var turnCard = this.turnCard.bind(this.cardArr[i]);
            turnCard(this.cardArr[i]);
        }
        this.showResult();
    },
    showResult:function(){
        var bet = cacheManager.playerInfo.level_bet[this.main.gameLevelId].bet;
        var tNum = this.scoreNum * bet;
        this.totao_num_label.string = tNum;
        this.formula_label.string = this.scoreNum + ":" + bet + ";" + tNum;
       
        //var callFun = cc.callFunc(this.sendMessage,this);
        var seq = cc.sequence(
            cc.delayTime(1),
            cc.scaleTo(0.3,1.2),
            cc.scaleTo(0.1,1)
        )
        this.game_result.runAction(seq);
    },
    closeGame:function(){
        this.node.removeFromParent();
        this.main.loadBonus = false;
        //给1秒的等待时间
        this.main.showTime = 1;
        //更新整体的Bonus的倍数
        this.main.bonusTotalScore += this.scoreNum;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
