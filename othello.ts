/**
 * 色クラス
 *
 * @class Color
 */
class Color {
  static readonly white = -1;
  static readonly black = 1;
}

/**
 * 石クラス
 *
 * @class Stone
 */
class Stone {
  color: number; // -1：白石、1：黒石

  /**
   *Creates an instance of Stone.
   * @param {number} color Colorクラスのメンバ（white or black）
   * @memberof Stone
   * @throws {string} エラーメッセージをスローする
   */
  constructor(color: number) {
    if(color !== Color.white && color !== Color.black) {
      throw new Error(`引数には${Color.white}か${Color.black}を指定して下さい。`);
    }
    this.color = color;
  }

  /**
   * 石を返す。石がない場合は半角スペースを返す。
   *
   * @returns {string}
   * @memberof Stone
   */
  get(): string {
    if (this.color === Color.white) {
      return 'o';
    } else if (this.color === Color.black) {
      return '●';
    } else {
      return ' ';
    }
  }
}

/**
 * マスクラス
 *
 * @class Cell
 */
class Cell {
  private stone: Stone | null;

  /**
   *Creates an instance of Cell.
   * @param {number} [color]
   * @memberof Cell
   */
  constructor(color?: number) {
    if (color) {
      this.stone = new Stone(color);
    } else {
      this.stone = null;
    }
  }

  /**
   * マスに石を置く。
   *
   * @param {number} color
   * @memberof Cell
   */
  put(color: number): void {
    this.stone = new Stone(color);
  }

  /**
   * マスを描写する。
   *
   * @memberof Cell
   */
  draw(): void {
    const stone = this.stone === null ? ' ' : this.stone.get();
    process.stdout.write('|' + stone);
  }

  /**
   * マスに置いてある石を反転する。
   *
   * @memberof Cell
   */
  reverse() {
    if (this.stone !== null) {
      this.stone.color *= -1;
    }
  }

  /**
   * マスに置いてある石が黒かどうか。
   *
   * @returns {boolean}
   * @memberof Cell
   */
  isBlack(): boolean {
    return this.stone === null ? false : (this.stone.color === Color.black ? true : false);
  }

  /**
   * マスに置いてある石が白かどうか。
   *
   * @returns {boolean}
   * @memberof Cell
   */
  isWhite(): boolean {
    return this.stone === null ? false : (this.stone.color === Color.white ? true : false);
  }
}

/**
 * ボードクラス
 *
 * @class Board
 */
class Board {
  private line1 = [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()];
  private line2 = [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()];
  private line3 = [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()];
  private line4 = [new Cell(), new Cell(), new Cell(), new Cell(Color.black), new Cell(Color.white), new Cell(), new Cell(), new Cell()];
  private line5 = [new Cell(), new Cell(), new Cell(), new Cell(Color.white), new Cell(Color.black), new Cell(), new Cell(), new Cell()];
  private line6 = [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()];
  private line7 = [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()];
  private line8 = [new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell(), new Cell()];

  private board = [this.line1, this.line2, this.line3, this.line4, this.line5, this.line6, this.line7, this.line8];

  /**
   * ボードを描写する。
   *
   * @memberof Board
   */
  draw(): void {
    console.log('  0 1 2 3 4 5 6 7');
    this.board.forEach((line, i) => {
      process.stdout.write(String(i));
      line.forEach(cell => cell.draw());
      process.stdout.write('|\n');
    })
  }

