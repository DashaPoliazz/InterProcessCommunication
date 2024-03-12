"use strict";

console.log(`Worker ${process.pid} has been started`);

const calculation = (item) => ({
  ...item,
  v: item.v * 2,
});

process.on("message", (message) => {
  console.log("Message to worker:", message);

  const { task } = message;
  if (!task) {
    process.exit(1);
  }

  const result = task.map(calculation);
  process.send({ result });
});
