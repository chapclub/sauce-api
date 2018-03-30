// just to create the http server
import http from 'http';

// the classic og of course
import express from 'express';

// for the websocket connection to the saucinator
import socketIO from 'socket.io';

// get the socket handler utilities
import { getSaucinator, getRouter } from './socket.handler';

// get the running port from teh interwebz
const port = parseInt(process.env.PORT) || 6969;

// literally just pass the things around
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// start the server
server.listen(port, () =>
              console.log(`listening at ${port}`));

// open socket connection to the saucinator
getSaucinator(io, () => console.log('connected to socket')).then((socket) => {
  app.use(getRouter(socket));
});

// configure routes
app.get('/', (req, res) => {
  res.status(404).send();
});


// false status means not accepting
let status = false;

