export default class Brick extends Phaser.Physics.Arcade.Sprite {


    //  失败,无法使用
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)

        this.scene = scene

        this.scene.add.existing(this)  // 没这个就无法显示在scene
        this.scene.physics.world.enable(this)
        // this.body = new Phaser.Physics.Arcade.StaticBody(this.body.world, this)


        this.body.allowGravity = false  // 不生效???

        this.isCollided = false

        this.anims.play("brick_anim")


    }

    update() {

    }

}
