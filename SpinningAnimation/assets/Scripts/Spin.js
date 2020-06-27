// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        wheel: cc.Node,
        rotateWheel: cc.Node,
        playButton: cc.Node,
        claimButton: cc.Node,
        
        Hammer1: cc.Node,
        Hammer3: cc.Node,
        Life30: cc.Node,
        Brush1: cc.Node,
        Brush3: cc.Node,
        Gem35: cc.Node,
        Gem75: cc.Node,
        Coin750: cc.Node,
        prize: cc.Node,

        bgPrefab: cc.Prefab,

        rotSpeed: 5,
        acc: 0.001,
        turns: 4,
    },

	onLoad() {
        this.isSpinning = false;
        this.isSimulating = false;
    },

    simulate() {
        this.isSimulating = true;

        for (var i = 0; i < 1000; i++) {
            this.spin();
            while (true) {
                this.repeatEachFrame();
                if (this.rotSpeed < 0) break;
            }
            this.claim();
        }

        var passPrizeName = require('./Simulation.js');
        passPrizeName.showResult();
    },

    spin() {
        /* -----------------------------------------------------------------------------
         * The arrow should stop at the specific prize generated by the random int number.

           Prize        prize_Int       Angle
           Life*30       0-19           0-44
           Brush*3       20-29          45-89
           Gem*35        30-39          90-134
           Hammer*3      40-49          135-179
           Coin*750      50-54          180-224
           Brush*1       55-74          225-269
           Gems*75       75-79          270-314
           Hammer*1      80-99          315-359
        */
        this.isSpinning = true;

        var prize_Int = Math.floor(Math.random() * 100);
        //console.log(prize_Int);
        var totalRotation = Math.floor(Math.random() * 39) + 5;   //  5-39 degree to aviod ambiguous when stop at border.

        if (prize_Int < 20) {
            this.prize = this.Life30;
        }
        else if (prize_Int < 30) {
            totalRotation += 45;
            this.prize = this.Brush3;
        }
        else if (prize_Int < 40) {
            totalRotation += 90;
            this.prize = this.Gem35;
        }
        else if (prize_Int < 50) {
            totalRotation += 135;
            this.prize = this.Hammer3;
        }
        else if (prize_Int < 55) {
            totalRotation += 180;
            this.prize = this.Coin750;
        }
        else if (prize_Int < 75) {
            totalRotation += 225;
            this.prize = this.Brush1;
        }
        else if (prize_Int < 80) {
            totalRotation += 270;
            this.prize = this.Gem75;
        }
        else {
            totalRotation += 315;
            this.prize = this.Hammer1;
        }
        totalRotation += this.turns * 360;

        //  Based on the angle, calculate the acc to stop the wheel:
        //  totaRotation = speed + (speed-acc) + (speed-2acc) + ... + (speed - (n-1)acc)  // speed - (n-1)acc = 0
        //  acc = speed^2 / (2*totalRotation - speed)
        this.acc = (this.rotSpeed * this.rotSpeed) / (2 * totalRotation - this.rotSpeed);
        
        // -----------------------------------------------------------------------------

        this.playButton.active = false;      // disable play button
    },

    claim() {
        if (this.isSimulating) {
            var passPrizeName = require('./Simulation.js');
            passPrizeName.collectPrize(this.prize.name);
        }

        // restore all setting before spinning
        this.prize.active = false;
        this.claimButton.active = false;
        this.playButton.active = true;

        this.wheel = cc.instantiate(this.bgPrefab);
        this.node.addChild(this.wheel);
        this.wheel.parent = cc.find("Canvas/bg");
        this.wheel.setPosition(cc.v2(0, 0));
    },

    repeatEachFrame: function () {
        if (this.rotSpeed > 0) {    // keep rotating
            this.rotSpeed -= this.acc;  // reduce speed by calculated acc in spin(), in order to stop at correct sector

            this.rotateWheel.angle = (this.rotateWheel.angle + this.rotSpeed) % 360;   // wheel rotate
        }
        else {                      //  wheel stop, show prize
            this.isSpinning = false;

            let t = cc.tween;
            t(this.wheel)
                .to(0.5, {})
                .call(() => {
                    cc.find("Canvas/keepPos/keepPos1/keepPos2").angle = this.rotateWheel.angle;
                    this.prize.parent = cc.find("Canvas/keepPos/keepPos1/keepPos2/keepPos3");
                    this.wheel.destroy();
                    this.claimButton.active = true;
                    t(this.prize)   // move to center and get twice bigger.
                        .parallel(
                            t().to(2, { scale: 2 }),
                            t().to(2, { position: cc.v2(0, 0) })
                        )
                        .start()
                })
                .start()
        }
    },

    update(dt) {
        if (this.isSpinning) {
            this.repeatEachFrame();
        }
    },
});
