const net = require("node:net");
const cp = require("node:child_process");
const os = require("node:os");

const TASK_SIZE = 3;

const cores = os.cpus().length;
const results = [];

const PORT = 3000;

const server = net.createServer((socket) => {
  console.log("Connected: ", socket.remoteAddress);

  const onSocketData = (data) => {
    const task = JSON.parse(data);
    console.log("Server: I'm received task:", task);

    // Forking processes
    const workers = [];
    for (let i = 0; i < cores; i++) {
      const worker = cp.fork("./worker.js");
      workers.push(worker);
    }

    // 25 slices of task & cpu.length processes => 25 !== 16;
    // Divide one huge task on smaller tasks
    // Let available processes take task from tasks

    const tasks = [];
    for (let i = 0; i < task.length; i += TASK_SIZE) {
      const startIndex = i;
      const endIndex = i + TASK_SIZE;
      const smallerTask = task.slice(startIndex, endIndex);
      tasks.push(smallerTask);
    }

    console.log("TASKS:", tasks);

    const onWorkerMessage = (worker, message) => {
      console.log("Message from worker:", worker.pid);
      console.log("Message:", message);

      console.log("Tasks Length: ", tasks.length);

      results.push(message.result);

      if (task.length === 0) {
        socket.write(JSON.stringify(results));
        server.close();
      }
    };

    const onWorkerExit = (worker, code) => {
      console.log("Worker exited:", worker.pid, code);

      if (tasks.length > 0) {
        const task = tasks.pop();
        worker.send({ task });
      } else {
        socket.write(JSON.stringify(results));
        server.close();
      }
    };

    workers.forEach((worker) => {
      const currentTask = tasks.pop();
      worker.send({ task: currentTask });

      worker.on("message", (message) => onWorkerMessage(worker, message));
      worker.on("exit", (code) => onWorkerExit(worker, code));
    });
  };

  socket.on("data", onSocketData);
  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
  socket.on("end", () => {
    console.log("Connection closed by client");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
