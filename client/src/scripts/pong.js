//'use strict';
import Game from './Game.js';
import {generate_message} from  './message.js';
/**
 * Le code conçernant le template de messagerie 
 *
 */
const theField = document.getElementById("field");
let started = false;
const Start = document.getElementById("controls");
const theGame = new Game(theField);
const init = (ev) => {
    document.getElementById('start').addEventListener("click",  joinRoom);
    //joinRoom();
}
window.addEventListener("load",init);
const  joinRoom = () => {
    theGame.player.socketId =  theGame.socket.id;
    theGame.socket.emit('start', theGame.player);
}

/*theGame.socket.on('newMessage', (msg) => {
    generate_message(msg, 'user');
});*/

const restart_game = () => {

    theGame.player.score = 0;
    theGame.ball.x = theGame.ball.initialX;
    theGame.ball.y = theGame.ball.initialY;
    theGame.paddle.x = theGame.paddle.initialX;
    theGame.paddle.y = theGame.paddle.initialY;
    theGame.paddle2.x = theGame.paddle2.initialX;
    theGame.paddle2.y = theGame.paddle2.initialY;
    document.getElementById('scoreHost').innerHTML = theGame.player.score;
    document.getElementById('scoreAdversaire').innerHTML = 0;
    theGame.moveAndDraw();
}

theGame.socket.on('restartGame', () => {
    restart_game();
    document.getElementById('scoreHost').innerHTML = 0;
})

/**
 * Déconnexion d'un joueur 
 * cet evenement permet de relancer le jeu 
 */
theGame.socket.on('deconnected', (lenOfplayer) => {
    started = true; 
    theGame.pause = false;
    startGame(theGame);
    /**
     * Permettre au second joueur de devenir le premier joueur 
     * si le premier joueur se déconnecte 
     */
    if (lenOfplayer < 2){
        document.getElementById('typeplayer').innerHTML = "Vous êtes le premier joueur";
        theGame.player.host = true;
    };

    document.getElementById('start').removeEventListener('click', startedGame);
}); 


theGame.socket.on('dataset init', (id) => {
    theGame.player.roomId = id;
    theGame.socket.emit('start', theGame.player);
})

/**
 * Cette partie s'occupe du score de gauche du joueur 
 * @param le joueur 
 */ 
theGame.socket.on('scoreGauche', (player) => {
    theGame.ball.x = theGame.ball.initialX;
    theGame.ball.y = theGame.ball.initialY;
    theGame.paddle.x = theGame.paddle.initialX;
    theGame.paddle.y = theGame.paddle.initialY;
    theGame.paddle2.x = theGame.paddle2.initialX;
    theGame.paddle2.y = theGame.paddle2.initialY;
    theGame.moveAndDraw();
    started = true;
    theGame.pause = true;
    startGame(theGame);
    if (player.socketId == theGame.socket.id){
        theGame.player.score = player.score
        document.getElementById('scoreHost').innerHTML = theGame.player.score;
    }else{
        document.getElementById('scoreAdversaire').innerHTML = player.score;
    }
})
/**
 * Cette partie s'occupe du score de droite du joueur 
 * @param player le joueur 
 */
theGame.socket.on('scoreDroite', (player) => {
    theGame.ball.x = theGame.ball.initialX;
    theGame.ball.y = theGame.ball.initialY;
    theGame.paddle.x = theGame.paddle.initialX;
    theGame.paddle.y = theGame.paddle.initialY;
    theGame.paddle2.x = theGame.paddle2.initialX;
    theGame.paddle2.y = theGame.paddle2.initialY;
    theGame.moveAndDraw();
    started = true;
    theGame.pause = true;
    startGame(theGame);
    if (player.socketId == theGame.socket.id){
        theGame.player.score = player.score
        document.getElementById('scoreHost').innerHTML = theGame.player.score;
    }else{
        document.getElementById('scoreAdversaire').innerHTML = player.score;
    }
})


const startedGame = () => {
    let res = startGame(theGame);
    theGame.pause = res;
    theGame.socket.emit('playGame', res);
}

/**
 *L'evenement permettant de démarrer le jeu 
 */
theGame.socket.on('startGame', () =>{
    document.getElementById('start').removeEventListener('click', joinRoom);
    restart_game();
    started = false;

    if (theGame.player.host){
        document.getElementById('start').addEventListener('click', startedGame);
    }
}
)
window.addEventListener("keydown", (event) => 
    {
        if (theGame.player.host){
            {
                switch (event.key) {
                    case "Escape":
                        startedGame();
                        break;
                    default:

                }
            }
        }
    })



/** start and stop a game
 * @param {Game} theGame - the game to start and stop
 */

const startGame = theGame => {
    if (!started) {
        theGame.start();
        document.getElementById('start').src = 'images/Stop.png';
        window.addEventListener(
            "keydown",
            theGame.keyDownActionHandler.bind(theGame)
        );
        window.addEventListener(
            "keyup",
            theGame.keyUpActionHandler.bind(theGame)
        );

    }
    else {
        document.getElementById('start').src = 'images/Start.png';
        document.getElementById('start').value = 'Jouer';
        theGame.stop();

    }
    started = ! started;
    theGame.socket.emit('ball', theGame.ball.x, theGame.ball.y, theGame.ball.shiftX, theGame.ball.shiftY);
    return started;
};
theGame.socket.on('Play', (newStarted) => {
    theGame.pause = !newStarted;
    startGame(theGame);
})
