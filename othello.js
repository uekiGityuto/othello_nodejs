const readlineSync = require('readline-sync');

console.log("スペースもしくはEnterで石置けます")
console.log("やめたい時はqを押す")
console.log("白の番")

class Board {
  drawBoard() {
    const board = 
    `
      -----------------
      | | | | | | | | |
      -----------------
      | | | | | | | | |
      -----------------
      | | | | | | | | |
      -----------------
      | | | |o|x| | | |
      -----------------
      | | | |x|o| | | |
      -----------------
      | | | | | | | | | 
      -----------------
      | | | | | | | | | 
      -----------------
      | | | | | | | | |
      -----------------
    `
    return board;
  }
}


// function drawBoard_tomoya() {
//   const board = "-----------------";
//   console.log('hello');
//   return board;
// }

// const board = new Board
// drawBoard_tomoya()
// console.log(board.drawBoard());


const MAX = 60, MIN = 0;
let value = 30, key;
console.log(`\n\n${(new Array(20)).join(' ')}[Y] <- -> [X]  決定: [q]\n`);
while (true) {
  console.log('\x1B[1A\x1B[K|' +
    (new Array(value + 1)).join('-') + 'O' + (new Array(MAX - value + 1)).join('-') + '| ' + value);
  key = readlineSync.keyIn('',
    {hideEchoBack: true, mask: '', limit: 'yxpq'});
  if (key === 'y') { if (value > MIN) { value-=2; } }
  else if (key === 'x') { if (value < MAX) { value+=2; } }
  else if (key === 'p') { value = 'O' }
  else if (key === 'q') { break; }
}
console.log(`\nあなたが決めた値: ${value}`);