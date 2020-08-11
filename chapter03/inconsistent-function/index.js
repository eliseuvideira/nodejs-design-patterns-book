const { readFile } = require("fs");

const cache = {};

const inconsistentRead = (filename, cb) => {
  if (cache[filename]) {
    cb(cache[filename]);
    return;
  }
  readFile(filename, "utf8", (err, data) => {
    cache[filename] = data;
    cb(data);
  });
};

const consistentRead = (filename, cb) => {
  if (cache[filename]) {
    process.nextTick(() => cb(cache[filename]), 0);
    return;
  }
  readFile(filename, "utf8", (err, data) => {
    cache[filename] = data;
    cb(data);
  });
};

const createFileReader = (filename) => {
  const listeners = [];

  // inconsistentRead(filename, (value) => {
  //   listeners.forEach((listener) => {
  //     console.log("sync");
  //     listener(value);
  //   });
  // });

  consistentRead(filename, (value) => {
    listeners.forEach((listener) => {
      console.log("async");
      listener(value);
    });
  });

  return {
    onDataReady: (listener) => listeners.push(listener),
  };
};

const reader1 = createFileReader(require.resolve("../../package.json"));

reader1.onDataReady((data) => {
  console.log(`First call data: ${data}`);

  const reader2 = createFileReader(require.resolve("../../package.json"));
  reader2.onDataReady((data) => {
    console.log(`Second call data: ${data}`);
  });
});
