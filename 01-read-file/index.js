const fs = require('fs');
const path = require('path');
const { stdout } = require('node:process');

const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
rs.on('data', (chunk) => {
  stdout.write(colorizeText(chunk, '\x1b[32m'));
  rs.close();
});

function colorizeText(text, color) {
  return color + text + '\x1b[0m';
}
