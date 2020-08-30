#!/usr/bin/env node
const yargs = require('yargs');
const { resolve } = require('path');
const fs = require('fs');

const { source } = yargs
  .version('0.1.0')
  .alias('v', 'version')
  .alias('h', 'help')
  .usage('usage: $0 -s <source...>')
  .option('source', {
    alias: 's',
    array: true,
    demandOption: true,
  })
  .strict()
  .help().argv;

const stat = async file => {
  const stats = await fs.promises.stat(file);
  return {
    file,
    isDirectory: stats.isDirectory(),
  };
};

const list = async dir => {
  const fileList = await fs.promises.readdir(dir);

  const files = fileList.map(file => resolve(dir, file));

  const fileStats = await Promise.all(files.map(stat));

  const subdirs = fileStats.filter(({ isDirectory }) => isDirectory);

  const subdirsStats = await Promise.all(
    subdirs.map(subdir => list(subdir.file)),
  );

  return files.concat(subdirsStats.flat());
};

(async (...sources) => {
  sources = [...new Set(sources.map(source => resolve(source)))];
  const items = await Promise.all(sources.map(list));
  console.log(items.flat());
})(...source);
