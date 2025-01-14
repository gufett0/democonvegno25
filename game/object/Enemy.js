export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    // constructor(config) {
    //     super(config.scene, config.x, config.y,"brick")
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        scene.physics.world.enable(this)
        this.scene = scene
        this.scene.add.existing(this)  // 没这个就无法显示在scene
        this.scene.physics.world.enable(this)
        // this.setCollideWorldBounds(true) // 世界碰撞,设置后死亡动画也无法超过边界
        this.direction = -1 // 向左运动
        this.speed = 30
        this.life = 1
        this.alive = true
        this.scene.physics.add.collider(this, this.scene.graphicLayer, () => {
        })

        this.type = "enemy"

    }

    update() {

        // 在视野之外,停止运动
        if (Math.abs(this.x - this.scene.player.x) >= 450) {
            return
        }

        if (this.alive) {
            if (this.life <= 0) {
                this.alive = false
                this.dieSetting()
                return false
            }
            // 先转向
            // if(this.body.blocked.right || this.body.blocked.left){
            if (this.body.onWall()) {
                this.direction *= -1
            }
            // 后移动,否则会鬼畜
            this.body.velocity.x = this.direction * this.speed
        }
    }

    dieSetting() {
        this.life = 0
        this.alive = false
        this.direction = 0
        this.body.velocity.x = 0
        setTimeout(() => {
            if(this.scene)
            {
                this.scene.enemiesGroup.remove(this, true, true)   //从组 + 场景移除,并销毁
            }
        }, 2000)
    }

    collidingWithFireball() {
        if (this.alive) {
            this.scene.score += 10
            this.angle = -180
            // 创建时间线动画
            let timeline = this.scene.tweens.createTimeline()
            timeline.add({
                targets: this,
                y: this.y - 16,
                ease: 'Power1',
                duration: 600
            })
            timeline.add({
                targets: this,
                y: this.y + 600,
                ease: 'Power1',
                duration: 3000
            })
            timeline.play()

            this.dieSetting()
        }

    }

    fallInDeadZone() {
        if (this.alive) {
            this.dieSetting()
        }
    }
}
