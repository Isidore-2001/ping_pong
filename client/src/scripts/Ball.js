
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

    angle(n, paddle){
        const pas = paddle.height/(2*n);
        const milieu_ball = this.y < paddle.y ? this.y + this.height : this.y;
        let debut = -n;
        let paddle_debut = paddle.y;
        let ens = new Map()
        let j = 0;
        while(j <= 2*n){
            ens.set(paddle_debut, debut);
            paddle_debut+=pas;
            debut+=1;
            j++;
        }
        let tableau = Array.from(ens);
        let i = 0;
        while(i < tableau.length-1){
            if (tableau[i][0] < milieu_ball && milieu_ball < tableau[i+1][0]){
            let y = tableau[i + 1][1]
                return {'shiftX' : y > 0 ? 7 - y : 7 - Math.abs(y), 'shiftY' : y}
            }
        i++;
        }
        if(milieu_ball >= tableau[i][0]){
                let y = tableau[i][1]
                return {'shiftX' : y > 0 ? 7 - y : 7 - Math.abs(y), 'shiftY' : y}
         }
        if(milieu_ball <= tableau[0][0]){
                let y = tableau[0][1]
                return {'shiftX' : y > 0 ? 7 - y : 7 - Math.abs(y), 'shiftY' : y}}
    }

    /**
     * when moving a ball bounces inside the limit of its game's canvas
     */
    move() {
        this.winHost = 0;
        this.winAdverse = 0;
        if (this.x + this.width == this.theGame.canvas.width / 2 ) {
            this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);
        }
        if (this.collisionWith(this.Obstacle)) {
                let res = this.angle(5, this.Obstacle);
                this.shiftY = res.shiftY;    // rebond en haut ou en bas
                this.shiftX = res.shiftX;    // rebond en gauche ou à droite
            this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);
        }
        else if (this.collisionWith(this.Obstacle2)){
                let res2 = this.angle(5, this.Obstacle2);
                this.shiftY = -res2.shiftY;
                this.shiftX = -res2.shiftX;

            this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY); // Permettre la synchronisation de la balle 
        }

        else if (this.y <= 0 || (this.y+this.height >= this.theGame.canvas.height/*this.Obstacle.height*/ )) {
            this.shiftY = - this.shiftY;    // rebond en haut ou en bas
            //this.stopMoving();
        }
        else if (this.x <= 0 || this.x + this.width >= this.theGame.canvas.width/*this.Obstacle.width*/) {
            this.shiftX = - this.shiftX;    // rebond à gauche ou à droite
        }
        else if( this.x + this.width < this.Obstacle.x + this.Obstacle.width){
            this.winAdverse = 1;// Score pour l'adversaire 
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
    /**
     * collision avec le paramètre Obstacle
     * @param Obstacle 
     */
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
        const y2_1 = y1_1 + this.height;
        const xP2 = Math.min(x2, x2_1);
        const yP2 = Math.min(y2, y2_1);
        //console.log(xP1 <= xP2 && yP1 <= yP2);
        return xP1 <= xP2 && yP1 <= yP2;
    }
}
