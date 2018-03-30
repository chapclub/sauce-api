const io = require('socket.io-client');

export const runTestClient = () => {
  const client = io('http://localhost:6970');
  client.on('connect', (socket) => {
    console.log('client connected');

    client.emit('status', { msg: 'all good'});

    client.on('make-drink', (drink) => {
      console.log('client make-drink: ', drink);
      client.emit('status', { msg: 'received drink', drink });
    });

    client.on('set-drink', (drink) => {
      console.log('client set-drink: ', drink);
      client.emit('status', { msg: 'received drink', drink });
    });
  });
};
