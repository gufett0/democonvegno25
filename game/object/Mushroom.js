export default class Mushroom extends Phaser.Physics.Arcade.Sprite {

    constructor(config) {
        super(config.scene, config.x, config.y,"initTexture");
        config.scene.physics.world.enable(this)
        this.scene = config.scene
        this.scene.add.existing(this)  // 没这个就无法显示在scene
        this.scene.physics.world.enable(this)

        this.alive = true
        this.direction = 1 // 向右
        this.speed = 60
        this.life = 1
        this.scene.physics.add.collider(this, this.scene.graphicLayer, () => {
        })

        this.anims.play("mushroom_anim")

    }

    update() {

            // 先转向
            // if(this.body.blocked.right || this.body.blocked.left){
            if (this.body.onWall()) {
                this.direction *= -1
            }
            // 后移动,否则会鬼畜
            this.body.velocity.x = this.direction *this.speed

    }

    // 蘑菇从砖块里顶出来
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
        if ((this.scene.player.x - this.x) >= this.body.halfWidth) {
            // 踩右边
            this.direction = -1
        } else {
            this.direction = 1
        }
    }

    collidingWithPlayer(player, mushroom) {
        player.changeMode("upgrade")

        this.destroy()
    }


}
