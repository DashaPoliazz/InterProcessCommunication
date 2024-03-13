const net = require("node:net");
const cp = require("child_process");
const os = require("node:os");

const PORT = 8000;

const socket = new net.Socket();
const coresCount = os.cpus().length;

// Listeners:
const handleSocketData = (data) => {
  console.log("unparseddata", data);
  const task = JSON.parse(data);
  if (!task.task) {
    const reply = `There is no task to execute. Task: ${task.task}, Idx: ${task.idx}`;
    socket.write(JSON.stringify(reply));
  } else if (task.done) {
    console.log("Work finished!");
    return;
  }
  console.log("TASK=", task);
  const results = new Array(task.task.length).fill(0);
  // Dealing smaller task to each process
  const tasks = [];
  const tasksPerProcess = Math.ceil(task.task.length / coresCount);
  for (let i = 0; i < task.task.length; i += tasksPerProcess) {
    const startIndex = i;
    const endIndex = i + tasksPerProcess;
    const smallerTask = task.task
      .slice(startIndex, endIndex)
      .map((item, idx) => ({ item, idx: idx + i }));
    tasks.push(smallerTask);
  }
  // Handle task
  const workers = [];
  for (let i = 0; i < coresCount; i++) {
    const worker = cp.fork("./worker.js");
    workers.push(worker);
  }
  let operations = 0;
  workers.forEach((worker) => {
    // Q! How the process sending task to the worker?
    const taskToExecute = tasks.pop();
    worker.send({ task: taskToExecute });

    worker.on("message", (msg) => {
      const { result } = msg;
      if (!result) {
        console.log("There is no result from worker: ", worker.pid);
        return;
      }

      // filling results
      result.forEach(({ item, idx }) => (results[idx] = item));

      operations += 1;
      const isWorkerDone = operations >= results.length;

      if (isWorkerDone) {
        console.log("NOT FROM CONDITION!");
        socket.write(
          JSON.stringify({ result: results, done: true, idx: task.idx })
        );
      }
    });
    worker.on("exit", (code) => {
      console.log(`Worker ${worker.pid} exit`);
    });
  });
};
const handleSocketError = (err) => {
  console.log("Oops, something went wrong:", err);
};

socket.connect(
  {
    port: PORT,
    host: "127.0.0.1",
  },
  () => {
    socket.addListener("data", handleSocketData);
    socket.addListener("error", handleSocketError);
  }
);
