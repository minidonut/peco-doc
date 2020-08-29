const fs = require('fs');
const path = require('path');
const data = require('./database.json');
const base = __dirname;
const cmd = process.argv[2];
const input = process.argv[3];

if(cmd === 'add') {
  console.log(Object.keys(data).join('\n'));
} else if(cmd === 'remove') {
  console.log('remove: TBD');
} else if(cmd === 'update') {
  console.log('update: TBD');
} else if(cmd === 'get') {
  const { url } = data[input.split(' ')[0].trim()];
  console.log(url);
} else if(cmd === 'generate') {
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


