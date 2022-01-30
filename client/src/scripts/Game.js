import Ball from './Ball.js';
import Paddle from './Paddle.js'
import pauseImgPath from "../images/Game-is-paused.png";
/**
 * a Game animates a ball bouncing in a canvas
 */
export default class Game {

    /**
     * build a Game
     *
     * @param  {Canvas} canvas the canvas of the game
     */
    #paddle;
    #paddle2;
    #player;
    #socket;
    constructor(canvas) {
        this.raf = null;
        this.canvas = canvas;
        this.ctxt = this.canvas.getContext("2d");
        this.#paddle = new Paddle(8, this.canvas.height/2 - 10);
        this.#paddle2 = new Paddle(this.canvas.width - 50, this.canvas.height/2 - 10);
        this.#socket = io();
        this.ball = new Ball(this.canvas.width/2, this.canvas.height/2, this, this.#paddle , this.#paddle2);
        this.#player = {
            paddle : null,
            host : '',
            roomId : null,
            socketId : '',
            win : false,
            score : 0

        }
        this.pauseImage = this.createImage(pauseImgPath);
        this.receiveKey();
    }
   /**
    * Cette méthode permet de créer une image 
    * correspondant à la source imagePath
    */
    createImage(imagePath) {
        const menuImg = new Image();
        menuImg.width = 650;
        menuImg.src = imagePath;
        return menuImg;
    }
    /**
     *Cette méthode permet de d'accéder à l'attribut privé player
     */
    get player(){
        return this.#player;

    }

    set player (newPlayer){
        this.#player = newPlayer;
    }

    get paddle(){
        return this.#paddle
    }

    get paddle2(){
        return this.#paddle2;
    }
    get socket() {
        return this.#socket;
    }
    /** start this game animation */
    start() {
        this.animate();
    }
    /** stop this game animation */
    stop() {
        window.cancelAnimationFrame(this.raf);
        this.ctxt.drawImage(this.pauseImage, 50, 50);

    }
    keyDownActionHandler(event) {
        switch (event.key) {
            case "ArrowLeft":
            case "Left":
                this.player.paddle.moveLeft();
                this.#socket.emit('left', this.player.paddle, this.player);
                break;
            case "ArrowRight":
            case "Right":
                this.player.paddle.moveRight();
                this.#socket.emit('right', this.player.paddle, this.player);
                break;
            case "ArrowUp":
            case "Up":
                this.player.paddle.moveUp();
                this.#socket.emit('up', this.player.paddle, this.player);

                break;
            case "ArrowDown":
            case "Down":
                this.player.paddle.moveDown();
                this.#socket.emit('down', this.player.paddle, this.player);
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    choicePaddle(){
        if (this.player.paddle === this.paddle2){
            return this.paddle;
        }
        return this.paddle2;
    }
    receiveKey(){
        let pad = this.choicePaddle();
        this.#socket.on('Ball', (ballX, ballY, shiftX, shiftY) => {
            this.ball.shiftX = -shiftX;
            this.ball.shiftY = shiftY;
        });
        this.#socket.on('Left', (p, paddle) => {
            this.paddle2.moveRight();
        }
        );
        this.#socket.on('Right', (p, paddle) => {
            this.paddle2.moveLeft();
        }
        );
        this.#socket.on('Up', (p, paddle) => {
            this.paddle2.y = paddle.y
            console.log(this.paddle2.y === paddle.y);
            this.paddle2.moveUp();
        }
        );
        this.#socket.on('Down', (p, paddle) => {
            this.paddle2.y = paddle.y;
            this.paddle2.moveDown();
        }
        );
        this.#socket.on('Stop', () => {
            this.paddle2.stopMoving();
        }
        );

    }
    keyUpActionHandler(event) {
        switch (event.key) {
            case "ArrowDown":
            case "Down":
            case "ArrowLeft":
            case "Left":
            case "ArrowRight":
            case "Right":
            case "ArrowUp":
            case "Up":
                this.player.paddle.stopMoving();
                this.#socket.emit('stop');
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    /** animate the game : move and draw */
    animate() {
        this.moveAndDraw();
        this.raf = window.requestAnimationFrame(this.animate.bind(this));
    }
    /** move then draw the bouncing ball */
    moveAndDraw() {
        this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw and move the ball
        this.ball.move();
        this.ball.winOfSocket();
        this.paddle2.draw(this.ctxt);
        this.paddle.draw(this.ctxt);
        this.player.paddle.move(this.canvas);
        this.paddle2.move(this.canvas);

        this.ball.draw(this.ctxt);

    }}
