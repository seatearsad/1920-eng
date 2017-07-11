module.exports = {
    create(obj){
        var symbol = {};
        symbol.id = obj.id;
        symbol.type = obj.type;
        symbol.name = obj.name;
        symbol.icon = obj.icon;
        symbol.reward = obj.reward;
        // cc.log(this.reward[0].num);
        // cc.log(this.icon);

        return symbol;
    }
}