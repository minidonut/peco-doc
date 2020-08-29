const fs = require('fs');
const path = require('path');
const data = require('./database.json');
const base = __dirname;
const cmd = process.argv[2];
const input = process.argv[3];

async function main() {
  if(cmd === 'add') {
    process.stdout.write('key - ');
    const key = await getPipeIn();
    process.stdout.write('url - ');
    const url = await getPipeIn();
    process.stdout.write('description - ');
    const description = await getPipeIn();

    data[key] = { url, description };
    
    console.log('\n  saved 👍\n', );
    save();
  } else if(cmd === 'remove') {
    console.log('remove: TBD');
    save();
  } else if(cmd === 'update') {
    console.log('update: TBD');
    save();
  } else if(cmd === 'get') {
    const { url } = data[input.split(' ')[0].trim()];
    console.log(url);
  } else if(cmd === 'generate') {
    generate();
  }
}

function save() {
  fs.writeFileSync('./database.json', JSON.stringify(data, undefined, 2));
  generate();
}

function generate() {
  const arr = Object.entries(data);
  const maxKeyLength = arr.reduce((acc, [key]) => Math.max(acc, key.length) ,0);
  const print = (key, desc) => `${key.padEnd(maxKeyLength + 2)}  ${desc}`;

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

main();


