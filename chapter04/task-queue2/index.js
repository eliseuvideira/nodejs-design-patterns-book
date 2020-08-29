const { TaskQueue } = require('./task-queue');

const taskQueue = new TaskQueue(3);

let running = [];

taskQueue.on('error', console.error);
taskQueue.on('finished', () => console.log('finished'));

new Array(10).fill(null).map((_, i) =>
  taskQueue.push(callback => {
    running.push(i);
    console.log(`starting ${i}\t->\trunning ${running.join(', ')}`);
    setTimeout(() => {
      callback(i % 8 === 0 ? new Error(i) : undefined);
      running = running.filter(x => x !== i);
      console.log(`finishing ${i}\t->\trunning ${running.join(', ')}`);
    }, i * 500);
  }),
);
