#!/usr/bin/env node

var args = require('./args').parse();
if(!args.biblio && !args.outfile) {
  console.log("No outfile specified. See --help for more details.");
  process.exit();
}

// requires after arg checking to avoid expensive load times
var ecmarkup = require('../lib/ecmarkup');
var Promise = require('bluebird');
var fs = require('fs');
var readFile = Promise.promisify(fs.readFile);

function fetch(path) {
  return readFile(path, 'utf8');
}

ecmarkup.build(args.infile, fetch).then(function (spec) {
  if(args.biblio) {
    fs.writeFileSync(args.biblio, JSON.stringify(spec.biblio), 'utf8');
  }

  if(args.outfile) {
    fs.writeFileSync(args.outfile, spec.toHTML(), 'utf8');
  }
});
