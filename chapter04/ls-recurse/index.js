#!/usr/bin/env node
const yargs = require('yargs');
const { lsRecurse } = require('./ls-recurse');

const args = yargs
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

lsRecurse(...args.source).then(console.log);
