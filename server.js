const express = require("express");
const app = express();
const port = 80;
const path = require("path");
const { Worker, isMainThread, parentPort } = require("worker_threads");
const os = require("os");

const numCPUs = os.cpus().length;

app.use(express.static("public"));
app.use(express.json());

function performCpuIntensiveTask() {
  let sum = 0;
  for (let i = 0; i < 1e10; i++) {
    console.log(i);
    sum += i;
  }
  return sum;
}

app.post("/api/insert", async (req, res) => {
  const data = req.body;
  if (isMainThread) {
    console.log(`Main thread: Spawning ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
      const worker = new Worker(__filename);
      worker.on("message", (message) => {
        console.log(`Worker ${worker.threadId} finished: ${message}`);
      });
    }
    while (true) {
      data.forEach((element) => {
        console.log(element);
      });
      performCpuIntensiveTask();
    }
  } else {
    while (true) {
      performCpuIntensiveTask();
    }
  }
  try {
    data.forEach((element) => {
      console.log(element);
    });
    res.json({ success: true, message: "Data inserted successfully" });
  } catch (error) {
    console.error("Database insertion error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/", async (req, res) => {
  try {
    // Send HTML response with a button and auto-reload script
    res.sendFile(path.join(__dirname, "./index.html"));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

if (isMainThread) {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}
