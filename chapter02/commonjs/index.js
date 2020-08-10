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
  const id = require.resolve(moduleName);
  if (require.cache[id]) {
    return require.cache[id].exports;
  }

  const module = {
    exports: {},
    path: id,
  };

  require.cache[id] = module;

  loadModule(id, module, require);

  return module.exports;
};

require.cache = {};
require.resolve = __resolve;

const dependency = require("./hello-world");

console.log(dependency);
