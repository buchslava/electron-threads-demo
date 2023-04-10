const { parentPort, workerData } = require('worker_threads');

let working = true;

parentPort
  .on('message', (msg) => {
    if (msg === 'stop') {
      working = false;
    }
  })
  .unref();

let count = 0;

// eslint-disable-next-line no-promise-executor-return
const snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  while (working) {
    parentPort.postMessage({
      count,
      percent: (100 * count) / workerData.iterations,
    });
    // eslint-disable-next-line no-plusplus
    count++;
    if (count > workerData.iterations) {
      break;
    }
    // eslint-disable-next-line no-await-in-loop
    await snooze(100);
  }
})();
