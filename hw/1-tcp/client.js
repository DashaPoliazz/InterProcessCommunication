const net = require("node:net");

const socket = new net.Socket();

const task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];

socket.connect(
  {
    port: 3000,
    host: "127.0.0.1",
  },
  () => {
    socket.write(JSON.stringify(task));
  }
);
