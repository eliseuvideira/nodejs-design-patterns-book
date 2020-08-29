#!/usr/bin/env node
const yargs = require('yargs');
const { resolve } = require('path');
const fs = require('fs');

const { source, output } = yargs
  .version('0.1.0')
  .alias('v', 'version')
  .alias('h', 'help')
  .usage('usage: $0 -s <source...> -o <output>')
  .option('source', {
    alias: 's',
    array: true,
    demandOption: true,
  })
  .option('output', {
    alias: 'o',
    string: true,
    demandOption: true,
  })
  .strict()
  .help().argv;

(async (output, ...sources) => {
  const files = [...new Set(sources.map(source => resolve(source)))];

  const contents = await Promise.all(
    files.map(file => fs.promises.readFile(file)),
  );

  const fileContents = contents.join('\n');

  await fs.promises.writeFile(resolve(output), fileContents);
})(output, ...source).catch(err => {
  console.error(err);
  process.exit(1);
});
