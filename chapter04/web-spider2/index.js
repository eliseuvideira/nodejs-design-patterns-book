const fs = require('fs');
const { basename } = require('path');
const fetch = require('node-fetch');

const download = (url, filename, cb) =>
  fetch(url)
    .then(res => res.text())
    .then(content => fs.writeFile(filename, content, cb))
    .catch(cb);

const spider = (url, cb) => {
  const filename = basename(url);

  fs.access(filename, err => {
    if (!err || err.code !== 'ENOENT') {
      return cb(null, filename, false);
    }
    download(url, filename, err => {
      if (err) {
        return cb(err);
      }
      cb(null, filename, true);
    });
  });
};

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.error(err);
    return;
  }

  if (!downloaded) {
    console.warn(`filename ${filename} already downloaded`);
    return;
  }

  console.log(`${filename} downloaded`);
});
