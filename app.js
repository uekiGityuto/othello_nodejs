const readlineSync = require('readline-sync');

const MAX = 60, MIN = 0;
let value = 30, key;
console.log(`\n\n${(new Array(20)).join(' ')}[Y] <- -> [X]  決定: [q]\n`);
while (true) {
  console.log('\x1B[1A\x1B[K|' +
    (new Array(value + 1)).join('-') + 'O' +
    (new Array(MAX - value + 1)).join('-') + '| ' + value);
  key = readlineSync.keyIn('',
    {hideEchoBack: true, mask: '', limit: 'yxq'});
  if (key === 'y') { if (value > MIN) { value-=2; } }
  else if (key === 'x') { if (value < MAX) { value+=2; } }
  else { break; }
}
console.log(`\nあなたが決めた値: ${value}`);
