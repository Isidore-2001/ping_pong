export default class IOController {
  #io;
  #clients;
  #room;

  constructor(io) {
    this.#io = io;
    this.#clients = new Map();
    this.#room = {roomId : null, players : []};
  }

  registerSocket(socket) {
    console.log(`new connection with id ${socket.id}`);
    if (this.room.players.length == 2){
        socket.emit('connexionRefuse');
    }
    socket.join("welcome");
    this.setupListeners(socket);
  }
  
  roomId(){
        return Math.random().toString(36).substring(2,9);
    }
  
  getRandomArbitrary(min, max){
      return Math.floor(Math.random() * (max - min) + min);
  }

  get room(){
    return this.#room;
  }

  acceptUser(player) {
        let res = null;
        if (this.room.players.length < 2 && this.room.players.length > 0){
            this.room.players.forEach((elt) => {
                if (elt.socketId === player.socketId){
                    res = false;
                }
                else{
                    res = true;
                }
            })
        }
      else{
            res = true; 
      }
      return res;
  }

  setupListeners(socket) {
    this.registerPlayer(socket);
    this.keyRegister(socket);
    socket.on( 'disconnect' , () => this.leave(socket) );
  }

  createRoom (player){
        this.room.roomId = this.roomId();
        player.roomId = this.room.roomId;
        return this.room;
      //this.room.players.push(player);
    };

  registerPlayer(socket){
    let room;
    let owner = false;
      if (this.room.roomId != null){
        socket.emit('dataset init', this.room.roomId);
      }
    socket.on('start', (player) => {
        console.log(this.acceptUser(player));
        if (player.roomId === null && this.acceptUser(player)){
            room = this.createRoom(player);
            owner = true;
            socket.broadcast.emit('dataset init', this.room.roomId);
        }
        else if (this.acceptUser(player)) {
            room = this.room;
            if (room == null){
                return;
            }
            //this.room.players.push(player);

        }
        console.log(room);
        socket.join(player.roomId);
        socket.emit('join room', player.roomId, owner, player);
    

    })
    
    socket.on('connexionR', () => {
        socket.disconnect(true);
    })
    socket.on('relancer', (started) => {
        this.#io.emit('Relancer', started);
    });
    socket.on('playGame', (started) => {
        socket.broadcast.emit('Play', started);
    });
    socket.on('player' , (player) => {
        if (this.acceptUser(player)){
            this.room.players.push(player);
        }
        if (this.room.players.length == 2){
              console.log("room players\n");
              console.log(this.room.players);
              this.#io.emit('startGame');
        }

      })
    socket.on('scoreDroite', (player) => {
        player.score = player.score + 1;
        this.#io.emit('scoreDroite', player);
    })
    socket.on('scoreGauche', (player) => {
        player.score = player.score + 1;
        this.#io.emit('scoreGauche', player);
    })
    socket.on('message', (msg) => {
        console.log("message recu");
        socket.broadcast.emit('newMessage', msg);
    })
  }

    //console.log(this.room);


  otherUser(id){
    let res = id;
    this.room.players.forEach((elt) => {
        if (elt.socketId != id){
            res = elt.socketId;
        }
  })
        return res;
 }

  keyRegister(socket) {
    socket.on('ball', (ballX, ballY, shiftX, shiftY) => {
        socket.broadcast.emit('Ball', ballX, ballY, shiftX, shiftY);
    });
    socket.on('down', (paddle, player) => {
       console.log("reception de up");
       socket.broadcast.emit('Down', player, paddle);
    });
    socket.on('up', (paddle, player) => {
       console.log("reception de up");
       socket.broadcast.emit('Up', player, paddle);
    });
    socket.on('right', (paddle, player) => {
       console.log("reception de up");
       socket.broadcast.emit('Right', player, paddle);
    });
    socket.on('left', (paddle, player) => {
       console.log("reception de up");
       socket.broadcast.emit('Left', player, paddle);
    });
    socket.on('stop', (paddle, player) => {
       console.log("reception de up");
       socket.broadcast.emit('Stop');
    });
    
  }
  leave(socket) {
    const userName = 'unknown' || this.#clients.get(socket.id);
    let newPlayers = []
    this.#room.players.forEach((elt) => {
        if (elt.socketId != socket.id){
            newPlayers.push(elt);
        }
    })
      this.#room.players = newPlayers;
      this.room.roomId = null;
      console.log(this.room.players);
      this.#io.emit('deconnected');
    console.log(`disconnection from ${socket.id} (user : ${userName})`);
  }
}

