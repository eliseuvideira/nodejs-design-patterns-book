class TaskQueue {
  constructor(concurrency = 2) {
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
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task(() => {
        this.running -= 1;
        process.nextTick(() => this.next());
      });
      this.running += 1;
    }
  }
}

exports.TaskQueue = TaskQueue;
