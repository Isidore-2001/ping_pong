//'use strict';
import Game from './Game.js';
const theField = document.getElementById("field");
let started = false;
const Start = document.getElementById("controls");
const theGame = new Game(theField);
const init = (ev) => {
    document.getElementById('start').addEventListener("click",  joinRoom);
    //joinRoom();
}
/**
 * Le code conçernant le template de messagerie 
 *
 */
var INDEX = 0; 
function generate_message(msg, type) {
    INDEX++;
    var str="";
    str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
    str += "          <span class=\"msg-avatar\">";
    //str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
    str +=       "<img src=\"https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg\" />"
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-"+INDEX).hide().fadeIn(300);
    if(type == 'self'){
        $("#chat-input").val(''); 
    }    
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
}  

$(function() {
    $("#chat-submit").click(function(e) {
        e.preventDefault();
        var msg = $("#chat-input").val(); 
        if(msg.trim() == ''){
            return false;
        }
        generate_message(msg, 'self');
        theGame.socket.emit('message', msg);
        var buttons = [
            {
                name: 'Existing User',
                value: 'existing'
            },
            {
                name: 'New User',
                value: 'new'
            }
        ];
    })

    function generate_button_message(msg, buttons){    
        INDEX++;
        var btn_obj = buttons.map(function(button) {
            return  "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\""+button.value+"\">"+button.name+"<\/a><\/li>";
        }).join('');
        var str="";
        str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg user\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "          <div class=\"cm-msg-button\">";
        str += "            <ul>";   
        str += btn_obj;
        str += "            <\/ul>";
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-"+INDEX).hide().fadeIn(300);   
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
        $("#chat-input").attr("disabled", true);
    }

    $(document).delegate(".chat-btn", "click", function() {
        var value = $(this).attr("chat-value");
        var name = $(this).html();
        $("#chat-input").attr("disabled", false);
        generate_message(name, 'self');
    })

    $("#chat-circle").click(function() {    
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-toggle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

})



window.addEventListener("load",init);
const  joinRoom = () => {
    theGame.player.socketId =  theGame.socket.id;
    console.log(theGame.player.socketId);
    theGame.socket.emit('start', theGame.player);
}

theGame.socket.on('newMessage', (msg) => {
    console.log('messagerie');
        generate_message(msg, 'user');
}
);
theGame.socket.on('dataset init', (id) => {
    console.log("ok");
    theGame.player.roomId = id;
    theGame.socket.emit('start', theGame.player);
})
theGame.socket.on('join room', (data, owner, dataPlayer) => {
    console.log("On est ici");
    theGame.player.roomId = data;
    if (owner && dataPlayer.socketId === theGame.socket.id){
        theGame.player.paddle = theGame.paddle;
        theGame.player.host = true;

        document.getElementById('typeplayer').innerHTML = "Vous êtes le premier joueur";
    }else{
        theGame.player.paddle = theGame.paddle;
        theGame.player.host = false;
        console.log(theGame.player);
        theGame.player.socketId = theGame.socket.id;
        document.getElementById('typeplayer').innerHTML = "Vous êtes le second joueur";
    }
    dataPlayer = theGame.player;
    theGame.socket.emit('player', theGame.player);
    console.log(dataPlayer);
    console.log('playGame')

}
)
theGame.socket.on('connexionRefuse', () => {
    theGame.socket.emit('connexionR');
    document.getElementById('typeplayer').classList.remove('bg-success');
    document.getElementById('typeplayer').classList.add('bg-danger');
    document.getElementById('typeplayer').innerHTML = "Connexion refusé";})
theGame.socket.on('scoreDroite', (player) => {
    theGame.ball.x = theGame.ball.initialX;
    theGame.ball.y = theGame.ball.initialY;
    theGame.moveAndDraw();
    //startGame(theGame);
    started = true;
    startGame(theGame);
    console.log(player.score);
    if (player.socketId == theGame.socket.id){
        theGame.player.score = player.score
        document.getElementById('scoreHost').innerHTML = theGame.player.score;
    }else{
        document.getElementById('scoreAdversaire').innerHTML = player.score;
    }
})
theGame.socket.on('scoreGauche', (player) => {
    theGame.ball.x = theGame.ball.initialX;
    theGame.ball.y = theGame.ball.initialY;
    theGame.moveAndDraw();
    //theGame.stop();
    started = true;
    startGame(theGame);
    console.log(player.score);
    if (player.socketId == theGame.socket.id){
        theGame.player.score = player.score
        document.getElementById('scoreHost').innerHTML = theGame.player.score;
    }else{
        document.getElementById('scoreAdversaire').innerHTML = player.score;
    }
})

theGame.socket.on('startGame', () =>{
    document.getElementById('start').removeEventListener('click', joinRoom);
    if (theGame.player.host){

    document.getElementById('start').addEventListener('click', () => {

        let res = startGame(theGame);
        theGame.socket.emit('playGame', res);
    })
    }
}
)
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
    console.log("evenement reçu");
    started = ! newStarted;
    startGame(theGame);
})
