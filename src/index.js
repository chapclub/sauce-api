// just to create the http server
import http from 'http';

// the classic og of course
import express from 'express';

// for the websocket connection to the saucinator
import socketIO from 'socket.io';

// for session handling and authentication
import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';

// get the running port from teh interwebz
const port = parseInt(process.env.PORT) || 6969;

// configure auth middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://delvaze.auth0.com/.well-known/jwks.json`
  }),
  audience: 'saucinator.delvaze.xyz',
  issuer: 'https://delvaze.auth0.com/',
  algorithms: ['RS256']
});

// literally just pass the things around
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// start the server
server.listen(port, () => 
  console.log(`listening at ${port}`));

// configure routes
app.get('/', (req, res) => {
  res.json({ msg: 'fuck u' });
}); 

// configure auth middleware
app.use(checkJwt);

// configure socket apis
io.on('connection', (socket) => {
  socket.emit('message', { fuck: 'you' });
  socket.on('another event', (data) => console.log(data));
});