import Enemy from "./Enemy"

export default class Goomba extends Enemy {

    //  这货是蘑菇头🍄
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        // this.setFrame('slime');
        this.anims.play("goombaWalk_anim")

    }

    collidingWithPlayer() {
        // player 踩到 this
        if (this.body.touching.up && this.scene.player.body.touching.down) {
            this.dieSetting()
            this.scene.score += 20
            this.anims.play("goombaDie_anim")
        }
        // 不是踩死,普通碰撞
        else {
            if (this.alive)
                this.scene.player.eventEmitter.emit('getDamage', this);
        }
    }


}
