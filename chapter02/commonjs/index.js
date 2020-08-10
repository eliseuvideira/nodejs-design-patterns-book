const __require = require;
const __resolve = require.resolve;

const fs = __require("fs");

function loadModule(filename, module, require) {
  const source = `
    ((module, exports, require) => {
      ${fs.readFileSync(filename, "utf8")}
    })(module, module.exports, require)
  `;
  eval(source);
}

require = function (moduleName) {
  const path = require.resolve(moduleName);
  if (require.cache[path]) {
    return require.cache[path].exports;
  }

  const module = {
    exports: {},
    path,
  };

  require.cache[path] = module;

  loadModule(path, module, require);

  return module.exports;
};

require.cache = {};
require.resolve = __resolve;

const dependency = require("./hello-world");

console.log(dependency);
