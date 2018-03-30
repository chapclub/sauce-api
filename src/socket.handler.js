import express from 'express';

/**
 * Returns a promise with a reference to the connected socket
 */
export const getSaucinator = (io, onConnect) => {
  return new Promise((yes, no) => {
    io.on('connection', (socket) => {
      if (onConnect) onConnect(socket);

      yes(socket);
    });
  });
};

/**
 * makeDrink - Request handler
 *   Accepts the saucinator socket and a status closure and returns an api
 *   handler for the following request signature
 *
 * POST - /drink/make
 *   creates a drink set as default
 *   if a drink is provided, send it to the socket server
 */
const makeDrink = (socket, getStatus) => (req, res) => {
  const status = getStatus();

  if (status && status.busy) return res.status(403).send('machine busy');
  if (req.body && req.body.drink) socket.emit('make-drink', req.body.drink);
  else socket.emit('make-drink', {});

  res.sendStatus(204);
};

/**
 * setDrink - Request handler
 *   Accepts the saucinator socket and returns an api
 *   handler for the following request signature
 *
 * POST - /drink/set
 *   sets the machine default drink
 */
const setDrink = (socket) => (req, res) => {
  if (req.body.drink) socket.emit('set-drink', req.body.drink);
  else return res.status(400).send('No drink provided');

  res.sendStatus(204);
};

/**
 * Returns a router with the socket connection bound
 */
export const getRouter = (socket) => {
  const router = express.Router();
  let status;

  // once we receive a status, we need to use it to block requests on busy
  socket.on('status', (data) => {
    console.log('got a status', data);
    status = data;
  });

  router.post('/drink/make', makeDrink(socket, () => ( status )));
  router.post('/drink/set', setDrink(socket));
  router.get('/status', (req, res) => {
    if (status) return res.json(status);
    else return res.status(204).send();
  });

  return router;
};
