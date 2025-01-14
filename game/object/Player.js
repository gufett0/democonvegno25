import Fireball from "./Fireball"
import Coin from "./Coin"
import Mushroom from "./Mushroom"
import Flower from "./Flower"

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(config, gameConfig) {
        super(config.scene, config.x, config.y, "initTexture")

        this.scaleX = 0.07; 
        this.scaleY = this.scaleX;

        this.hasSkin = false;

        this.scene = config.scene
        this.scene.add.existing(this)// 没这个就无法显示在scene
        this.scene.physics.world.enable(this)

        this.setCollideWorldBounds(true) // 世界碰撞

        this.bigMode = false    // 改变大小需使用 changeMode(mode)
        this.fireMode = false   // 火 mario
        this.direction = 1 // 向右
        this.speed = 150
        this.jumpSpeed = 210

        let res = localStorage.getItem("sustainabilityScore");
            if(JSON.parse(res) > 1){
                this.jumpSpeed = 400
                if(JSON.parse(res) > 2){
                    this.speed = 350
                }
            }

        this.life = gameConfig.life || 3  //重玩的话继承原来的生命值
        this.alive = true
        this.isJumping = false
        this.ability = {
            fireball: false,   // 丢火球
            invincible: false, // 无敌(吃星星)
            immune: false,  // 免疫伤害,被伤害后会触发一段时间免疫
        }
        this.timeManage = {
            nowTime: 0,
            startInvincible: 0,     // 开始无敌的时间
            overInvincible: 0,     // 结束无敌的时间
        }


        this.currentModeIndex = 1   // 模式索引值,对应 [DIE_MODE, SMALL_MODE, BIG_MODE, FIRE_MODE]
        // this.small();

        this.dieAnimPlaying = false

        // fire 模式的马里奥自带粒子
        // let particles = this.scene.add.particles("atlas_object","Items/coin",);
        let particles = this.scene.add.particles("red")
        this.emitter = particles.createEmitter({
            radial: false,
            // x: 100,
            // y: { min: 0, max: 560, steps: 256 },
            lifespan: 1000,
            // speedX: { min: -50, max: -100 },
            // speedX: { min: -50, max: -100 },
            quantity: 4,
            // gravityY: -50,
            scale: {start: 0.6, end: 0, ease: 'Power3'},
            blendMode: 'ADD'
        });

        // 创建人物动画
        this.creatAnims()
        // 添加控制按键
        this.creatControls()

        //  监听事件
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.eventEmitter.on('getDamage', this.getDamageHandler, this);


    }

    update(time, delta) {
        this.timeManage.nowTime = time

        if(!this.hasSkin){
            let res = localStorage.getItem("sustainabilityScore");
            if(JSON.parse(res) > 0){
                this.hasSkin = true;
            }
        }

        if (this.alive) {
            // 控制移动
            this.isJumping = this.body.blocked.none && this.body.velocity !== 0
            /**
             *   TODO: BUG 蹲下前有速度将会无限滑行.需要重新设置下蹲后的size
             */
            if (this.keys.down.isDown) {
                if (this.bigMode) {
                    this.anims.play("bigSquat_anim")
                    // this.setSize(16,22)
                }
            }
            else if (this.keys.left.isDown) {
                this.direction = -1
                this.body.velocity.x = this.direction * this.speed
                if (this.isJumping) return   // 为了阻挡左右的动画覆盖跳跃动画
                this.bigMode ? 
                    this.anims.play('bigLeft_anim', true) 
                    : 
                    this.hasSkin ?
                        this.anims.play('skinLeft_anim',true)
                        :
                        this.anims.play('left_anim', true)
            }
            else if (this.keys.right.isDown) {
                this.direction = 1
                this.body.velocity.x = this.direction * this.speed
                if (this.isJumping) return // 为了阻挡左右的动画覆盖跳跃动画
                this.bigMode ? 
                    this.anims.play('bigRight_anim', true) 
                    : 
                    this.hasSkin ?
                        this.anims.play('skinRight_anim', true)
                        :
                        this.anims.play('right_anim', true)
            }
            // 触地才允许跳跃
            else if (this.keys.up.isDown && this.body.blocked.down) {
                // else if (this.keys.up.isDown) {  // 无限跳
                this.jump()
            }

            else if (this.isJumping) {
                if (this.direction === 1) {
                    this.bigMode ? 
                        this.anims.play('bigJumpRight_anim', true) 
                        : 
                        this.hasSkin ?
                            this.anims.play('skinJumpRight_anim', true)
                            :
                            this.anims.play('jumpRight_anim', true)
                } else {
                    this.bigMode ? 
                        this.anims.play('bigJumpLeft_anim', true) 
                        : 
                        this.hasSkin ?
                            this.anims.play('skinJumpLeft_anim', true)
                            :
                            this.anims.play('jumpLeft_anim', true)
                }
            }
            else {
                this.body.velocity.x = 0
                if (this.direction === 1) {
                    this.bigMode ? 
                        this.anims.play('bigFaceRight_anim', true) 
                        : 
                        this.hasSkin ?
                            this.anims.play('skinFaceRight_anim', true)
                            :
                            this.anims.play('faceRight_anim', true)                      

                } else {
                    this.bigMode ?
                        this.anims.play('bigFaceLeft_anim', true) 
                        : 
                        this.hasSkin ?
                            this.anims.play('skinFaceLeft_anim', true)
                            :
                            this.anims.play('faceLeft_anim', true)

                }
            }
            // // 开火的控制
            // if (this.keys.fire.isDown) {
            //     this.handleFire()
            // }
        }
        // !this.alive
        else {
            this.die()
        }


    }

    jump() {
        this.body.velocity.y = this.jumpSpeed * -1
    }

    changeMode(condition) {
        // 模式转换用 upgrade  downgrade, 这里只设置各个模式中的 player 参数,而不执行动画之类
        const DIE_MODE = () => {
            this.life--
            this.alive = false
            this.direction = 0
            this.body.velocity.x = 0

            this.emitter.stopFollow(this)
            this.emitter.explode()
        }
        const SMALL_MODE = () => {
            this.bigMode = false
            this.ability.fireball = false
            this.ability.invincible = false
            // this.setTexture("big_mario",this.anims.currentFrame.index)
            console.log(this.scene)
            // this.setTexture("atalas", this.frame.name)    // 替换内容和当前 frame 动作相同
            this.setSize(16, 16)
            this.setOffset(0, 0)

            // this.originY = 0 // 此游戏对象的垂直原点
        }
        const SMALL_SKIN_MODE = () => {
            this.bigMode = false
            this.ability.fireball = false
            this.ability.invincible = false
            this.setTexture("small_mario_skin",this.anims.currentFrame.index)
            console.log(this.scene)
        }
        const BIG_MODE = () => {
            this.bigMode = true
            this.ability.fireball = false
            this.ability.invincible = false
            //this.setTexture("big_mario",this.anims.currentFrame.index)
            // this.setTexture("big_mario", this.frame.name)    // 替换内容和当前 frame 动作相同
            this.setSize(16, 32)
            this.setOffset(0, 0)
            this.setScale(1)
            this.y -= 16
            // this.originY = 0.5 // 此游戏对象的垂直原点
            this.emitter.stopFollow(this)
        }
        const FIRE_MODE = () => {
            this.bigMode = true
            this.ability.fireball = true

            this.emitter.startFollow(this)


        }

        //  模式只能按序升降级
        const MODE_ARR = [DIE_MODE, this.hasSkin ? SMALL_MODE : SMALL_SKIN_MODE, BIG_MODE, FIRE_MODE]


        if (condition === "upgrade") {
            this.currentModeIndex = this.currentModeIndex < MODE_ARR.length - 1 ? ++this.currentModeIndex : this.currentModeIndex
        } else if (condition === "downgrade") {
            this.currentModeIndex = this.currentModeIndex > 0 ? --this.currentModeIndex : 0
        } else if (condition === "die") {
            this.currentModeIndex = 0
        }

        //  执行当前模式
        MODE_ARR[this.currentModeIndex]()
    }

    small() {
        this.body.setSize(10, 10);
        // this.body.offset.set(3, 14);
    }

    large() {
        this.body.setSize(10, 22);
        this.body.offset.set(3, 10);
    }

    creatAnims() {

        this.scene.anims.create({
            key: "bigRight_anim",
            frames: this.scene.anims.generateFrameNumbers("big_mario", {start: 2, end: 4}),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: "bigLeft_anim",
            frames: this.scene.anims.generateFrameNumbers("big_mario", {start: 8, end: 10}),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: "bigFaceRight_anim",
            frames: this.scene.anims.generateFrameNumbers("big_mario", {start: 1, end: 1}),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: "bigFaceLeft_anim",
            frames: this.scene.anims.generateFrameNumbers("big_mario", {start: 11, end: 11}),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: "bigJumpRight_anim",
            frames: this.scene.anims.generateFrameNumbers("big_mario", {start: 5, end: 5}),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: "bigJumpLeft_anim",
            frames: this.scene.anims.generateFrameNumbers("big_mario", {start: 7, end: 7}),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: "bigSquat_anim",
            frames: this.scene.anims.generateFrameNumbers("big_mario", {start: 6, end: 6}),
            frameRate: 1,
            repeat: 1
        })

        //skin
        this.scene.anims.create({
            key: "skinLeft_anim",
             frames: this.scene.anims.generateFrameNames("small_mario_skin", {start: 7, end: 9}),
            frameRate: 8,
            repeat: -1 
        })
        this.scene.anims.create({
            key: "skinRight_anim",
            frames: this.scene.anims.generateFrameNames("small_mario_skin", {start: 3, end: 5}),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: "skinFaceRight_anim",
            frames: this.scene.anims.generateFrameNames("small_mario_skin", {start: 1, end: 1}),
            frameRate: 1,
            repeat: -1
        })
        this.scene.anims.create({
            key: "skinFaceLeft_anim",
            frames: this.scene.anims.generateFrameNames("small_mario_skin", {start: 11, end: 11}),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: "skinJumpRight_anim",
            frames: this.scene.anims.generateFrameNames("small_mario_skin", {start: 5, end: 5}),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: "skinJumpLeft_anim",
            frames: this.scene.anims.generateFrameNames("small_mario_skin", {start: 7, end: 7}),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: "skinDie_anim",
            frames: this.scene.anims.generateFrameNames("small_mario_skin", {start: 6, end: 6}),
            frameRate: 1,
            repeat: 1
        })


    }

    creatControls() {
        this.keys = {
            left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            // left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            // down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
            // right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            // up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA),   // ",键"
            fire: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),   // ",键"
        }

        // 攻击
        this.scene.input.on('pointerdown', this.handleFire, this)
        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.code === "Space")
                this.handleFire()
        })
    }

    handleFire() {
        // 判断是否能开火
        if (this.ability.fireball) {
            let fireball = new Fireball({
                scene: this.scene,
                x: this.x,
                y: this.y,
            })
            this.scene.playerAttackGroup.add(fireball)
            fireball.fire(this.x, this.y, this.direction !== 1)
        }
    }

    //  TODO 把砖块抽象成一个类
    // player 顶有硬币的砖块
    collidingWithbricksCoinGroup(player, brick) {
        if (brick.isCollided === true) {
            return
        }
        // player 顶 砖块
        if (player.body.touching.up && brick.body.touching.down) {
            // 藏有金币或者蘑菇的才设置
            brick.isCollided = true
            this.scene.tweens.add({
                targets: brick,
                // x: brick.x,
                y: brick.y - 8,
                callbackScope: this,
                duration: 100,  // 持续时间
                ease: 'Quintic',    // Phaser.Math. Easing
                yoyo: true,
                onComplete: function (tween) {
                    brick.anims.play("blockCollisioned_anim")
                },
            })
            let coin = new Coin({
                scene: this.scene,
                x: brick.x + 8,
                y: brick.y + 8 - 16,
            })
            coin.collidingBricksCoin()
        }
    }

    // player 顶普通砖块
    collidingWithbricksGroup(player, brick) {
        if (player.body.touching.up && brick.body.touching.down) {
            if (this.bigMode) {
                brick.destroy()
            } else {
                this.scene.tweens.add({
                    targets: brick,
                    y: brick.y - 8,
                    callbackScope: this,
                    duration: 100,  // 持续时间
                    ease: 'Quintic',    // Phaser.Math. Easing
                    yoyo: true,
                    onComplete: function (tween) {
                    },
                })
            }
        }
    }

    // player 顶有蘑菇或花的砖块
    collidingWithbricksFlowerOrMushroomGroup(player, brick) {
        if (brick.isCollided === true) {
            return
        }
        // player 顶 砖块
        if (player.body.touching.up && brick.body.touching.down) {
            // 藏有金币或者蘑菇的才设置
            brick.isCollided = true
            this.scene.tweens.add({
                targets: brick,
                // x: brick.x,
                y: brick.y - 8,
                callbackScope: this,
                duration: 100,  // 持续时间
                ease: 'Quintic',    // Phaser.Math. Easing
                yoyo: true,
                onComplete: function (tween) {
                    brick.anims.play("blockCollisioned_anim")
                },
            })
            let mushroomOrFlower
            if (this.currentModeIndex >= 2) {
                mushroomOrFlower = new Flower({
                    scene: this.scene,
                    x: brick.x + 8,
                    y: brick.y + 8 - 16,
                })
            } else {
                mushroomOrFlower = new Mushroom({
                    scene: this.scene,
                    x: brick.x + 8,
                    y: brick.y + 8 - 16,
                })
            }

            this.scene.mushroomOrFlowerGroup.add(mushroomOrFlower)
            mushroomOrFlower.collidingBricks()

        }
    }


    // player 死亡
    die() {

        //  没有判定,会重复执行动画
        if (!this.dieAnimPlaying) {
            this.dieAnimPlaying = true

            this.anims.play("die_anim")
            this.scene.cameras.main.stopFollow()
            // 死亡动画
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
                duration: 2000,
                onComplete: (tween) => {
                    if (this.life > 0) {

                        this.scene.restartGame()

                    } else {
                        //  生命用完,结束
                        this.scene.scene.start('gameOverScene', {
                            result: "lose",
                            score: this.scene.score,
                        })
                    }
                },
            })
            timeline.play()
            // 死亡动画   END
        }
    }

    getDamageHandler(from) {
        if (!this.alive) return
        // 掉坑
        if (from.type === "deadZone") {
            this.changeMode("die")
        }
        // 被 eneny 碰到
        else if (from.type === "enemy") {
            if (this.ability.invincible) {
                // 无敌

            } else if (this.ability.immune) {
                // 免疫
            } else {
                this.changeMode("downgrade")
                this.setImmune(1000)    // 降级之后给一定的免疫时间
            }
        }

    }

    // 用于设置一定时长的免疫,毫秒
    setImmune(duration) {
        this.ability.immune = true
        setTimeout(() => {
            this.ability.immune = false
        }, duration)
    }

}
