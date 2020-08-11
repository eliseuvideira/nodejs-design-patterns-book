function addCps(a, b, cb) {
  setTimeout(() => cb(a + b), 0);
}

console.log("before");
addCps(1, 2, console.log);
addCps("Hello", " World", console.log);
console.log("after");
