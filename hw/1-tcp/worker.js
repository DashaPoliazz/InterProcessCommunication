"use strict";

console.log(`Worker ${process.pid} has been started`);

const calculation = (item) => item * 2;

process.on("message", (message) => {
  console.log("Message to worker:", message);

  const result = message.task.map(calculation);
  process.send({ result });
});
