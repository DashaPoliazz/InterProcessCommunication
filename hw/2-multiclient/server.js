const net = require("node:net");
const helpers = require("./helpers.js");

const PORT = 8000;
// remoteAddress<string> => isAvailable<bool>
const clients = new Map();
const tasks = helpers.generateArrayOfArrays(2, 10);
const finishedTasks = new Array(tasks.length).fill(0);

const server = net.createServer((socket) => {
  socket.on("data", (msg) => {
    const { result, done, idx } = JSON.parse(msg);
    if (done) {
      finishedTasks[idx] = result;
      console.log(finishedTasks);
    }
  });

  // creating availableClient
  clients.set(socket.remoteAddress, true);
  // giving task to the client
  if (!tasks.length) {
    console.log("Work is finished!");
    // JSON.parse error
    // socket.write(
    //   JSON.stringify({
    //     done: true,
    //   })
    // );
    return;
  }
  const idx = tasks.length - 1;
  const task = tasks.pop();
  const taskInfo = {
    task,
    idx,
    done: false,
  };
  socket.write(JSON.stringify(taskInfo));
});

server.listen(PORT);
