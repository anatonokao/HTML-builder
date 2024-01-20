const fs = require('fs');
const path = require('path');
const process = require('node:process');

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) {
    process.stdout.write(err);
  } else {
    process.stdout.write(colorizeText('Hey, write something: ', '\x1b[36m'));

    process.on('SIGINT', () => {
      process.stdout.write(colorizeText('\nBye!\n', '\x1b[36m'));
      process.exit();
    });

    process.openStdin().on('data', (data) => {
      if (data.toString().trim() === 'exit') {
        process.stdout.write(colorizeText('\nBye!\n', '\x1b[36m'));
        process.exit();
      }
      fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
        if (err) {
          process.stdout.write(colorizeText(err, '\x1b[31m'));
        } else {
          process.stdout.write(colorizeText('Success wrote!\n', '\x1b[32m'));
          process.stdout.write(colorizeText('\nWrite something: ', '\x1b[36m'));
        }
      });
    });
  }
});

function colorizeText(text, color) {
  return color + text + '\x1b[0m';
}
