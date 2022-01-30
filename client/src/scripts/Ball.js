
import Mobile from './Mobile.js';

// default values for a Ball : image and shifts
const BALL_IMAGE_SRC = './images/balle24.png';
const SHIFT_X = 2;
const SHIFT_Y = 2;

/**
 * a Ball is a mobile with a ball as image and that bounces in a Game (inside the game's canvas)
 */
export default class Ball extends Mobile {

    /**  build a ball
     *
     * @param  {number} x       the x coordinate
     * @param  {number} y       the y coordinate
     * @param  {Game} theGame   the Game this ball belongs to
     */
    constructor(x, y, theGame, Obstacle, Obstacle2) {
        super(x, y, BALL_IMAGE_SRC , SHIFT_X, SHIFT_Y);
        this.theGame = theGame;
        this.Obstacle = Obstacle;
        this.Obstacle2 = Obstacle2;
        this.winHost = 0;
        this.winAdverse = 0;

    }

    angle(n, coordXBall, coordYBall, coordYPaddle, coordXpaddle){
        let pas = Math.floor(((this.Obstacle.height)/2) / n);
        let milieu = Math.floor(this.Obstacle.height / 2);
        let dessus =   {};
        let dessous = {};
        let i = 0;
        let j = 0;
        let res;
        while(i < milieu){
            dessus['shiftY'+ j.toString()] = [milieu - i+coordYPaddle,-j];
            dessous['shiftY'+ j.toString()] = [milieu + i + coordYPaddle, j];
            i = i + pas;
            j = j + 1;
        }
        j--;
        console.log(coordYBall);
        console.log(`coordYBall = ${coordYPaddle}`);
        console.log(dessus);
        console.log(dessous);
        let k = 0;
        while (k < j){
            console.log('dessus');
            let str = 'shiftY' + k.toString();
            console.log(`dessus[shiftY + (k+1).toString()] = ${dessus['shiftY' + (k+1).toString()][0]} et coordYBall = ${coordYBall} et  ${dessus['shiftY'+ (k+1).toString()][1] <= coordYBall  && coordYBall < dessus[str][0]}`);
            if (dessus['shiftY' + (k+1).toString()][0] <= coordYBall && coordYBall < dessus[str][0]){
                res = {'shiftX': 7 - Math.abs(dessus[str][1]), 'shiftY' : dessus[str][1]}
            }
            k++;
        }
        k = 0;
        while (k < j){
            console.log('dessous');
            let str = 'shiftY' + k.toString();
            console.log(`dessous[shiftY + (k+1).toString()] = ${dessous['shiftY' + (k+1).toString()][0]} et coordYBall = ${coordYBall} et  ${dessous['shiftY'+ (k+1).toString()][1] <= coordYBall && coordYBall < dessous[str][0]}`);
            if (dessous[str][0] <= coordYBall && coordYBall < dessous['shiftY' + (k+1).toString()][0]){
                res= {'shiftX': 7 - Math.abs(dessous[str][1]), 'shiftY' : dessous[str][1]}
            }
            k++;
        }


        return res;
    }


    /**
     * when moving a ball bounces inside the limit of its game's canvas
     */
    move() {
        //console.log(this.shiftX);
        this.winHost = 0;
        this.winAdverse = 0;
        if (this.collisionWith(this.Obstacle)) {
            let res = this.angle(5, 7, this.y, this.Obstacle.y);
            if (res == undefined){
                res = {
                    'shiftX' : -this.shiftX,
                    'shiftY' : -this.shiftY
                }
            }
            this.shiftY = res.shiftY;    // rebond en haut ou en bas
            this.shiftX = res.shiftX;    // rebond en gauche ou à droite
            this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);
        }
        else if (this.collisionWith(this.Obstacle2)){
            let res ;
            let res2 = this.angle(5,7,this.y, this.Obstacle2.y);
            console.log(res2);
            //console.log(`shiftX = ${res2.shiftX} et shiftY = ${res2.shiftY}`);
            if (res2 == undefined){
                res2 = {
                    'shiftX' : this.shiftX,
                    'shiftY' : this.shiftY
                }
            }
            this.shiftY = -res2.shiftY;
            this.shiftX = -res2.shiftX;
            /*this.shiftY = res.shiftY;
            this.shiftX = res.shiftX;*/

            this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);
        }

        else if (this.y <= 0 || (this.y+this.height >= this.theGame.canvas.height/*this.Obstacle.height*/ )) {
            this.shiftY = - this.shiftY;    // rebond en haut ou en bas
            //this.stopMoving();
        }
        else if (this.x <= 0 || this.x + this.width >= this.theGame.canvas.width/*this.Obstacle.width*/) {
            this.shiftX = - this.shiftX;    // rebond à gauche ou à droite
        }
        else if( this.x + this.width < this.Obstacle.x + this.Obstacle.width){
            this.winAdverse = 1;

            this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);
        }
        else if( this.x  +this.width > this.Obstacle2.x + this.Obstacle2.width){
            this.winHost = 1;
            this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);
        }
        super.move();
    }


    winOfSocket(){
        if (this.winHost == 1) {
            this.theGame.socket.emit('scoreDroite', this.theGame.player);
        }
        else if (this.winAdverse == 1){
            this.theGame.socket.emit('scoreGauche', this.theGame.player);
        }
        this.winAdverse = 0; 
        this.winHost = 0;
    }

    collisionWith(Obstacle) {
        const x1 = Obstacle.x;
        const y1 = Obstacle.y;
        const x1_1 = this.x;
        const y1_1 = this.y;
        const xP1 = Math.max(x1, x1_1);
        const yP1 = Math.max(y1, y1_1);
        const x2 = x1 + Obstacle.width;
        const y2 = y1 + Obstacle.height;
        const x2_1 = x1_1 + this.width;
        const y2_1 = y1_1 + this.width;
        const xP2 = Math.min(x2, x2_1);
        const yP2 = Math.min(y2, y2_1);
        //console.log(xP1 <= xP2 && yP1 <= yP2);
        return xP1 <= xP2 && yP1 <= yP2;
    }
}
