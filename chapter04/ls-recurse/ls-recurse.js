const { resolve } = require('path');
const fs = require('fs');

const isDir = async path => {
  const stats = await fs.promises.stat(path);
  return stats.isDirectory();
};

const readItem = async path => {
  const isDirectory = await isDir(path);
  return {
    path,
    isDirectory,
  };
};

const list = async dir => {
  const items = await fs.promises
    .readdir(dir)
    .then(items => items.map(item => resolve(dir, item)))
    .then(items => Promise.all(items.map(readItem)));

  const dirs = items.filter(item => item.isDirectory);

  const subItems = await Promise.all(dirs.map(dir => list(dir.path)));

  return items.map(item => item.path).concat(subItems.flat());
};

exports.lsRecurse = async (...sources) => {
  sources = [...new Set(sources.map(source => resolve(source)))];
  const items = await Promise.all(sources.map(list));

  return items.flat();
};
