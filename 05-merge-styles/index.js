const fs = require('fs');
const path = require('path');
const { stdout } = require('node:process');

const stylesDirPath = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesDirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    stdout.write(err);
  } else {
    fs.writeFile(outputFile, '', (err) => {
      if (err) {
        stdout.write(err);
      }
    });

    files.map((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        fs.readFile(path.join(stylesDirPath, file.name), (err, data) => {
          if (err) {
            stdout.write(err);
          } else {
            fs.appendFile(outputFile, data, (err) => {
              if (err) {
                stdout.write(err);
              }
            });
          }
        });
      }
    });
    stdout.write(colorizeText('Styles successfully merged', '\x1b[32m'));
  }
});

function colorizeText(text, color) {
  return color + text + '\x1b[0m';
}
