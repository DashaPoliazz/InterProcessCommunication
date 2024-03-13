"use strict";

console.log(`Worker ${process.pid} has been started`);

process.on("message", (msg) => {
  console.log(`worker: ${process.pid} received message: ${msg}`);
});
