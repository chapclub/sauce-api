// just to create the http server
import http from 'http';
import path from 'path';

// the classic og of course
import express from 'express';
import bodyParser from 'body-parser';

// for the websocket connection to the saucinator
import socketIO from 'socket.io';

// get the socket handler utilities
import { getSaucinator, getRouter } from './socket.handler';

// test client socket
import { runTestClient } from './test.client';

// get the running port from teh interwebz
const port = parseInt(process.env.PORT) || 6969;

// literally just pass the things around
const app = express();
app.use(bodyParser.json());
const server = http.Server(app);
const io = socketIO(6970);

// serve the frontend
app.use(express.static(path.join('..', 'sauce-site/build')))

// start the test client
// runTestClient();

// start the server
server.listen(port, () =>
              console.log(`listening at ${port}`));

// open socket connection to the saucinator
getSaucinator(io, () => console.log('connected to socket')).then((socket) => {
  app.use(getRouter(socket));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'sauce-site', 'build', 'index.html'));
});

// false status means not accepting
let status = false;

