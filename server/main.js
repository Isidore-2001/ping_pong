import http from 'http';
var PORT = process.env.PORT || 3000
import RequestController from './controllers/requestController.js';
import { Server as IOServer } from 'socket.io';
import IOController from './controllers/ioController.js';
const server = http.createServer(
	(request, response) => new RequestController(request, response).handleRequest()
);
// mise en place du serveur de socket.io
const io = new IOServer(server);
const ioController = new IOController(io);

io.on('connection', ioController.registerSocket.bind(ioController));
server.listen(PORT);
