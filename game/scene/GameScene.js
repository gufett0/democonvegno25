"use client"

import PlayerSprite from "../object/Player"
import Enemy from "../object/Enemy"
import Goomba from "../object/Goomba"
import Koopa from "../object/Koopa"
import Coin from "../object/Coin"
import Mushroom from "../object/Mushroom"
import Flower from "../object/Flower"
import Brick from "../object/Brick"

import Button from "../object/Button"
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        })
        // 控制相机是跟随玩家还是用按键控制,把需要的模式放在最前面
        this.cameraMode = "follow" || "keyControl" || null

        this.level = {
            width: 3840,
            height: 624
        }

    }

    init(restartConfig) {
        if (JSON.stringify(restartConfig) === "{}") {
            // 默认配置
            this.gameConfig = {
                scene: {
                    score: 0,

                },
                player: {
                    life: 3

                }
            }
        } else {
            this.gameConfig = restartConfig
        }

    }


    create() {
        // 一些参数
        this.score = this.gameConfig.scene.score

        this.initRegister()
        this.createAnims()

        this.createLayer()

        //  世界的边界,不设置的话边界等于 game config 里的宽高
        this.physics.world.bounds.width = this.graphicLayer.width
        this.physics.world.bounds.height = this.graphicLayer.height

        // // 旧 Mario 地图
        // // 在(5,0),宽高为1的位置将tile 半透明(可用于设置暗门)
        // this.layer1.setTileLocationCallback(5, 0, 1, 1, (sprite, tile) => {
        //     tile.alpha = 0.25
        // })
        // this.physics.add.collider(this.player, this.layer1)  // player 与 layer 碰撞
        // // 旧 Mario 地图 END


        // 调试内容
        this.showDebug = true
        this.debugGraphics = this.add.graphics()
        // new Phaser.GameObjects.Graphics(this,{x:0, y:600}) //   无法使用???
        // this.debugGraphics.y = 600

        this.drawDebug()
        this.input.keyboard.on('keydown_U', (event) => {
            this.showDebug = !this.showDebug
            this.drawDebug()

            this.player.changeMode("downgrade")
        })
        this.input.keyboard.on('keydown_I', (event) => {
            this.player.changeMode("upgrade")
        })
        /**
         *  终点前高地   x: 3050,y: 40,
         *  第一管道   x: 465,y: 140,
         *  正常起点   x: 50,y: 175,
         *  管道 - 地底   x: 940,y: 415,
         *
         */
        // new player
        this.player = new PlayerSprite({
            scene: this,
            // x: 50, y: 175,
            x: 260, y: 110,

        }, this.gameConfig.player)

        this.player.setSize(480, 480);


        // camera 相关
        if (this.cameraMode === "follow") {
            this.cameras.main.setSize(700, 224)
            // 设置边界
            this.cameras.main.setBounds(0, 0, this.level.width, this.level.height)
            // 100 是摄像机垂直偏移,因为 startFollow 时如果跳跃就会让镜头也跟着晃动,
            // 设置为100使 player 偏向底部,同时摄像头有上边界,所以画面看起来不会移动
            this.cameras.main.startFollow(this.player, true, 1, 1, 0, 100)
        } else {
            this.cameras.main.setScroll(300, 0)
            //  camera 镜头按键控制
            let cursors = this.input.keyboard.createCursorKeys()
            let SmoothedKeyControlConfig = {
                camera: this.cameras.main,
                left: cursors.left,
                right: cursors.right,
                up: cursors.up,
                down: cursors.down,
                zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
                zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
                acceleration: 0.06,
                drag: 0.0005,
                maxSpeed: 1.0
            }
            let FixedKeyControlConfig = {
                camera: this.cameras.main,
                left: cursors.left,
                right: cursors.right,
                up: cursors.up,
                down: cursors.down,
                speed: 0.5
            }
            this.controls = new Phaser.Cameras.Controls.FixedKeyControl(FixedKeyControlConfig)
        }
        this.cameras.main.setBackgroundColor("#63adff") //x6888ff)


        /**
         *  滚动因子控制相机移动对此游戏对象的影响。
         *  当相机滚动时，它将改变在屏幕上呈现此游戏对象的位置。
         *  它不会更改游戏对象的实际位置值。
         *  值为1表示它将与摄像机完全同步移动。
         *  值为0表示即使相机移动也不会移动。
         *  但实际测试为0会随着镜头移动而移动,不论设置为0还是1 or 其他 文本的x,y都不改变
         */
        //this.scoreText = this.add.text(0, 0, "score : 0").setScrollFactor(0)
        this.scoreText = this.add.text(80, 4, "0").setScrollFactor(0)

        for(var i=0; i<this.player.life; i++){
            this.livesIcons = this.add.image(13*(i+1), 11, "heart").setScale(0.7).setScrollFactor(0)
        }

        for(var i=0; i<this.player.life; i++){
            this.livesIcons = this.add.image(13*(i+1), 11, "heart").setScale(0.7).setScrollFactor(0)
        }
        
        this.debugText = {
            //pointPosition: this.add.text(0, 50, "指针:").setScrollFactor(0),
            //playerLife: this.add.text(120, 0, "lives:").setScrollFactor(0)
        }

        // 事件的监听
        this.events.on('drawDebugEvent', function () {

            console.log("this.events.on('drawDebugEvent') 参数: " + arguments[0])
        }, this)

        //create crosshair(十字准线) which is controlled by player class
        // this.crosshair = {
        //     x: 0,
        //     y: 0,
        //     setPosition: function (x, y) {
        //         this.x = x
        //         this.y = y
        //     }
        // }
        this.crosshair = this.add.sprite(0, 0, "crosshair").setAlpha(0)

        //刷新 crosshair 的位置
        this.input.on('pointermove', (mouse) => {
            this.crosshair.setPosition(mouse.x + this.cameras.main.scrollX, mouse.y + this.cameras.main.scrollY)
        })

        this.createGroupFromObjects()
        // 创建碰撞
        this.createCollision()

    }

    update(time, delta) {

        if (this.cameraMode === "keyControl") {
            this.controls.update(delta)
        }

        this.player.update(time, delta)

        this.updateText()

    }

    createLayer() {
        // 带 object 的 mario 地图
        this.map = this.add.tilemap('level1')
        let tileset_level1 = this.map.addTilesetImage('tileset_levels')
        this.graphicLayer = this.map.createDynamicLayer('Graphic_Layer', tileset_level1, 0, 0)
        // this.graphicLayer = this.map.createStaticLayer('Graphic_Layer', tileset_level1, 0, 0)
        this.pipesAccessLevelLayer = this.map.createDynamicLayer('PipesAccessLevel', tileset_level1, 0, 0)
        this.pipesAccessLayer = this.map.createDynamicLayer('PipesAccess', tileset_level1, 0, 0)
        this.exitPipesLayer = this.map.createDynamicLayer('ExitPipes', tileset_level1, 0, 0)
        this.finishLevelLayer = this.map.createDynamicLayer('FinishLevel', tileset_level1, 0, 0)
    }

    // 为 graphicLayer 绘制颜色
    drawDebug() {
        this.debugGraphics.clear()
        if (this.showDebug) {
            setTimeout(() => {
                this.graphicLayer.renderDebug(this.debugGraphics, {
                    tileColor: null, // Non-colliding tiles
                    collidingTileColor: new Phaser.Display.Color(254, 209, 16, 100), // Colliding tiles
                    // faceColor:  new Phaser.Display.Color(0, 0, 255, 50), // Colliding face edges
                })
            }, 1)

        }
        this.events.emit('drawDebugEvent', 1, 2)
    }

    //  一些 HUD 文本
    updateText() {
        this.scoreText.setText(this.score)
        //this.debugText.pointPosition.setText("指针:" + ~~this.crosshair.x + "," + ~~this.crosshair.y)
        //this.debugText.playerLife.setText("lives:" + this.player.life)
        for(var i=0; i<this.player.life; i++){
            this.livesIcons = this.add.image(13*(i+1), 11, "heart").setScale(0.7).setScrollFactor(0)
        }

        let score = localStorage.getItem("sustainabilityScore")
        if(score){
            score = JSON.parse(score)
            if(score > 0){
                this.perkOne = this.add.image(160, 11, "perkOne").setScale(0.7).setScrollFactor(0)
                if(score > 1){
                    this.perkTwo = this.add.image(173, 11, "perkTwo").setScale(0.7).setScrollFactor(0)
                    if(score > 2){
                        this.perkThree = this.add.image(186, 11, "perkThree").setScale(0.7).setScrollFactor(0)
                    }
                }
            }
        }
    }

    // 创建动画
    createAnims() {
        this.anims.create({
            key: "randomBox_anim",
            frames: this.anims.generateFrameNumbers("randomBox", {start: 0, end: 2}),
            frameRate: 1,
            repeat: -1
        })
        this.anims.create({
            key: "brick_anim",
            frames: this.anims.generateFrameNumbers("brick", {start: 0, end: 0}),
            frameRate: 1,
            repeat: 1
        })
        this.anims.create({
            key: "blockCollisioned_anim",
            frames: this.anims.generateFrameNumbers("blockCollisioned", {start: 0, end: 0}),
            frameRate: 1,
            repeat: 1
        })
        // 蘑菇头
        this.anims.create({
            key: "goombaWalk_anim",
            frames: this.anims.generateFrameNumbers("goomba_red", {start: 0, end: 1}),
            frameRate: 4,
            repeat: -1
        })
        this.anims.create({
            key: "goombaDie_anim",
            frames: this.anims.generateFrameNumbers("goomba_red", {start: 2, end: 2}),
            frameRate: 1,
            repeat: 1
        })
        // 小王八
        this.anims.create({
            key: "koopaWalk_anim",
            frames: this.anims.generateFrameNumbers("koopa_green", {start: 0, end: 1}),
            frameRate: 4,
            repeat: -1
        })
        //  王八缩壳
        // this.anims.create({
        //     key: "koopaSquish_anim",
        //     frames: this.anims.generateFrameNumbers("koopa_green_squish", {start: 0, end: 0}),
        //     frameRate: 1,
        //     repeat: 1
        // })
        this.anims.create({
            key: "koopaSquish_anim",
            // 从 atlas 选择一个单独的 frame
            frames: [{
                frame: 'Enemies/Koopa/koopa green squish 2',
                key: 'atlas_object'
            }]
        })
        //  王八缩壳恢复
        this.anims.create({
            key: "koopaSquishRecover_anim",
            frames: this.anims.generateFrameNumbers("koopa_green_squish", {start: 0, end: 1}),
            frameRate: 6,
            repeat: 6
        })

        // 硬币旋转
        this.anims.create({
            key: "coinBlock_anim",
            frames: this.anims.generateFrameNumbers("coinBlock", {start: 0, end: 3}),
            frameRate: 4,
            repeat: -1
        })
        // 蘑菇🍄
        this.anims.create({
            key: "mushroom_anim",
            frames: this.anims.generateFrameNumbers("mushroom", {start: 0, end: 0}),
            frameRate: 1,
            repeat: 1
        })
        // 花✿
        this.anims.create({
            key: "flower_anim",
            frames: this.anims.generateFrameNumbers("flower", {start: 0, end: 3}),
            frameRate: 4,
            repeat: -1
        })

    }

    //  生成各种组(动态 sprite )
    createGroupFromObjects() {
        this.playerAttackGroup = this.add.group()
        this.playerAttackGroup.runChildUpdate = true
        this.enemiesGroup = this.add.group()
        this.enemiesGroup.runChildUpdate = true
        this.coinsGroup = this.add.group()
        this.coinsGroup.runChildUpdate = true
        this.mushroomOrFlowerGroup = this.add.group()
        this.mushroomOrFlowerGroup.runChildUpdate = true
        this.flowerGroup = this.add.group()
        this.flowerGroup.runChildUpdate = true


        // 砖块
        let bricksObjects = this.map.createFromObjects('Bricks', "bricks", {key: 'bricks'})
        // this.bricksGroup = this.add.group()
        this.bricksGroup = this.physics.add.staticGroup()
        this.bricksGroup.runChildUpdate = true
        this.objectsAddToGroup(bricksObjects, 'brick_anim', this.bricksGroup)


        // 各种尝试无法将 Brick 封装成一类
        // this.map.getObjectLayer('Bricks').objects.forEach((obj) => {
        //     let brick = new Brick(
        //         this,
        //         obj.x + 8,
        //         obj.y + 8,
        //         "brick"
        //     )
        //
        //     // this.bricksGroup.create(  obj.x + 8,
        //     //     obj.y + 8,
        //     //     "brick");
        // })


        // 生成敌人 Goombas
        this.map.getObjectLayer('Goombas').objects.forEach((obj) => {
            let goomba = new Goomba(
                this,
                obj.x + 8,
                obj.y + 8,
                "goomba_red"
            )
            goomba._scaleX=0.06
            goomba._scaleY=0.06
            this.enemiesGroup.add(goomba)
        })

        // 生成敌人 Koopa
        this.map.getObjectLayer('Koopas').objects.forEach((obj) => {
            let koopa = new Koopa(
                this,
                obj.x + 8,
                obj.y + 8,
                "koopa_green"
            )
            koopa.body.height = obj.height
            this.enemiesGroup.add(koopa)
        })

        //  死亡空间
        let deadZoneObjects = this.map.createFromObjects('DeadZones', "deadZones", {key: 'deadZones'})
        this.deadZoneGroup = this.physics.add.staticGroup()
        deadZoneObjects.forEach((val, idx) => {
            val.setOrigin(0)
            val.width = val.width * val._scaleX
            val.height = val.height * val._scaleY
            // 图块的原点在左下角,渲染在图上是从中心为起点,不调整会导致obj错位
            val.x = val.x - (val.width / 2)
            val.y = val.y + (val.height / 2)
            val.setScale(1)
            val.alpha = 0   // 设置为透明
            val.type = "deadZone"
            this.deadZoneGroup.add(val)
        })


        // 砖里有金币为 bricksCoin 有多个金币为 BricksCoins
        this.bricksCoinGroup = this.physics.add.staticGroup()
        let bricksCoinObjects = this.map.createFromObjects('BricksCoin', "bricksCoin", {key: 'bricksCoin'})
        this.objectsAddToGroup(bricksCoinObjects, 'randomBox_anim', this.bricksCoinGroup)

        // 地上的金币
        this.map.getObjectLayer('Coins').objects.forEach((obj) => {
            let coin = new Coin({
                scene: this,
                x: obj.x + 8,
                y: obj.y + 8,
            })
            this.coinsGroup.add(coin)
        })

        // 蘑菇或花的砖块
        this.bricksFlowerOrMushroomGroup = this.physics.add.staticGroup()
        let BricksFlowerOrMushroomObjects = this.map.createFromObjects('BricksFlowerOrMushroom', "bricksFlowerOrMushroom", {key: 'bricksFlowerOrMushroom'})
        this.objectsAddToGroup(BricksFlowerOrMushroomObjects, 'randomBox_anim', this.bricksFlowerOrMushroomGroup)

    }

    // 为 createGroupFromObjects() 服务
    objectsAddToGroup(objs, anim, group) {
        objs.forEach((val, idx) => {
            val.setOrigin(0)
            val.width = val.width * val._scaleX
            val.height = val.height * val._scaleY
            // 图块的原点在左下角,渲染在图上是从中心为起点,不调整会导致obj错位
            val.x = val.x - (val.width / 2)
            val.y = val.y + (val.height / 2)
            val.setScale(1)
            val.isCollided = false
            this.anims.play(anim, val)
            group.add(val)
        })
    }

    // 创建碰撞
    createCollision() {
        this.graphicLayer.setCollision([1, 34, 67, 69, 265, 266, 267, 268, 269, 298, 299, 300, 301, 301, 302])
        this.pipesAccessLayer.setCollision([265, 266])
        this.exitPipesLayer.setCollision([267, 300])
        this.finishLevelLayer.setCollision([281, 314])

        this.physics.add.collider(this.player, this.graphicLayer)
        // 进管道
        this.physics.add.collider(this.player, this.pipesAccessLayer, (player, tile) => {
            // blocked 此物体是否与瓷砖或世界边界相撞
            if (player.body.blocked.down && this.player.keys.down.isDown) {
                if (this.cameraMode === "follow") {
                    // 100 是摄像机垂直偏移,因为 startFollow 时如果跳跃就会让镜头也跟着晃动,
                    // 设置为100使 player 偏向底部,同时摄像头有上边界,所以画面看起来不会移动
                    this.cameras.main.startFollow(this.player, true, 1, 1, 0, -100)
                }
                this.player.setPosition(935, 425)

            }

        })
        // 出管道
        this.physics.add.collider(this.player, this.exitPipesLayer, (player, tile) => {
            // blocked 此物体是否与瓷砖或世界边界相撞
            if (player.body.blocked.right && this.player.keys.right.isDown) {
                if (this.cameraMode === "follow") {
                    // 100 是摄像机垂直偏移,因为 startFollow 时如果跳跃就会让镜头也跟着晃动,
                    // 设置为100使 player 偏向底部,同时摄像头有上边界,所以画面看起来不会移动
                    this.cameras.main.startFollow(this.player, true, 1, 1, 0, 100)
                }
                this.player.setPosition(2640, 143)
            }

        })
        // 进出管道 END

        //  过关
        this.physics.add.collider(this.player, this.finishLevelLayer, (player, tile) => {
            // blocked 此物体是否与瓷砖或世界边界相撞
            if (player.body.blocked.right || player.body.blocked.left) {
                this.end("win")
            }
        })

        //  捡金币
        this.physics.add.collider(this.player, this.coinsGroup, (player, coin) => {
            coin.collidingWithPlayer()
        })
        // player 顶有硬币的砖块
        this.physics.add.collider(this.player, this.bricksCoinGroup, (player, brick) => {
            player.collidingWithbricksCoinGroup(player, brick)
        })
        // player 顶有蘑菇或花的砖块
        this.physics.add.collider(this.player, this.bricksFlowerOrMushroomGroup, (player, brick) => {
            player.collidingWithbricksFlowerOrMushroomGroup(player, brick)
        })
        // player 顶普通砖块
        this.physics.add.collider(this.player, this.bricksGroup, (player, brick) => {
            player.collidingWithbricksGroup(player, brick)
        })
        // fireball 打墙
        this.physics.add.collider(this.playerAttackGroup, this.graphicLayer, (fireball, tile) => {
            fireball.collided()
            // this.graphicLayer.removeTileAt(tile.x, tile.y)  // 破坏地形
        })
        this.physics.add.collider(this.playerAttackGroup, this.enemiesGroup, (fireball, enemy) => {
            fireball.explode()
            enemy.collidingWithFireball()
        })
        this.physics.add.overlap(this.player, this.enemiesGroup, (player, enemy) => {
            enemy.collidingWithPlayer()
        })

        // player 掉坑里
        this.physics.add.collider(this.player, this.deadZoneGroup, (player, deadZone) => {
            player.eventEmitter.emit('getDamage', deadZone);

        })
        // enemy 掉坑里
        this.physics.add.overlap(this.enemiesGroup, this.deadZoneGroup, (enemy, deadZone) => {
            enemy.fallInDeadZone()
        })
        // enemy 需要和砖块碰撞
        this.physics.add.collider(this.enemiesGroup, this.bricksGroup, () => {
        })

        // 蘑菇和砖块需要碰撞
        this.physics.add.collider(this.mushroomOrFlowerGroup, this.bricksGroup, () => {
        })
        // player 吃蘑菇
        this.physics.add.overlap(this.player, this.mushroomOrFlowerGroup, (player, mushroom) => {
            mushroom.collidingWithPlayer(player, mushroom)
        })
    }

    // 结束
    end(type) {
        if (type === 'restart') {
            this.scene.restart()
        } else if (type === 'lose') {
            this.cameras.main.fade(1000, 16.5, 2.0, 1.2)
            this.events.emit('gameOver')
            this.time.addEvent({
                delay: 1000,
                callbackScope: this,
                callback: () => {
                    this.scene.start('gameOverScene', 'lose')
                },

            })
        } else if (type === 'win') {
            this.cameras.main.fade(1000, 16.5, 2.0, 1.2)
            this.events.emit('gameOver')
            this.time.addEvent({
                delay: 1000,
                callbackScope: this,
                callback: () => {
                    this.scene.start('gameOverScene', 'win')
                },
            })
        }
    }

    // registry 类似全局变量
    initRegister() {
        this.registry.set('coins_max', "coins_max")
        // this.registry.get('coins_max')
    }

    // 重启游戏(当前scene)
    restartGame() {
        // 重启需要使用的参数,场景 player 等
        let restartConfig = {
            scene: {
                score: this.score,

            },
            player: {
                life: this.player.life

            }
        }

        this.scene.start('GameScene', restartConfig)

    }
}

