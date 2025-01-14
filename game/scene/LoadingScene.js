import Phaser from "phaser";

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'LoadingScene',
            pack: {
                files: [
                    {type: 'image', key: 'loadingbar_bg', url: 'resource/image/loadingbar_bg.png'},
                    {type: 'image', key: 'loadingbar_fill', url: 'resource/image/loadingbar_fill.png'},
                    {type: 'image', key: 'sky', url: 'resource/image/sky.png'},
                ]
            },
        })
    }

    preload() {
        // 这个 scene preload 的资源可以在下一 scene 使用
        // 添加图片
        this.load.image('fire', '../resource/image/fire.png')
        this.load.image('background', '../resource/image/bg_2.jpg')
        this.load.image('gamelogo', '../resource/image/gamelogo.png')

        this.load.image('sky', '../resource/image/sky.png')
        this.load.image('ground', '../resource/image/platform.png')
        this.load.image('star', '../resource/image/star.png')
        this.load.image('bomb', '../resource/image/bomb.png')
        this.load.image('boom_small', '../resource/image/boom_small.png')
        this.load.image('logo', 'resource/image/gamelogo.png');
        // this.load.image('sky', 'resource/image/sky.png');

        // 添加人物
        this.load.spritesheet('dude',
            '../resource/image/dude.png',
            {frameWidth: 32, frameHeight: 48}
        )
        this.load.spritesheet('link',
            '../resource/image/link.png',
            {frameWidth: 32, frameHeight: 32}
        )
        this.load.atlas('sprites', 'resource/image/spritearray.png', 'resource/image/spritearray.json');

        // 添加加载背景
        this.add.image(0,0,"sky").setOrigin(0,0)
        // 文件加载信息
        let width = this.cameras.main.width
        let height = this.cameras.main.height
        this.assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        })
        this.assetText.setOrigin(0.5, 0.5)

        // 使用图片进度条
        this.loadingbar_bg = this.add.sprite(400, 300, "loadingbar_bg");
        this.loadingbar_fill = this.add.sprite(400, 300, "loadingbar_fill");
        this.setPreloadSprite(this.loadingbar_fill);
        // 创建进度条 END
        this.load.on('complete', () => {
            // loadingText.destroy()
            // percentText.destroy()
            // assetText.destroy()
        })

    }

    create() {
        // 创建翻转硬币的动画
        this.anims.create({
            key: 'cointurn',
            frames: [
                {key: 'sprites', frame: 'coin1'},
                {key: 'sprites', frame: 'coin2'},
                {key: 'sprites', frame: 'coin3'},
                {key: 'sprites', frame: 'coin4'},
                {key: 'sprites', frame: 'coin5'},
                {key: 'sprites', frame: 'coin6'},
                {key: 'sprites', frame: 'coin7'},
                {key: 'sprites', frame: 'coin8'}
            ],
            frameRate: 15,
            repeat: -1
        })

        setTimeout(() => {
            this.scene.start('gameScene', {
                level: 3,
                difficult: "easy",
            })
        }, 1000)

    }

    setPreloadSprite(sprite) {
        this.preloadSprite = {sprite: sprite, width: sprite.width, height: sprite.height};

        //sprite.crop(this.preloadSprite.rect);
        sprite.visible = true;

        // set callback for loading progress updates
        this.load.on('progress', this.onProgress, this);
        this.load.on('fileprogress', this.onFileProgress, this);
    }

    onProgress(value) {
        if (this.preloadSprite) {
            // calculate width based on value=0.0 .. 1.0
            var w = Math.floor(this.preloadSprite.width * value);

            // set width of sprite
            this.preloadSprite.sprite.frame.width = w;
            this.preloadSprite.sprite.frame.cutWidth = w;

            // update screen
            this.preloadSprite.sprite.frame.updateUVs();
        }
    }

    onFileProgress(file) {
        // debugger
        this.assetText.setText('正在加载: ' + file.src);
    }


}