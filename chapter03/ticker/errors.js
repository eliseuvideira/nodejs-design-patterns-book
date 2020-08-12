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

    const now = Date.now();
    if (now % 5 !== 0) {
      cb(null, executions, now - start);
      event.emit("tick", executions, now - start);
    } else {
      cb(new Error(now));
      event.emit("error", new Error(now));
    }

    if (executions !== times) {
      setImmediate(run);
    }
  };

  setImmediate(run);

  return event;
};

const event = ticker(10, (err, i, ms) =>
  err ? console.error(err) : console.log(`${i} callback ${ms}`)
);
event.on("tick", (i, ms) => console.log(`${i} event ${ms}`));
event.on("error", console.error);
