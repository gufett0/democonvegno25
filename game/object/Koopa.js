import Enemy from "./Enemy"

export default class Koopa extends Enemy {
    // 这货是小王八
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)

        this.walk()
        this.isSquished = false // 是否缩壳
        this.onRecover = false // 正在恢复
        this.isSquishFly = false // 缩壳飞行模式

        this.recoveryInterval = 3000    // 恢复间隔,毫秒
        this.timeManage = {
            nowTime: 0,
            startSquish: 0,     // 开始缩壳的时间
            startRecover: 0,    // 开始恢复的时间
            recoverFinish: 0,   // 恢复完成的时间
        }

    }

    update(time, delta) {
        // 在视野之外,停止运动
        if (Math.abs(this.x - this.scene.player.x) >= 450) {
            return
        }

        this.timeManage.nowTime = time
        if (this.alive) {
            if (this.life <= 0) {
                this.alive = false
                this.dieSetting()
                return false
            }

            //  缩壳中
            if (this.isSquished) {
                // 缩壳在飞
                if (this.isSquishFly) {
                    this.speed = 300
                    // 这时候可以和 enemy 碰撞并杀死
                    this.scene.physics.world.collide(this, this.scene.enemiesGroup, (koopa, enemy) => {
                        enemy.collidingWithFireball()
                    });
                } else {
                    this.speed = 30
                }

                // 恢复过程中
                if (this.timeManage.startRecover < this.timeManage.nowTime && this.timeManage.recoverFinish > this.timeManage.nowTime && !this.isSquishFly) {
                    // 恢复中,加一层 this.onRecover 防止动画多次播放被覆盖
                    if (this.onRecover) {
                        return
                    } else {
                        this.anims.play("koopaSquishRecover_anim")
                        this.onRecover = true
                    }
                }
                //  恢复完成
                if (this.timeManage.recoverFinish < this.timeManage.nowTime && !this.isSquishFly) {
                    this.walk()
                    this.direction = -1
                    this.onRecover = false
                }
            }

            // 朝向右边的时候就翻转自己
            this.flipX = this.body.facing === 14;
            // 先转向
            if (this.body.blocked.right || this.body.blocked.left) {
                // if (this.body.onWall()) {
                this.direction *= -1
            }
            // 后移动,否则会鬼畜
            this.body.velocity.x = this.speed * this.direction;
        }
    }

    walk() {
        this.anims.play("koopaWalk_anim")
        this.isSquished = false // 是否缩壳
        this.setSize(16,24)
        this.setOffset(0,0)
    }

    squish() {
        this.anims.play("koopaSquish_anim")
        this.isSquished = true
        this.setSize(16,16)
        this.setOffset(0,0)
    }


    collidingWithPlayer() {
        // player 踩到 this
        if (this.body.touching.up && this.scene.player.body.touching.down) {
            if (this.isSquished) {
                // 已经缩壳,再踩就会飞走
                if ((this.scene.player.x - this.x) >= this.body.halfWidth) {
                    // 踩右边
                    this.direction = -1
                } else {
                    this.direction = 1
                }
                this.squish()
                this.isSquishFly = true

            } else {
                // 踩一下,缩壳, player 被弹起
                this.direction = 0
                this.body.velocity.x = 0
                this.anims.stop()
                this.squish()
                this.scene.player.jump()
                this.timeManage.startSquish = this.timeManage.nowTime
                this.timeManage.startRecover = this.timeManage.nowTime + this.recoveryInterval
                this.timeManage.recoverFinish = this.timeManage.startRecover + this.recoveryInterval
            }

        }
        // 不是踩死,普通碰撞
        else {
            if (this.alive && !this.isSquished) {
                this.scene.player.eventEmitter.emit('getDamage', this);
            }
            if (this.isSquishFly) {
                this.scene.player.eventEmitter.emit('getDamage', this);

            }
        }
    }

}
