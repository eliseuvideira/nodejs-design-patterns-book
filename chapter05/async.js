const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('start');
  await delay(2000);
  console.log('two seconds');
  await delay(2000);
  console.log('four seconds');
})();
