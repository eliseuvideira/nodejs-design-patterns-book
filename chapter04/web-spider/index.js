const fs = require('fs');
const { basename } = require('path');
const fetch = require('node-fetch');

const spider = (url, cb) => {
  const filename = basename(url);

  fs.access(filename, err => {
    if (err && err.code === 'ENOENT') {
      fetch(url)
        .then(res => res.text())
        .then(content => {
          fs.writeFile(filename, content, err => {
            if (err) {
              cb(err);
            } else {
              cb(null, filename, true);
            }
          });
        })
        .catch(err => cb(err));
    } else {
      cb(null, filename, false);
    }
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
