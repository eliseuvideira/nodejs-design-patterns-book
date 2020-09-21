const fs = require('fs');

const fileSize = (filename, cb) => {
  fs.stat(filename, (err, stats) => {
    if (err) {
      return cb(err);
    }
    cb(null, stats.size);
  });
};

const fileSize2 = filename => {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (err, stats) => {
      if (err) {
        return reject(err);
      }
      resolve(stats.size);
    });
  });
};

(() => {
  fileSize('./package.json', (err, size) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`callback size: ${size}`);
  });

  fileSize2('./package.json')
    .then(size => console.log(`promise size: ${size}`))
    .catch(console.error);
})();
