const { EventEmitter } = require("events");

const ticker = (times, cb) => {
  const TIMEOUT = 50;

  const event = new EventEmitter();

  let executions = 0;

  const run = () => {
    executions += 1;

    if (executions > times) {
      return;
    }

    cb(executions * TIMEOUT);
    event.emit("tick", executions * TIMEOUT);

    if (executions !== times) {
      setTimeout(run, TIMEOUT);
    }
  };

  setTimeout(run, TIMEOUT);

  return event;
};

const event = ticker(10, (ms) => console.log(`callback ${ms}`));
event.on("tick", (ms) => console.log(`event ${ms}`));