  /**
   * 石を置けるかどうか判断し、置ける場合は置く。また、周囲の石を反転する。
   * 石を置けた場合はtrue、置けない場合はfalseを返す。
   *
   * @param {number} turn 色（白 or 黒)
   * @param {string} input ユーザ入力値（「行番号,列番号」の形式を期待）
   * @returns {boolean} 選択したマスに石を置けたかどうか
   * @memberof Board
   */
  put(turn: number, input: string): boolean {
    const address = input.split(',');
    if (address.length !== 2) {
      console.log('「行番号,列番号」の形式で入力して下さい');
      return false;
    }
    const v = parseInt(address[0], 10); // 行番号
    const h = parseInt(address[1], 10); // 列番号
    if (!v || !h) {
      console.log('「数字,数字」の形式で入力して下さい');
      return false;
    }

    let canPut = false;

    if (v >= 0) {
      // 左方向に探索して、反転出来る石（対戦相手の石）を取得
      const leftCells = this.getCanReverseLeftCells(v, h, turn);
      if (leftCells.length > 0) {
        canPut = true;
        leftCells.forEach(cell => {
          cell.reverse();
        });
      }
    }
    if (v <= 7) {
      // 右方向に探索して、反転出来る石（対戦相手の石）を取得
      const rightCells = this.getCanReverseRightCells(v, h, turn);
      if (rightCells.length > 0) {
        canPut = true;
        rightCells.forEach(cell => {
          cell.reverse();
        });
      }
    }
    if (h >= 0) {
      // 上方向に探索して、反転出来る石（対戦相手の石）を取得
      const upCells = this.getCanReverseUpCells(v, h, turn);
      if (upCells.length > 0) {
        canPut = true;
        upCells.forEach(cell => {
          cell.reverse();
        });
      }
    }
    if (h <= 7) {
      // 下方向に探索して、反転出来る石（対戦相手の石）を取得
      const downCells = this.getCanReverseDownCells(v, h, turn);
      if (downCells.length > 0) {
        canPut = true;
        downCells.forEach(cell => {
          cell.reverse();
        });
      }
    }

    if (canPut) {
      // 石を置く
      const selectedCell = this.board[v][h];
      selectedCell.put(turn);
      return true;
    } else {
      console.log('そこには置けません。')
      return false;
    }
  }

  /**
   * 結果を描写する。
   *
   * @memberof Board
   */
  displayResult(): void {
    let whiteNum = 0;
    let blackNum = 0;
    this.board.forEach(line => {
      line.forEach(cell => {
        whiteNum += cell.isWhite() ? 1 : 0;
        blackNum += cell.isBlack() ? 1 : 0;
      });
    });

    console.log(`白：${whiteNum}個`);
    console.log(`黒：${blackNum}個`);
    if (whiteNum > blackNum) {
      console.log('白の勝利です。');
    } else if (whiteNum < blackNum) {
      console.log('黒の勝利です。');
    } else {
      console.log('引き分けです。');
    }
  }

  /**
   * 左方向に探索して、反転出来る石（対戦相手の石）を取得する。
   *
   * @private
   * @param {number} v 行番号
   * @param {number} h 列番号
   * @param {number} turn 色（白 or 黒)
   * @returns {Cell[]}
   * @memberof Board
   */
  private getCanReverseLeftCells(v: number, h: number, turn: number): Cell[] {
    let canReverseCells: Cell[] = [];
    let opponentCells: Cell[] = [];
    // 左方向に順番に確認する
    for (let i = h - 1; i > 0; i--) {
      const aroundCell = this.board[v][i];
      if (turn === Color.white) { // 白の番の場合
        if (aroundCell.isBlack()) {
          opponentCells.push(aroundCell);
        } else if (aroundCell.isWhite() && opponentCells.length > 0) {
          canReverseCells = opponentCells;
        } else {
          break;
        }
      } else { // 黒の番の場合
        if (aroundCell.isWhite()) {
          opponentCells.push(aroundCell);
        } else if (aroundCell.isBlack() && opponentCells.length > 0) {
          canReverseCells = opponentCells;
        } else {
          break;
        }
      }
    }
    return canReverseCells;
  }


