const fs = require('fs');
const data = require('./database.json');
const cmd = process.argv[2];

if(cmd === 'add') {
  console.log(Object.keys(data).join('\n'));
} else if(cmd === 'remove') {

} else if(cmd === 'update') {
  
}

function generate() {
  
}


