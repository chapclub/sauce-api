const io = require('socket.io-client');

const client = io('localhost:6969');
client.on('connection', (gateway) => {
  console.log('client connected!');
  gateway.emit('status', { msg: 'all good'});
});
