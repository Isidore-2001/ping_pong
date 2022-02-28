/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/Ball.js":
/*!*****************************!*\
  !*** ./src/scripts/Ball.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Ball)\n/* harmony export */ });\n/* harmony import */ var _Mobile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Mobile.js */ \"./src/scripts/Mobile.js\");\n // default values for a Ball : image and shifts\n\nconst BALL_IMAGE_SRC = './images/balle24.png';\nconst SHIFT_X = 2;\nconst SHIFT_Y = 2;\n/**\r\n * a Ball is a mobile with a ball as image and that bounces in a Game (inside the game's canvas)\r\n */\n\nclass Ball extends _Mobile_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  /**  build a ball\r\n   *\r\n   * @param  {number} x       the x coordinate\r\n   * @param  {number} y       the y coordinate\r\n   * @param  {Game} theGame   the Game this ball belongs to\r\n   */\n  constructor(x, y, theGame, Obstacle, Obstacle2) {\n    super(x, y, BALL_IMAGE_SRC, SHIFT_X, SHIFT_Y);\n    this.theGame = theGame;\n    this.Obstacle = Obstacle;\n    this.Obstacle2 = Obstacle2;\n    this.winHost = 0;\n    this.winAdverse = 0;\n  }\n\n  angle(n, paddle) {\n    const pas = paddle.height / (2 * n);\n    const milieu_ball = this.y < paddle.y ? this.y + this.height : this.y;\n    let debut = -n;\n    let paddle_debut = paddle.y;\n    let ens = new Map();\n    let j = 0;\n\n    while (j <= 2 * n) {\n      ens.set(paddle_debut, debut);\n      paddle_debut += pas;\n      debut += 1;\n      j++;\n    }\n\n    let tableau = Array.from(ens);\n    let i = 0;\n\n    while (i < tableau.length - 1) {\n      if (tableau[i][0] < milieu_ball && milieu_ball < tableau[i + 1][0]) {\n        console.log(`tab = ${tableau[i][0]}`);\n        let y = tableau[i + 1][1];\n        return {\n          'shiftX': y > 0 ? 7 - y : 7 - Math.abs(y),\n          'shiftY': y\n        };\n      }\n\n      i++;\n    }\n\n    if (milieu_ball >= tableau[i][0]) {\n      let y = tableau[i][1];\n      return {\n        'shiftX': y > 0 ? 7 - y : 7 - Math.abs(y),\n        'shiftY': y\n      };\n    }\n\n    if (milieu_ball <= tableau[0][0]) {\n      let y = tableau[0][1];\n      return {\n        'shiftX': y > 0 ? 7 - y : 7 - Math.abs(y),\n        'shiftY': y\n      };\n    }\n  }\n  /**\r\n   * when moving a ball bounces inside the limit of its game's canvas\r\n   */\n\n\n  move() {\n    this.winHost = 0;\n    this.winAdverse = 0;\n\n    if (this.x + this.width == this.theGame.canvas.width) {\n      this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);\n    }\n\n    if (this.collisionWith(this.Obstacle)) {\n      let res = this.angle(5, this.Obstacle);\n      this.shiftY = res.shiftY; // rebond en haut ou en bas\n\n      this.shiftX = res.shiftX; // rebond en gauche ou à droite\n\n      this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);\n    } else if (this.collisionWith(this.Obstacle2)) {\n      let res2 = this.angle(5, this.Obstacle2);\n      this.shiftY = -res2.shiftY;\n      this.shiftX = -res2.shiftX;\n      this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY); // Permettre la synchronisation de la balle \n    } else if (this.y <= 0 || this.y + this.height >= this.theGame.canvas.height\n    /*this.Obstacle.height*/\n    ) {\n      this.shiftY = -this.shiftY; // rebond en haut ou en bas\n      //this.stopMoving();\n    } else if (this.x <= 0 || this.x + this.width >= this.theGame.canvas.width\n    /*this.Obstacle.width*/\n    ) {\n      this.shiftX = -this.shiftX; // rebond à gauche ou à droite\n    } else if (this.x + this.width < this.Obstacle.x + this.Obstacle.width) {\n      this.winAdverse = 1; // Score pour l'adversaire \n\n      this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);\n    } else if (this.x + this.width > this.Obstacle2.x + this.Obstacle2.width) {\n      this.winHost = 1;\n      this.theGame.socket.emit('ball', this.x, this.y, this.shiftX, this.shiftY);\n    }\n\n    super.move();\n  }\n\n  winOfSocket() {\n    if (this.winHost == 1) {\n      this.theGame.socket.emit('scoreDroite', this.theGame.player);\n    } else if (this.winAdverse == 1) {\n      this.theGame.socket.emit('scoreGauche', this.theGame.player);\n    }\n\n    this.winAdverse = 0;\n    this.winHost = 0;\n  }\n  /**\r\n   * collision avec le paramètre Obstacle\r\n   * @param Obstacle \r\n   */\n\n\n  collisionWith(Obstacle) {\n    const x1 = Obstacle.x;\n    const y1 = Obstacle.y;\n    const x1_1 = this.x;\n    const y1_1 = this.y;\n    const xP1 = Math.max(x1, x1_1);\n    const yP1 = Math.max(y1, y1_1);\n    const x2 = x1 + Obstacle.width;\n    const y2 = y1 + Obstacle.height;\n    const x2_1 = x1_1 + this.width;\n    const y2_1 = y1_1 + this.height;\n    const xP2 = Math.min(x2, x2_1);\n    const yP2 = Math.min(y2, y2_1); //console.log(xP1 <= xP2 && yP1 <= yP2);\n\n    return xP1 <= xP2 && yP1 <= yP2;\n  }\n\n}\n\n//# sourceURL=webpack://client/./src/scripts/Ball.js?");

