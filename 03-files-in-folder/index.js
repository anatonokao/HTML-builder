const fs = require('node:fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log(err);
    }
    files.map(async (file) => {
      if (file.isFile()) {
        const extend = path.extname(file.name);
        const fileName = path.basename(file.name, extend);
        const fileSize = await fs.promises
          .stat(path.join(__dirname, 'secret-folder', file.name))
          .then((stat) => stat.size);
        console.log(
          colorizeText(fileName, '\x1b[36m'),
          '-',
          colorizeText(extend.replace('.', ''), '\x1b[32m'),
          '-',
          colorizeText(fileSize * 0.001 + 'kb', '\x1b[33m'),
        );
      }
    });
  },
);

function colorizeText(text, color) {
  return color + text + '\x1b[0m';
}
