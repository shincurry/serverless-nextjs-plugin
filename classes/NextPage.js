const path = require("path");

class NextPage {
  constructor(pagePath) {
    this.pagePath = pagePath;
  }

  get pageOriginalPath() {
    return path.join(this.pageDir, `${this.pageName}.original.js`);
  }

  get pageCompatPath() {
    return path.join(this.pageDir, `${this.pageName}.compat.js`);
  }

  get pageDir() {
    return path.dirname(this.pagePath);
  }

  get pageName() {
    return path.basename(this.pagePath, ".js");
  }

  get pageHandler() {
    const dir = path.dirname(this.pagePath);
    return path.join(dir, this.pageName + ".render");
  }

  get packageInclude() {
    return [
      path.join('./', this.pagePath)
    ]
  }

  get httpPath() {
    const httpPath = this.pagePath.replace('sls-next-build/', '').replace('.js', '')
    return httpPath === "index" ? "/" : httpPath
  }

  get functionName() {
    return this.pageName + "Page";
  }

  get serverlessFunction() {
    return {
      [this.functionName]: {
        handler: this.pageHandler,
        package: {
          include: this.packageInclude,
        },
        events: [
          {
            http: {
              path: this.httpPath,
              method: "get"
            }
          }
        ]
      }
    };
  }
}

module.exports = NextPage;
