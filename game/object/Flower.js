
import Mushroom from "./Mushroom"
export default class Flower extends Mushroom {

    constructor(config) {
        super(config);

        this.anims.play("flower_anim")
        this.body.allowGravity = false
    }

    update() {

    }

    // 花✿ 从砖块里顶出来
    collidingBricks() {
        this.scene.tweens.add({
            targets: [this],
            y: this.y - this.height * 2,
            duration: 200,// 持续时间
            callbackScope: this,
            // x: brick.x,
            ease: 'Quintic',    // Phaser.Math. Easing
            yoyo: true,
            onComplete: () => {}
        })
    }



}
