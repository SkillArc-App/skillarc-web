const fs = require('fs');
const path = require('path');

const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file.name}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(`${path.join(dirPath, '/', file.name)}`);
    }
  });
  return arrayOfFiles;
};

const specs = getAllFiles('cypress/e2e');
process.stdout.write(`${JSON.stringify(specs)}\n`);
