const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const logger = require("../utils/logger");

const readdirAsync = promisify(fs.readdir);
const copyFileAsync = promisify(fs.copyFile);

const getCopyFilePromises = async (srcdir, dstdir) => {
  const fileNames = await readdirAsync(srcdir);

  let copyFilePromises = [];
  for (const fileName of fileNames) {
    if (path.extname(fileName) === '') {
      await promisify(fs.mkdir)(path.join(dstdir, fileName))
      copyFilePromises = copyFilePromises.concat(await getCopyFilePromises(path.join(srcdir, fileName), path.join(dstdir, fileName)))
    } else if (path.extname(fileName) === '.js') {
      const src = path.join(srcdir, fileName);
      const dest = path.join(dstdir, fileName);

      copyFilePromises.push(copyFileAsync(src, dest));
    }
  }
  return copyFilePromises
}

module.exports = async (nextBuildDir, pluginBuildDirObj) => {
  logger.log("Copying next pages to tmp build folder");

  const pagesBuildDir = path.join(nextBuildDir, "serverless/pages");

  await pluginBuildDirObj.setupBuildDir();

  const copyFilePromises = await getCopyFilePromises(pagesBuildDir, pluginBuildDirObj.buildDir)

  return Promise.all(copyFilePromises);
};
