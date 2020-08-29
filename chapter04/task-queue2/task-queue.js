const { EventEmitter } = require('events');

class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  push(task) {
    this.queue.push(task);
    process.nextTick(() => this.next());
    return this;
  }

  next() {
    if (this.running === 0 && this.queue.length === 0) {
      this.emit('finished');
      return;
    }
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task(err => {
        if (err) {
          this.emit('error', err);
        }
        this.running -= 1;
        process.nextTick(() => this.next());
      });
      this.running += 1;
    }
  }
}

exports.TaskQueue = TaskQueue;
