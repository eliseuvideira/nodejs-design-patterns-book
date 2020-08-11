const { readFile } = require("fs");

const readJSONThrows = (filename, cb) => {
  readFile(filename, "utf8", (err, data) => {
    if (err) {
      return cb(err);
    }
    cb(null, JSON.parse(data));
  });
};

try {
  readJSONThrows(require.resolve("./wrong-json.json"), (err, data) => {
    if (err) {
      console.error(err);
    }
    console.log("end", data);
  });
} catch (err) {
  console.log("never reaches", err);
}

process.on("uncaughtException", (err) => {
  console.log("this will reach", err);
  process.exit(1);
});
