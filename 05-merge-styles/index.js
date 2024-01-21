const fs = require('fs');
const path = require('path');

const stylesDirPath = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesDirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    fs.writeFile(outputFile, '', (err) => {
      if (err) {
        console.log(err);
      }
    });

    files.map((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        fs.readFile(path.join(stylesDirPath, file.name), (err, data) => {
          if (err) {
            console.log(err);
          } else {
            fs.appendFile(outputFile, data, (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
        });
      }
    });
    console.log(colorizeText('Styles successfully merged', '\x1b[32m'));
  }
});

function colorizeText(text, color) {
  return color + text + '\x1b[0m';
}
