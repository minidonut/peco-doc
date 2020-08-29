#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const base = __dirname;
const cmd = process.argv[2];
const data = require('./database.json');

const { spawnSync } = require('child_process');

const filePath = {
  generated: path.join(__dirname, 'generated'),
  database: path.join(__dirname, 'database.json')
}

const color = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',

  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function peco() {
  const selected = spawnSync('peco', [filePath.generated, '--layout=bottom-up'])
    .stdout
    .toString()
    .trim();
  if(!selected) {
    process.exit(0);
  }
  return selected;
}

function save() {
  fs.writeFileSync(filePath.database, JSON.stringify(data, undefined, 2));
  generate();
}

function generate() {
  const arr = Object.entries(data);
  const maxKeyLength = arr.reduce((acc, [key]) => Math.max(acc, key.length) ,0);
  const print = (key, desc) => `${key.padEnd(maxKeyLength)}  ${desc}`;

  fs.writeFileSync(
    path.join(__dirname, 'generated'),
    arr.map(([key, { description: desc }]) => print(key, desc)).join('\n')
  );
}

async function getPipeIn() {
  process.stdin.resume();
  return new Promise(resolve => {
    process.stdin.on('data', function (chunk) {
      process.stdin.pause();
      resolve((chunk + "").trim());
    });
  });
};

async function main() {
  if(cmd === 'add') {
    process.stdout.write(`(${color.green}key${color.reset}) `);
    const key = await getPipeIn();
    // validate key
    if(key.split(' ').length > 1) {
      console.error('key should have no space 😔');
      process.exit(1);
    } else if (!key) {
      console.error('key must be specified 😔');
      process.exit(1);
    } else if (key in data) {
      console.error(`'${key}' is already exist. run 'doc update' 😔`);
      process.exit(1);
    }

    process.stdout.write(`(${color.green}url${color.reset}) `);
    const url = await getPipeIn();
    // validate url
    if (!url) {
      console.error('url must be specified 😔');
      process.exit(1);
    }

    process.stdout.write(`(${color.green}description${color.reset}) `);
    const description = await getPipeIn();

    data[key] = { url, description };
    console.log('\n  saved 👍\n', );
    save();
  } else if(cmd === 'generate') {
    generate();
  } else {

    const selected = peco();
    const key = selected.split(' ')?.[0].trim();
    if(!key in data) {
      console.error(`cannot find ${key} in database  😔`);
      process.exit(1);
    }

    if(cmd === 'rm') {
      console.log(`(${color.green}key${color.reset}) ${key}
(${color.green}url${color.reset}) ${data[key].url}
(${color.green}description${color.reset}) ${data[key].description}`)
      delete data[key];
      save();
      console.log('\n  deleted 👍\n', );
    } else if(cmd === 'update') {
      console.log('update: TBD');

      process.stdout.write(`(${color.green}url${color.reset}) ${color.dim}${data[key].url}${color.reset}
   -> `);
      const url = await getPipeIn();

      process.stdout.write(`(${color.green}description${color.reset}) ${color.dim}${data[key].description}${color.reset}
           -> `);
      const description = await getPipeIn();

      if(url) data[key].url = url;
      data[key].description = description;

      save();
    }else {
      spawnSync('open', [data[key].url]);
    }
  }
}

main();


