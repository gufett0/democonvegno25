export default class Coin extends Phaser.Physics.Arcade.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y, "initTexture");
        config.scene.physics.world.enable(this);
        this.scene = config.scene;
        this.number = config.number;

        this.scene.add.existing(this);  // 没这个就无法显示在scene
        this.scene.physics.world.enable(this);

        this.alive = true
        this.body.allowGravity = false

        this.anims.play("coinBlock_anim")

    }

    update() {

    }

    collidingBricksCoin() {
        this.scene.tweens.add({
            targets: [this],
            y: this.y - this.height * 2,
            duration: 200,// 持续时间
            callbackScope: this,
            // x: brick.x,
            ease: 'Quintic',    // Phaser.Math. Easing
            yoyo: true,
            onComplete: () => {
                this.scene.score += 50
                this.destroy()
            }
        })
    }

    collidingWithPlayer() {
        this.scene.score += 50
        this.destroy()
    }


}
