const express = require("express");
const app = express();
const port = 80;
const path = require("path");
const { Worker, isMainThread, parentPort } = require("worker_threads");
const os = require("os");

// const numCPUs = os.cpus().length;

app.use(express.static("public"));
app.use(express.json());

app.post("/api/insert", async (req, res) => {
  const data = req.body;
  const numCPUs = os.cpus().length;
  let workerPromises = [];

  for (let i = 0; i < numCPUs; i++) {
    const workerPromise = new Promise((resolve, reject) => {
      const worker = new Worker("./workerTask.js");

      worker.on("message", (message) => {
        console.log(`Worker ${worker.threadId} finished with result: ${message}`);
        resolve(message);  // Resolve the promise when the worker sends a message
      });

      worker.on("error", (error) => {
        console.error(`Worker ${worker.threadId} error: ${error}`);
        reject(error);  // Reject the promise on error
      });
    });

    workerPromises.push(workerPromise);
  }

  try {
    // Wait for all worker promises to resolve
    await Promise.all(workerPromises);
    data.forEach((element) => {
      console.log(element);
    });

    // After all workers have completed, send a response
    res.json({ message: "All workers completed their tasks" });

  } catch (error) {
    // If any worker promise is rejected, send an error response
    console.error("Error with worker threads:", error);
    res.status(500).json({ success: false, message: "Server error with worker threads" });
  }
  // try {
  //   data.forEach((element) => {
  //     console.log(element);
  //   });
  //   res.json({ success: true, message: "Data inserted successfully" });
  // } catch (error) {
  //   console.error("Database insertion error:", error);
  //   res.status(500).json({ success: false, message: "Server error" });
  // }
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