/***/ }),

/***/ "./src/scripts/Game.js":
/*!*****************************!*\
  !*** ./src/scripts/Game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _Ball_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ball.js */ \"./src/scripts/Ball.js\");\n/* harmony import */ var _Paddle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Paddle.js */ \"./src/scripts/Paddle.js\");\n/* harmony import */ var _images_Game_is_paused_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../images/Game-is-paused.png */ \"./src/images/Game-is-paused.png\");\n\n\n\n/**\r\n * a Game animates a ball bouncing in a canvas\r\n */\n\nclass Game {\n  /**\r\n   * build a Game\r\n   *\r\n   * @param  {Canvas} canvas the canvas of the game\r\n   */\n  #paddle;\n  #paddle2;\n  #player;\n  #socket;\n  #pause;\n\n  constructor(canvas) {\n    this.#pause = false;\n    this.pauseImage = this.createImage(_images_Game_is_paused_png__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n    this.raf = null;\n    this.canvas = canvas;\n    this.ctxt = this.canvas.getContext(\"2d\");\n    this.#paddle = new _Paddle_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](8, this.canvas.height / 2 - 10);\n    this.#paddle2 = new _Paddle_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.canvas.width - 50, this.canvas.height / 2 - 10);\n    this.#socket = io();\n    this.ball = new _Ball_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.canvas.width / 2, this.canvas.height / 2, this, this.#paddle, this.#paddle2);\n    this.#player = {\n      paddle: null,\n      host: '',\n      roomId: null,\n      socketId: '',\n      win: false,\n      score: 0\n    };\n    /*Les méthodes de gestion de connexion de socket */\n\n    this.receiveKey();\n    this.initData();\n    this.refusedConnect();\n  }\n  /**\r\n   * Cette méthode permet de créer une image \r\n   * correspondant à la source imagePath\r\n   */\n\n\n  createImage(imagePath) {\n    const menuImg = new Image();\n    menuImg.width = 650;\n    menuImg.src = imagePath;\n    return menuImg;\n  }\n  /**\r\n   *Cette méthode permet de d'accéder à l'attribut privé player\r\n   */\n\n\n  get player() {\n    return this.#player;\n  }\n\n  set player(newPlayer) {\n    this.#player = newPlayer;\n  }\n\n  get paddle() {\n    return this.#paddle;\n  }\n\n  get paddle2() {\n    return this.#paddle2;\n  }\n  /**\r\n   *Cette méthode permet d'accéder à l'attribut privé \r\n   de socket \r\n   *\r\n   */\n\n\n  get socket() {\n    return this.#socket;\n  }\n  /**\r\n   * getter de pause \r\n   */\n\n\n  get pause() {\n    return this.#pause;\n  }\n\n  set pause(isPause) {\n    this.#pause = isPause;\n  }\n  /** start this game animation */\n\n\n  start() {\n    this.animate();\n  }\n  /** stop this game animation */\n\n\n  stop() {\n    window.cancelAnimationFrame(this.raf);\n\n    if (this.pause) {\n      this.ctxt.drawImage(this.pauseImage, 50, 50);\n    }\n  }\n\n  keyDownActionHandler(event) {\n    switch (event.key) {\n      case \"ArrowLeft\":\n      case \"Left\":\n        this.player.paddle.moveLeft();\n        this.#socket.emit('left', this.player.paddle, this.player);\n        break;\n\n      case \"ArrowRight\":\n      case \"Right\":\n        this.player.paddle.moveRight();\n        this.#socket.emit('right', this.player.paddle, this.player);\n        break;\n\n      case \"ArrowUp\":\n      case \"Up\":\n        this.player.paddle.moveUp();\n        this.#socket.emit('up', this.player.paddle, this.player);\n        break;\n\n      case \"ArrowDown\":\n      case \"Down\":\n        this.player.paddle.moveDown();\n        this.#socket.emit('down', this.player.paddle, this.player);\n        break;\n\n      default:\n        return;\n    }\n\n    event.preventDefault();\n  }\n\n  choicePaddle() {\n    if (this.player.paddle === this.paddle2) {\n      return this.paddle;\n    }\n\n    return this.paddle2;\n  }\n  /**\r\n   * Cette méthode permet de gérer l'accès \r\n   * à un room ou pas  \r\n   * Celui-ci permet de déleguer le premier joueur et \r\n   * le second joueur \r\n   */\n\n\n  initData() {\n    this.socket.on('join room', (data, owner, dataPlayer) => {\n      this.player.roomId = data;\n\n      if (owner && dataPlayer.socketId === this.socket.id) {\n        this.player.paddle = this.paddle;\n        this.player.host = true;\n        document.getElementById('typeplayer').innerHTML = \"Vous êtes le premier joueur\";\n      } else {\n        this.player.paddle = this.paddle;\n        this.player.host = false;\n        this.player.socketId = this.socket.id;\n        document.getElementById('typeplayer').innerHTML = \"Vous êtes le second joueur\";\n      }\n\n      dataPlayer = this.player;\n      this.socket.emit('player', this.player);\n    });\n  }\n  /**\r\n   * Cette méthode permet de refuser \r\n   * la connexion des autres clients et \r\n   * permet de limiter le nombre de connexion à deux \r\n   *\r\n   */\n\n\n  refusedConnect() {\n    this.socket.on('connexionRefuse', () => {\n      this.socket.emit('connexionR');\n      document.getElementById('typeplayer').classList.remove('bg-success');\n      document.getElementById('typeplayer').classList.add('bg-danger');\n      document.getElementById('typeplayer').innerHTML = \"Connexion refusé\";\n    });\n  }\n  /**\r\n   * Cette méthode permet de \r\n   * gérer les évènements Left, Up, Right, et Down  \r\n   *\r\n   */\n\n\n  receiveKey() {\n    let pad = this.choicePaddle();\n    this.#socket.on('Ball', (ballX, ballY, shiftX, shiftY) => {\n      this.ball.shiftX = -shiftX;\n      this.ball.shiftY = shiftY;\n    });\n    this.#socket.on('Left', (p, paddle) => {\n      this.paddle2.moveRight();\n    });\n    this.#socket.on('Right', (p, paddle) => {\n      this.paddle2.moveLeft();\n    });\n    this.#socket.on('Up', (p, paddle) => {\n      this.paddle2.y = paddle.y;\n      this.paddle2.moveUp();\n    });\n    this.#socket.on('Down', (p, paddle) => {\n      this.paddle2.y = paddle.y;\n      this.paddle2.moveDown();\n    });\n    this.#socket.on('Stop', () => {\n      this.paddle2.stopMoving();\n    });\n  }\n\n  keyUpActionHandler(event) {\n    switch (event.key) {\n      case \"ArrowDown\":\n      case \"Down\":\n      case \"ArrowLeft\":\n      case \"Left\":\n      case \"ArrowRight\":\n      case \"Right\":\n      case \"ArrowUp\":\n      case \"Up\":\n        this.player.paddle.stopMoving();\n        this.#socket.emit('stop');\n        break;\n\n      default:\n        return;\n    }\n\n    event.preventDefault();\n  }\n  /** animate the game : move and draw */\n\n\n  animate() {\n    this.moveAndDraw();\n    this.raf = window.requestAnimationFrame(this.animate.bind(this));\n  }\n  /** move then draw the bouncing ball */\n\n\n  moveAndDraw() {\n    this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height); // draw and move the ball\n\n    this.ball.move();\n    this.ball.winOfSocket();\n    this.paddle2.draw(this.ctxt);\n    this.paddle.draw(this.ctxt);\n    this.player.paddle.move(this.canvas);\n    this.paddle2.move(this.canvas);\n    this.ball.draw(this.ctxt);\n  }\n\n}\n\n//# sourceURL=webpack://client/./src/scripts/Game.js?");

