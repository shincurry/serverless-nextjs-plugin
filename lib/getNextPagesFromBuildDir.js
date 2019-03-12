const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const logger = require("../utils/logger");
const NextPage = require("../classes/NextPage");

const readdirAsync = promisify(fs.readdir);

const logPages = nextPages => {
  const pageNames = nextPages.map(p => p.pageName);
  logger.log(`Found ${pageNames.length} next page(s)`);
};

const getNextPages = async (dir) => {
  const fileNames = await readdirAsync(dir);

  let nextPages = [];
  for (const fileName of fileNames) {
    if (fileName.startsWith('_')) {
      // do nothing
    } else if (path.extname(fileName) === '') {
      nextPages = nextPages.concat(await getNextPages(path.join(dir, fileName)))
    } else if (path.extname(fileName) === '.js') {
      const pagePath = path.join(dir, fileName);
      const nextPage = new NextPage(pagePath);
      nextPages.push(nextPage)
    }
  }
  return nextPages
}

module.exports = async buildDir => {
  const nextPages = await getNextPages(buildDir)

  logPages(nextPages);

  return nextPages;
};
