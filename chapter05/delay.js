const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

console.log(`starting`);
delay(2000)
  .then(() => console.log(`two seconds`))
  .then(() => delay(2000))
  .then(() => console.log(`four seconds`));
