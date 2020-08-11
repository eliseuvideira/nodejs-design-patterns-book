function addCps(a, b, cb) {
  cb(a + b);
}

console.log("before");
addCps(1, 2, console.log);
addCps("Hello", " World", console.log);
console.log("after");
