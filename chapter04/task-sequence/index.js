const asyncFn = process.nextTick;

const task1 = cb => {
  asyncFn(cb);
};

const task2 = cb => {
  asyncFn(() => task1(cb));
};

const task3 = cb => {
  asyncFn(() => task2(cb));
};

task3(() => console.log('Hello'));
