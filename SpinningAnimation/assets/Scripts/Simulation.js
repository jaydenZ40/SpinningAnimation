// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.hammer = 0;
        this.gem = 0;
        this.life = 0;
        this.brush = 0;
        this.coin = 0;
    },
});

module.exports = {

    prize: [0, 0, 0, 0, 0], //  [hammer, gem, life, brush, coin]
    count: [0, 0, 0, 0, 0, 0, 0, 0], //  [hammer1, hammer3, gem35, gem75, life, brush1, brush3, coin]
    //hammer: 0,
    //gem: 0,
    //life: 0,
    //brush: 0,
    //coin: 0,

    collectPrize(prizeStr) {
        switch (prizeStr) {
            case "Hammer1": this.prize[0] += 1; this.count[0] += 1; break;
            case "Hammer3": this.prize[0] += 3; this.count[1] += 1; break;
            case "Gem35": this.prize[1] += 35; this.count[2] += 1; break;
            case "Gem75": this.prize[1] += 75; this.count[3] += 1; break;
            case "Life30": this.prize[2] += 75; this.count[4] += 1; break;
            case "Brush1": this.prize[3] += 1; this.count[5] += 1; break;
            case "Brush3": this.prize[3] += 1; this.count[6] += 1; break;
            case "Coin": this.prize[4] += 1; this.count[7] += 1; break;
        }
    },

    showResult() {
        console.log("Total Prize:");
        console.log("Hammer:", this.prize[0], ", Gem:", this.prize[1], ", Life:", this.prize[2]);
        console.log("Brush:", this.prize[3], ", Coin:", this.prize[4]);

        console.log("Total Count:");
        console.log("Hammer*1:", this.count[0], ", Hammer*3:", this.count[1], ", Gem*35:", this.count[2])
        console.log(", Gem*75:", this.count[3], "Life*30:", this.count[4], ", Brush*1:", this.count[5]);
        console.log("Brush*3:", this.count[6], ", Coin:", this.count[7]);
    },
};