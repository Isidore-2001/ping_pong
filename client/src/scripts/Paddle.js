import MoveState from './movestate.js'
import Mobile from "./Mobile.js";
const PaddleImgSrc = './images/paddle.png';

export default class Paddle extends Mobile {
    constructor(x, y) {
        super(x, y, PaddleImgSrc, 0, 0);
        this._moving = MoveState.NONE;
    }

    /**
     * Cette méthode permet de savoir si le vaisseau est
     * en haut ou en bas
     * @returns un booleen
     */
    up() {
        return this._moving === MoveState.UP;
    }

    
    /**
     * Cette méthode permet de savoir si le vaisseau est
     * en haut ou en bas
     * @returns un booleen
     */
    down() {
        return this._moving === MoveState.DOWN;
    }

    stopMoving(){
        return this._moving = MoveState.NONE;
    }

    /**
     *
     *
     */

    moveUp() {
        this.shiftY = -10;
        this._moving = MoveState.UP;
    }

    /**
     *
     *
     */
    moveDown() {
        this.shiftY = +10;
        this._moving = MoveState.DOWN;
    }

    moveRight() {
        this.shiftX = +10;
        this._moving = MoveState.RIGHT;
    }

    moveLeft() {
        this.shiftX = -10;
        this._moving = MoveState.LEFT;
    }


    move(canvas) {
        //console.log(this._moving);
        if (this._moving === MoveState.UP) {
            this.y = Math.max(0, this.y + this.shiftY);
        }

        if (this._moving === MoveState.DOWN) {
            this.y = Math.min(canvas.height - this.height, this.y + this.shiftY);
        }
        if (this._moving === MoveState.RIGHT) {
            this.x = Math.min(canvas.width - this.width, this.x + this.shiftX);
        }

        if (this._moving === MoveState.LEFT) {
            this.x = Math.max(0, this.x + this.shiftX);
        }



    }

    stopMoving() {
        this._moving = MoveState.NONE;
    }
}
