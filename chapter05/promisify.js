const promisify = cb => (...args) =>
  new Promise((resolve, reject) =>
    cb(...args, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    }),
  );

const crypto = require('crypto');

const randomBytes = promisify(crypto.randomBytes);

randomBytes(32).then(buffer => console.log(buffer.toString('base64')));