  /**
   * 右方向に探索して、反転出来る石（対戦相手の石）を取得する。
   *
   * @private
   * @param {number} v 行番号
   * @param {number} h 列番号
   * @param {number} turn 色（白 or 黒)
   * @returns {Cell[]}
   * @memberof Board
   */
  private getCanReverseRightCells(v: number, h: number, turn: number): Cell[] {
    let canReverseCells: Cell[] = [];
    let opponentCells: Cell[] = [];
    // 右方向に順番に確認する
    for (let i = h + 1; i < 8; i++) {
      const aroundCell = this.board[v][i];
      if (turn === Color.white) { // 白の番の場合
        if (aroundCell.isBlack()) {
          opponentCells.push(aroundCell);
        } else if (aroundCell.isWhite() && opponentCells.length > 0) {
          canReverseCells = opponentCells;
        } else {
          break;
        }
      } else { // 黒の番の場合
        if (aroundCell.isWhite()) {
          opponentCells.push(aroundCell);
        } else if (aroundCell.isBlack() && opponentCells.length > 0) {
          canReverseCells = opponentCells;
        } else {
          break;
        }
      }
    }
    return canReverseCells;
  }

  /**
   * 上方向に探索して、反転出来る石（対戦相手の石）を取得する。
   *
   * @private
   * @param {number} v 行番号
   * @param {number} h 列番号
   * @param {number} turn 色（白 or 黒)
   * @returns {Cell[]}
   * @memberof Board
   */
  private getCanReverseUpCells(v: number, h: number, turn: number): Cell[] {
    let canReverseCells: Cell[] = [];
    let opponentCells: Cell[] = [];
    // 上方向に順番に確認する
    for (let i = v - 1; i > 0; i--) {
      const aroundCell = this.board[i][h];
      if (turn === Color.white) { // 白の番の場合
        if (aroundCell.isBlack()) {
          opponentCells.push(aroundCell);
        } else if (aroundCell.isWhite() && opponentCells.length > 0) {
          canReverseCells = opponentCells;
        } else {
          break;
        }
      } else { // 黒の番の場合
        if (aroundCell.isWhite()) {
          opponentCells.push(aroundCell);
        } else if (aroundCell.isBlack() && opponentCells.length > 0) {
          canReverseCells = opponentCells;
        } else {
          break;
        }
      }
    }
    return canReverseCells;
  }

  /**
   * 下方向に探索して、反転出来る石（対戦相手の石）を取得する。
   *
   * @private
   * @param {number} v 行番号
   * @param {number} h 列番号
   * @param {number} turn 色（白 or 黒)
   * @returns {Cell[]}
   * @memberof Board
   */
  private getCanReverseDownCells(v: number, h: number, turn: number): Cell[] {
    let canReverseCells: Cell[] = [];
    let opponentCells: Cell[] = [];
    // 上方向に順番に確認する
    for (let i = v + 1; i < 8; i++) {
      const aroundCell = this.board[i][h];
      if (turn === Color.white) { // 白の番の場合
        if (aroundCell.isBlack()) {
          opponentCells.push(aroundCell);
        } else if (aroundCell.isWhite() && opponentCells.length > 0) {
          canReverseCells = opponentCells;
        } else {
          break;
        }
      } else { // 黒の番の場合
        if (aroundCell.isWhite()) {
          opponentCells.push(aroundCell);
        } else if (aroundCell.isBlack() && opponentCells.length > 0) {
          canReverseCells = opponentCells;
        } else {
          break;
        }
      }
    }
    return canReverseCells;
  }
}

//----------------
// メイン処理
//----------------
console.log('石を置きたい場所を「行番号,列番号」の形式で入力して下さい。例）左上隅の場合：0,0');
console.log('やめたい時は「Ctrl + d」を押して下さい。');
console.log('パスをしたい時は「pass」と入力して下さい。');

let turn = Color.white;
console.log(turn === Color.white ? '[白の番]' : '[黒の番]');
const board = new Board();
board.draw();

let inputs: string[] = [];
const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// 標準入力時の処理
reader.on('line', function (input: string) {
  if (input === 'pass') {
    console.log('パスしました。');
    turn *= -1;
  } else {
    const couldPut = board.put(turn, input);
    if (couldPut) {
      turn *= -1;
    }
  }
  console.log(turn === Color.white ? '[白の番]' : '[黒の番]');
  board.draw();
});

// 終了時の処理
reader.on('close', function () {
  board.displayResult();
});
