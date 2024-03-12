const net = require("node:net");
const cp = require("node:child_process");
const os = require("node:os");

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

    const onWorkerMessage = (worker, message) => {
      console.log("Message from worker:", worker.pid);
      console.log("Message:", message);

      results.push(message.result);

      if (results.length === cores) {
        socket.write(JSON.stringify(results));
        server.close();
      }
    };

    const onWorkerExit = (worker, code) => {
      console.log("Worker exited:", worker.pid, code);
    };

    workers.forEach((worker) => {
      worker.send({ task });

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
