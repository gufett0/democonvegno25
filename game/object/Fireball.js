export default class Fireball extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "atlas_object", "Player/Mario_Fire/fireBall_01")
        config.scene.physics.world.enable(this)
        this.scene = config.scene
        this.damage = 1
        this.hasCollided = false
        this.body.setSize(8, 8);
        this.body.setOffset(0,0)

        this.scene.add.existing(this)

        // 旧版的粒子,指哪打哪..
        // 把 this 以 200 的速度移动到指针位置
        // this.scene.physics.moveTo(this, this.scene.crosshair.x, this.scene.crosshair.y, 200)
        // 粒子
        // this.particles = this.scene.add.particles('atlas', 'whiteParticle')
        // this.emitter = this.particles.createEmitter({
        //     x: this.x,
        //     y: this.y,
        //     speed: 16, // 是粒子扩散速度,太高粒子术会非常大
        // })
        // 不允许 arcade 重力
        // this.body.allowGravity = false

    }

    fire(x, y, left) {
        this.body.allowGravity = true;

        this.setPosition(x, y);
        this.body.velocity.x = 200 * (left ? -1 : 1);
        this.play("fireFly");
        // this.scene.sound.playAudioSprite('sfx', 'smb_fireball');
    }

    update() {
        // this.emitter.setPosition(this.x, this.y)
    }

    collided() {
        if (this.body.velocity.y === 0) {
            // 反弹
            this.body.velocity.y = -150;
        }
        if (this.body.velocity.x === 0) {
            this.explode();
        }
    }

    explode() {
        this.body.allowGravity = false;
        this.body.velocity.y = 0;
        // 为了防止在和 enemy 碰撞后再和墙壁碰撞,destroy() 以后再播放动画导致错误
        if (this.hasCollided) {
            return
        }
        this.play("fireExplode");
        this.hasCollided = true
        // 爆炸动画结束,从场景移除,并销毁
        this.once('animationcomplete', function () { ///this refers to an arcade sprite.
            this.scene.playerAttackGroup.remove(this, true, true)
        }, this)
    }
}
