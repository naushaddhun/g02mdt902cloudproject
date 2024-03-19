const { parentPort } = require("worker_threads");

// A CPU-intensive task, such as a long-running loop
function performCpuIntensiveTask() {
  const startTime = Date.now();
  const duration = 5 * 60 * 1000;
  let sum;
  while (Date.now() - startTime < duration) {
    sum = 0;
    for (let i = 0; i < 1e10; i++) {
      sum += i;
    }
  }
  return sum;
}

// Execute the task
const result = performCpuIntensiveTask();
parentPort.postMessage(result);