/***/ }),

/***/ "./src/scripts/Mobile.js":
/*!*******************************!*\
  !*** ./src/scripts/Mobile.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Mobile)\n/* harmony export */ });\n/**\r\n  A mobile is defined by its coordinates, an image and a \"speed\" defined by horizontal and vertical shift values\r\n  */\nclass Mobile {\n  /**\r\n   * buils a Mobile\r\n   *\r\n   * @param  {number} x          the x coordinate of this mobile\r\n   * @param  {number} y          the y coordinate of this mobile\r\n   * @param  {string} imgSrc     this mobile's image src\r\n   * @param  {number} shiftX = 0 the horizontal shift \"speed\"\r\n   * @param  {number} shiftY = 0 the vertical shift \"speed\"\r\n   */\n  constructor(x, y, imgSrc, shiftX = 0, shiftY = 0) {\n    this.y = y;\n    this.x = x;\n    this.img = new Image();\n    this.img.src = imgSrc;\n    this.shiftX = shiftX;\n    this.shiftY = shiftY;\n    this.initialX = x;\n    this.initialY = y;\n  }\n  /** @return {number} the width of the mobile, ie. its images's width */\n\n\n  get width() {\n    return this.img.width;\n  }\n  /** @return {number} the width of the mobile, ie. its images's height */\n\n\n  get height() {\n    return this.img.height;\n  }\n  /*\r\n  get x(){\r\n      return this.x;\r\n  }\r\n    get y(){\r\n      return this.y;\r\n  }*/\n\n  /*set x(newX) {\r\n      this.x = newX;\r\n  }\r\n    set y(y){\r\n      this.y = y;\r\n  }*/\n\n  /** this mobile moves : horizontal and vertical shifts are added to coordinates */\n\n\n  move() {\n    this.x = this.x + this.shiftX;\n    this.y = this.y + this.shiftY;\n  }\n  /** draw this mobile's image at its coordinates in the given context\r\n   * @param {CanvasRenderingContext2D} ctxt - the drawing context\r\n   */\n\n\n  draw(ctxt) {\n    ctxt.drawImage(this.img, this.x, this.y);\n  }\n  /** this mobile stops moving : speed becomes 0 */\n\n\n  stopMoving() {\n    this.shiftX = 0;\n    this.shiftY = 0;\n  }\n\n}\n\n//# sourceURL=webpack://client/./src/scripts/Mobile.js?");

