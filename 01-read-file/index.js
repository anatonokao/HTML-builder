const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

fs.readFile(
  path.join(__dirname, 'text.txt'),
  { encoding: 'utf-8' },
  (err, data) => {
    if (err) {
      stdout.write(err);
    } else {
      stdout.write(data);
    }
  },
);
