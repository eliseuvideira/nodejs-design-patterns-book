const { EventEmitter } = require("events");
const { readFile } = require("fs");

function findRegex(files, regex) {
  const emitter = new EventEmitter();

  files.forEach((file) => {
    readFile(file, "utf8", (err, content) => {
      if (err) {
        emitter.emit("error", err);
        return;
      }
      emitter.emit("fileread", file);

      const match = content.match(regex);

      if (match) {
        match.forEach((elem) => emitter.emit("found", file, elem));
      }
    });
  });

  return emitter;
}

const matcher = findRegex(
  [require.resolve("../async/index.js"), require.resolve("../../package.json")],
  /version/
);

matcher.on("error", console.error);
matcher.on("fileread", (file) => console.log(`read ${file}`));
matcher.on("found", (file, elem) => console.log(`found ${elem} at ${file}`));