/***/ }),

/***/ "./src/scripts/Paddle.js":
/*!*******************************!*\
  !*** ./src/scripts/Paddle.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Paddle)\n/* harmony export */ });\n/* harmony import */ var _movestate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./movestate.js */ \"./src/scripts/movestate.js\");\n/* harmony import */ var _Mobile_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Mobile.js */ \"./src/scripts/Mobile.js\");\n\n\nconst PaddleImgSrc = './images/paddle.png';\nclass Paddle extends _Mobile_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"] {\n  constructor(x, y) {\n    super(x, y, PaddleImgSrc, 0, 0);\n    this._moving = _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].NONE;\n  }\n  /**\n   * Cette méthode permet de savoir si le vaisseau est\n   * en haut ou en bas\n   * @returns un booleen\n   */\n\n\n  up() {\n    return this._moving === _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].UP;\n  }\n  /**\n   * Cette méthode permet de savoir si le vaisseau est\n   * en haut ou en bas\n   * @returns un booleen\n   */\n\n\n  down() {\n    return this._moving === _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].DOWN;\n  }\n\n  stopMoving() {\n    return this._moving = _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].NONE;\n  }\n  /**\n   *\n   *\n   */\n\n\n  moveUp() {\n    this.shiftY = -10;\n    this._moving = _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].UP;\n  }\n  /**\n   *\n   *\n   */\n\n\n  moveDown() {\n    this.shiftY = +10;\n    this._moving = _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].DOWN;\n  }\n\n  moveRight() {\n    this.shiftX = +2;\n    this._moving = _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].RIGHT;\n  }\n\n  moveLeft() {\n    this.shiftX = -2;\n    this._moving = _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].LEFT;\n  }\n\n  move(canvas) {\n    //console.log(this._moving);\n    if (this._moving === _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].UP) {\n      this.y = Math.max(0, this.y + this.shiftY);\n    }\n\n    if (this._moving === _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].DOWN) {\n      this.y = Math.min(canvas.height - this.height, this.y + this.shiftY);\n    }\n\n    if (this._moving === _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].RIGHT) {\n      this.x = Math.min(canvas.width - this.width, this.x + this.shiftX);\n    }\n\n    if (this._moving === _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].LEFT) {\n      this.x = Math.max(0, this.x + this.shiftX);\n    }\n  }\n\n  stopMoving() {\n    this._moving = _movestate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].NONE;\n  }\n\n}\n\n//# sourceURL=webpack://client/./src/scripts/Paddle.js?");

/***/ }),

