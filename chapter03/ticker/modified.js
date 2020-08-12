const { EventEmitter } = require("events");

const ticker = (times, cb) => {
  const start = Date.now();

  const event = new EventEmitter();

  let executions = 0;

  const run = () => {
    executions += 1;

    if (executions > times) {
      return;
    }

    cb(executions, Date.now() - start);
    event.emit("tick", executions, Date.now() - start);

    if (executions !== times) {
      setImmediate(run);
    }
  };

  setImmediate(run);

  return event;
};

const event = ticker(10, (i, ms) => console.log(`${i} callback ${ms}`));
event.on("tick", (i, ms) => console.log(`${i} event ${ms}`));
