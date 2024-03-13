"use strict";

const mapper = ({ item, idx }) => ({ item: item * 2, idx });

process.on("message", (msg) => {
  console.log(`Worker with id = ${process.pid} got message = ${msg}`);
  const { task } = msg;
  if (!task) {
    console.log(`Worker with id = ${process.pid} did't received task!`);
    process.exit(1);
  }
  const result = task.map(mapper);
  console.log("RESULT FROM WORKER:", result);
  process.send({ result });
  process.exit(1);
});
