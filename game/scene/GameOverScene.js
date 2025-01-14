import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOverScene'
        })
    }

    init(condition) {
        this.condition = condition
    }

    create() {
        let textStyle = {
            fill: "#ffffff",
            align: 'center',
            fontSize: 36,
            fontStyle: 'bold',
            padding: 0,
        }
        let textResult
        this.cameras.main.setBackgroundColor(0x2a0503)
        if (this.condition.result === 'win') {
            textResult = "Victory"
            this.overText = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'atlas', 'win')
        } else if (this.condition.result === 'lose') {
            textResult = "Defeat"
            this.overText = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'atlas', 'gameOver')
        }
        this.input.keyboard.on('keydown_ENTER', function (event) {
            location.reload()
        })

        this.cameras.main.stopFollow()
        this.cameras.main.setScroll(0, 0)


        //  结束文字
         this.add.text(100, 100, textResult, textStyle)
         this.add.text(100, 200, "回车重玩", textStyle)

    }


}
