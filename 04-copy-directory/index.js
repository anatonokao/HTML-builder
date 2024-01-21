const fs = require('fs');
const path = require('path');
const { stdout } = require('node:process');

const ORIGINAL_FOLDER_PATH = path.join(__dirname, 'files');
const COPY_FOLDER_PATH = path.join(__dirname, 'files-copy');

fs.promises
  .mkdir(COPY_FOLDER_PATH, { recursive: true })
  .then(() => {
    fs.readdir(COPY_FOLDER_PATH, { withFileTypes: true }, (err, files) => {
      if (err) stdout.write(err);

      files.map((file) => {
        fs.unlink(path.join(file.path, file.name), (err) => {
          if (err) stdout.write(err);
        });
      });
    });

    fs.readdir(ORIGINAL_FOLDER_PATH, { withFileTypes: true }, (err, files) => {
      if (err) stdout.write(err);

      files.map((file) => {
        if (file.isFile()) {
          const copyFilePath = path.join(COPY_FOLDER_PATH, file.name);

          fs.copyFile(
            path.join(ORIGINAL_FOLDER_PATH, file.name),
            copyFilePath,
            (err) => {
              if (err) stdout.write(err);
            },
          );
        }
      });
    });
    stdout.write(colorizeText('Succesfully copied!', '\x1b[32m') + '\n');
  })
  .catch((err) => console.log(err));

function colorizeText(text, color) {
  return color + text + '\x1b[0m';
}
