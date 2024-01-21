const fs = require('fs');
const path = require('path');

const outputFolder = path.join(__dirname, 'project-dist');

const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');

fs.promises.mkdir(outputFolder, { recursive: true }).then(async () => {
  await clearFolder(outputFolder);
  const htmlBundle = await createHtmlBundleFromComponents(
    path.join(__dirname, 'template.html'),
  );
  await fs.promises.writeFile(
    path.join(outputFolder, 'index.html'),
    htmlBundle,
  );

  await copyAssets(assetsPath, path.join(outputFolder, 'assets'));
  await mergeStyles(stylesPath, outputFolder);

  console.log(colorizeText('Page successfully built!', '\x1b[32m'));
  console.log(
    colorizeText('Output is in ', '\x1b[33m') +
      colorizeText(outputFolder, '\x1b[36m'),
  );
});

async function createHtmlBundleFromComponents(srcHtml) {
  let html = await fs.promises.readFile(srcHtml, 'utf-8');
  const componentsNames = html
    .match(/{{\w+}}/g)
    .map((item) => item.replace(/[{}]/g, ''));

  for (const name of componentsNames) {
    const componentPath = path.join(componentsPath, name);
    const componentData = await fs.promises.readFile(
      componentPath + '.html',
      'utf-8',
    );
    html = html.replace(`{{${name}}}`, componentData);
  }

  return html;
}

async function copyAssets(src, target) {
  await fs.promises.mkdir(target, { recursive: true }).then(() => {
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err);
      }

      files.forEach((file) => {
        const currentPath = src + '/' + file.name;
        const targetPath = target + '/' + file.name;

        if (file.isDirectory()) {
          copyAssets(currentPath, targetPath);
        } else {
          fs.copyFile(
            path.join(src, file.name),
            path.join(target, file.name),
            (err) => {
              if (err) {
                console.log(err);
              }
            },
          );
        }
      });
    });
  });
  return true;
}

async function mergeStyles(src, target) {
  const files = await fs.promises.readdir(src, 'utf-8');

  files.forEach(async (file) => {
    await fs.promises.readFile(path.join(src, file), 'utf-8').then((data) => {
      fs.appendFile(path.join(target, 'style.css'), data, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
  return true;
}

async function clearFolder(src) {
  if (await fs.promises.access(src)) {
    await fs.promises.rm(src, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return true;
  }
}

function colorizeText(text, color) {
  return color + text + '\x1b[0m';
}