/***/ "./src/scripts/message.js":
/*!********************************!*\
  !*** ./src/scripts/message.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game.js */ \"./src/scripts/Game.js\");\n\nconst theField = document.getElementById(\"field\");\nconst theGame = new _Game_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](theField);\nvar INDEX = 0;\n\nfunction generate_message(msg, type) {\n  INDEX++;\n  var str = \"\";\n  str += \"<div id='cm-msg-\" + INDEX + \"' class=\\\"chat-msg \" + type + \"\\\">\";\n  str += \"          <span class=\\\"msg-avatar\\\">\"; //str += \"            <img src=\\\"https:\\/\\/image.crisp.im\\/avatar\\/operator\\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\\/240\\/?1483361727745\\\">\";\n\n  str += \"<img src=\\\"https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg\\\" />\";\n  str += \"          <\\/span>\";\n  str += \"          <div class=\\\"cm-msg-text\\\">\";\n  str += msg;\n  str += \"          <\\/div>\";\n  str += \"        <\\/div>\";\n  $(\".chat-logs\").append(str);\n  $(\"#cm-msg-\" + INDEX).hide().fadeIn(300);\n\n  if (type == 'self') {\n    $(\"#chat-input\").val('');\n  }\n\n  $(\".chat-logs\").stop().animate({\n    scrollTop: $(\".chat-logs\")[0].scrollHeight\n  }, 1000);\n}\n\n$(function () {\n  $(\"#chat-submit\").click(function (e) {\n    e.preventDefault();\n    var msg = $(\"#chat-input\").val();\n\n    if (msg.trim() == '') {\n      return false;\n    }\n\n    generate_message(msg, 'self');\n    theGame.socket.emit('message', msg);\n    var buttons = [{\n      name: 'Existing User',\n      value: 'existing'\n    }, {\n      name: 'New User',\n      value: 'new'\n    }];\n  });\n\n  function generate_button_message(msg, buttons) {\n    INDEX++;\n    var btn_obj = buttons.map(function (button) {\n      return \"              <li class=\\\"button\\\"><a href=\\\"javascript:;\\\" class=\\\"btn btn-primary chat-btn\\\" chat-value=\\\"\" + button.value + \"\\\">\" + button.name + \"<\\/a><\\/li>\";\n    }).join('');\n    var str = \"\";\n    str += \"<div id='cm-msg-\" + INDEX + \"' class=\\\"chat-msg user\\\">\";\n    str += \"          <span class=\\\"msg-avatar\\\">\";\n    str += \"            <img src=\\\"https:\\/\\/image.crisp.im\\/avatar\\/operator\\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\\/240\\/?1483361727745\\\">\";\n    str += \"          <\\/span>\";\n    str += \"          <div class=\\\"cm-msg-text\\\">\";\n    str += msg;\n    str += \"          <\\/div>\";\n    str += \"          <div class=\\\"cm-msg-button\\\">\";\n    str += \"            <ul>\";\n    str += btn_obj;\n    str += \"            <\\/ul>\";\n    str += \"          <\\/div>\";\n    str += \"        <\\/div>\";\n    $(\".chat-logs\").append(str);\n    $(\"#cm-msg-\" + INDEX).hide().fadeIn(300);\n    $(\".chat-logs\").stop().animate({\n      scrollTop: $(\".chat-logs\")[0].scrollHeight\n    }, 1000);\n    $(\"#chat-input\").attr(\"disabled\", true);\n  }\n\n  $(document).delegate(\".chat-btn\", \"click\", function () {\n    var value = $(this).attr(\"chat-value\");\n    var name = $(this).html();\n    $(\"#chat-input\").attr(\"disabled\", false);\n    generate_message(name, 'self');\n  });\n  $(\"#chat-circle\").click(function () {\n    $(\"#chat-circle\").toggle('scale');\n    $(\".chat-box\").toggle('scale');\n  });\n  $(\".chat-box-toggle\").click(function () {\n    $(\"#chat-circle\").toggle('scale');\n    $(\".chat-box\").toggle('scale');\n  });\n});\n\n//# sourceURL=webpack://client/./src/scripts/message.js?");

