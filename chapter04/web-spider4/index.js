const { basename } = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { TaskQueue } = require('../task-queue2/task-queue');

const download = (url, filename, cb) =>
  fetch(url)
    .then(res => res.text())
    .then(content =>
      fs.writeFile(filename, content, err =>
        err ? cb(err) : cb(null, content),
      ),
    )
    .catch(cb);

const getPageLinks = (pageUrl, content) => {
  const url = new URL(pageUrl);
  const regex = new RegExp(url.origin + '[\\w#./:?]+', 'gi');

  const matches = content.match(regex);
  return matches || [];
};

const spiderLinks = (url, content, nesting, queue, cb) => {
  if (nesting === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(url, content);

  if (links.length === 0) {
    return process.nextTick(cb);
  }

  return (function iterate(index) {
    if (index === links.length) {
      return cb();
    }

    spiderTask(links[index], nesting - 1, queue, err => {
      if (err) {
        return cb(err);
      }
      iterate(index + 1);
    });
  })(0);
};

const spiderTask = (url, nesting, queue, cb) => {
  const filename = basename(url);

  fs.readFile(filename, 'utf8', (err, content) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err);
      }
      return download(url, filename, (err, content) => {
        if (err) {
          return cb(err);
        }
        spiderLinks(url, content, nesting, queue, cb);
        return cb();
      });
    }
    spiderLinks(url, content, nesting, queue, cb);
    return cb();
  });
};

const queue = new TaskQueue(2);

spiderTask(process.argv[2], +process.argv[3] || 1, queue, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('download completed');
});
