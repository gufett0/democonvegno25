import PlayerSprite from "../object/Player"
import Button from "../object/Button";
import Phaser from "phaser";

export default class BlankScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'BlankScene',
        })
    }

    create() {
        // 马里奥标题
        this.title = this.add.sprite(this.sys.game.config.width / 2, 16 * 5, "atlas_object", "UI/Menu/title")

        // this.attractMode = this.scene.launch('GameScene');

        // 按键开始的提示,setInterval 闪烁
        this.pressX = this.add.bitmapText(this.sys.game.config.width / 2, 9 * 16, 'font', 'PRESS X TO START', 8)
            .setOrigin(0.5, 0.5)
        setInterval(() => {
            this.pressX.alpha = this.pressX.alpha === 1 ? 0 : 1
        }, 500)


    }

    update(time, delta) {
        // if (this.title.x > 0) {
        //     this.title.x -=5
        //     this.title.y -=5
        // }else {
        //     // console.log(this.title)
        //
        // }
    }

}