/***/ }),

/***/ "./src/scripts/movestate.js":
/*!**********************************!*\
  !*** ./src/scripts/movestate.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MoveState)\n/* harmony export */ });\nclass MoveState {\n  static DOWN = 0;\n  static UP = 1;\n  static NONE = 2;\n\n  static get DOWN() {\n    return DOWN;\n  }\n\n  static get UP() {\n    return UP;\n  }\n\n  static get NONE() {\n    return NONE;\n  }\n\n}\n\n//# sourceURL=webpack://client/./src/scripts/movestate.js?");

/***/ }),

/***/ "./src/scripts/pong.js":
/*!*****************************!*\
  !*** ./src/scripts/pong.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game.js */ \"./src/scripts/Game.js\");\n/* harmony import */ var _message_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./message.js */ \"./src/scripts/message.js\");\n//'use strict';\n\n\n/**\r\n * Le code conçernant le template de messagerie \r\n *\r\n */\n\nconst theField = document.getElementById(\"field\");\nlet started = false;\nconst Start = document.getElementById(\"controls\");\nconst theGame = new _Game_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](theField);\n\nconst init = ev => {\n  document.getElementById('start').addEventListener(\"click\", joinRoom); //joinRoom();\n};\n\nwindow.addEventListener(\"load\", init);\n\nconst joinRoom = () => {\n  theGame.player.socketId = theGame.socket.id;\n  console.log(theGame.player.socketId);\n  theGame.socket.emit('start', theGame.player);\n};\n\ntheGame.socket.on('newMessage', msg => {\n  generate_message(msg, 'user');\n});\n\nconst restart_game = () => {\n  theGame.player.score = 0;\n  theGame.ball.x = theGame.ball.initialX;\n  theGame.ball.y = theGame.ball.initialY;\n  theGame.paddle.x = theGame.paddle.initialX;\n  theGame.paddle.y = theGame.paddle.initialY;\n  theGame.paddle2.x = theGame.paddle2.initialX;\n  theGame.paddle2.y = theGame.paddle2.initialY;\n  theGame.moveAndDraw();\n  document.getElementById('scoreHost').innerHTML = theGame.player.score;\n  document.getElementById('scoreAdversaire').innerHTML = 0;\n};\n/**\r\n * Déconnexion d'un joueur \r\n * cet evenement permet de relancer le jeu \r\n */\n\n\ntheGame.socket.on('deconnected', () => {\n  started = true;\n  theGame.pause = false;\n  startGame(theGame);\n  /**\r\n   * Permettre au second joueur de devenir le premier joueur \r\n   * si le premier joueur se déconnecte \r\n   */\n\n  if (!theGame.player.host) {\n    document.getElementById('typeplayer').innerHTML = \"Vous êtes le premier joueur\";\n  }\n\n  ;\n  theGame.player.host = true;\n  document.getElementById('start').removeEventListener('click', startedGame);\n});\ntheGame.socket.on('dataset init', id => {\n  theGame.player.roomId = id;\n  theGame.socket.emit('start', theGame.player);\n});\n/**\r\n * Cette partie s'occupe du score de gauche du joueur \r\n * @param le joueur \r\n */\n\ntheGame.socket.on('scoreGauche', player => {\n  theGame.ball.x = theGame.ball.initialX;\n  theGame.ball.y = theGame.ball.initialY;\n  theGame.paddle.x = theGame.paddle.initialX;\n  theGame.paddle.y = theGame.paddle.initialY;\n  theGame.paddle2.x = theGame.paddle2.initialX;\n  theGame.paddle2.y = theGame.paddle2.initialY;\n  theGame.moveAndDraw(); //this.stop();\n\n  started = true;\n  theGame.pause = true;\n  startGame(theGame);\n\n  if (player.socketId == theGame.socket.id) {\n    theGame.player.score = player.score;\n    document.getElementById('scoreHost').innerHTML = theGame.player.score;\n  } else {\n    document.getElementById('scoreAdversaire').innerHTML = player.score;\n  }\n});\n/**\r\n * Cette partie s'occupe du score de droite du joueur \r\n * @param player le joueur \r\n */\n\ntheGame.socket.on('scoreDroite', player => {\n  theGame.ball.x = theGame.ball.initialX;\n  theGame.ball.y = theGame.ball.initialY;\n  theGame.paddle.x = theGame.paddle.initialX;\n  theGame.paddle.y = theGame.paddle.initialY;\n  theGame.paddle2.x = theGame.paddle2.initialX;\n  theGame.paddle2.y = theGame.paddle2.initialY;\n  theGame.moveAndDraw(); //startGame(theGame);\n\n  started = true;\n  theGame.pause = true;\n  startGame(theGame);\n\n  if (player.socketId == theGame.socket.id) {\n    theGame.player.score = player.score;\n    document.getElementById('scoreHost').innerHTML = theGame.player.score;\n  } else {\n    document.getElementById('scoreAdversaire').innerHTML = player.score;\n  }\n});\n\nconst startedGame = () => {\n  let res = startGame(theGame);\n  theGame.pause = res;\n  theGame.socket.emit('playGame', res);\n};\n/**\r\n *L'evenement permettant de démarrer le jeu \r\n */\n\n\ntheGame.socket.on('startGame', () => {\n  document.getElementById('start').removeEventListener('click', joinRoom);\n  restart_game();\n  started = false;\n\n  if (theGame.player.host) {\n    document.getElementById('start').addEventListener('click', startedGame);\n  }\n});\nwindow.addEventListener(\"keydown\", event => {\n  if (theGame.player.host) {\n    {\n      switch (event.key) {\n        case ' ':\n          startedGame();\n          break;\n\n        default:\n      }\n    }\n  }\n});\n/** start and stop a game\r\n * @param {Game} theGame - the game to start and stop\r\n */\n\nconst startGame = theGame => {\n  if (!started) {\n    theGame.start();\n    document.getElementById('start').src = 'images/Stop.png';\n    window.addEventListener(\"keydown\", theGame.keyDownActionHandler.bind(theGame));\n    window.addEventListener(\"keyup\", theGame.keyUpActionHandler.bind(theGame));\n  } else {\n    document.getElementById('start').src = 'images/Start.png';\n    document.getElementById('start').value = 'Jouer';\n    theGame.stop();\n  }\n\n  started = !started;\n  theGame.socket.emit('ball', theGame.ball.x, theGame.ball.y, theGame.ball.shiftX, theGame.ball.shiftY);\n  return started;\n};\n\ntheGame.socket.on('Play', newStarted => {\n  theGame.pause = !newStarted;\n  startGame(theGame);\n});\n\n//# sourceURL=webpack://client/./src/scripts/pong.js?");

/***/ }),

/***/ "./src/images/Game-is-paused.png":
/*!***************************************!*\
  !*** ./src/images/Game-is-paused.png ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"images/Game-is-paused.png\");\n\n//# sourceURL=webpack://client/./src/images/Game-is-paused.png?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/pong.js");
/******/ 	
/******/ })()
;