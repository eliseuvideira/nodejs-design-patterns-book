const fs = require('fs');
const { basename } = require('path');
const fetch = require('node-fetch');

const download = (url, filename, cb) =>
  fetch(url)
    .then(res => res.text())
    .then(content => fs.writeFile(filename, content, cb))
    .catch(cb);

const getPageLinks = (pageUrl, content) => {
  const url = new URL(pageUrl);
  const regex = new RegExp(url.origin + '[\\w#./:?]+', 'gi');

  console.log({ pageUrl });
  const matches = content.match(regex);
  console.log(matches, regex, url.href);
  return matches || [];
};

const spiderLinks = (url, content, nesting, cb) => {
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

    spider(links[index], nesting - 1, err => {
      if (err) {
        return cb(err);
      }
      iterate(index + 1);
    });
  })(0);
};

const spider = (url, nesting, cb) => {
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
        spiderLinks(url, content, nesting, cb);
      });
    }
    spiderLinks(url, content, nesting, cb);
  });
};

spider(process.argv[2], +process.argv[3] || 1, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('download completed');
});
