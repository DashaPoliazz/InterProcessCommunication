'use strict';

const net = require('net');

const socket = new net.Socket();

let user;

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, () => {
  socket.write('Hello from client');
  socket.on('data', (data) => {
    user = JSON.parse(data);
    console.log(`Data received (by client): ${data}`);
    console.log(`Age of ${user.name} is ${user.age}`);
  });
});
