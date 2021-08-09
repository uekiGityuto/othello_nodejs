const readlineSync = require('readline-sync');

console.log("スペースもしくはEnterで石置けます")
console.log("やめたい時はqを押す")
console.log("白の番")

class Color {
  white = -1;
  black = 1;
}

class Stone {
  color; // -1：白石、1：黒石

  constructor(color) {
    this.color = color;
  }

  getStone() {
    if (this.color === -1) {
      return 'o';
    } else if (this.color === 1) {
      return '●';
    } else {
      ' ';
    }
  }
}

class Cell {
  stone = null;

  constructor(color) {
    if (Object.prototype.toString.call(color) === '[object Number]') {
      this.stone = new Stone(color);
    }
  }

  putStone(color) {
    this.stone = new Stone(color);
  }

  drawCell() {
    this.stone = this.stone === null ? ' ' : this.stone.getStone();
    process.stdout.write('|' + this.stone);
  }

  reverseStone() {
    if(this.stone !== null) {
      this.stone.color * -1;
    }
  }
}

class Board {
  line1 = [new Cell(), new Cell(), new Cell(), new Cell()];
  line2 = [new Cell(), new Cell(new Color().black), new Cell(new Color().white), new Cell()];
  line3 = [new Cell(), new Cell(new Color().white), new Cell(new Color().black), new Cell()];
  line4 = [new Cell(), new Cell(), new Cell(), new Cell()];
  // board = [line1, line2, line3, line4];

  drawBoard() {
    this.line2.forEach(cell => cell.drawCell());
  }
}

const board = new Board();
board.drawBoard();

const MAX = 60, MIN = 0;
let value = 0, key;
console.log(`\n\n${(new Array(20)).join(' ')}[y] <- -> [x]  決定: [p]\n`);
while (true) {
  //   console.log('\x1B[1A\x1B[K|' +
  //     (new Array(value + 1)).join('-') + 'O' + (new Array(MAX - value + 1)).join('-') + '| ' + value);
  const board2 = new Board();
  board.drawBoard();
  key = readlineSync.keyIn('',
    { hideEchoBack: true, mask: '', limit: 'yxpq' });
  if (key === 'y') { if (value > MIN) { value--; } }
  else if (key === 'x') { if (value < MAX) { value++; } }
  else if (key === 'q') { break; }
  console.log(value);
}
