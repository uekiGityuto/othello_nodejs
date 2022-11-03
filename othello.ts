import { throws } from "assert";
import internal from "stream";

/**
 * 色クラス
 *
 * @class Color
 */
class Color {
  static readonly white = -1;
  static readonly black = 1;

  /**
   * Colorとして妥当かどうかを検証する
   * 
   * @param num 
   * @returns {boolean}
   */
  public static isValid(num: number): boolean {
    return num === Color.white || num === Color.black;
  }
}

/**
 * 石クラス
 *
 * @class Stone
 */
class Stone {
  private color: number; // -1：白石、1：黒石

  /**
   * Creates an instance of Stone.
   * 
   * @param {number} color Colorクラスのメンバ（white or black）
   * @memberof Stone
   * @throws {string} エラーメッセージをスローする
   */
  constructor(color: number) {
    if (!Color.isValid(color)) {
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

  /**
   * 黒かどうか。
   *
   * @returns {boolean}
   * @memberof Stone
   */
     isBlack(): boolean {
      return this.color === Color.black ? true : false;
    }
  
    /**
     * 白かどうか。
     *
     * @returns {boolean}
     * @memberof Stone
     */
    isWhite(): boolean {
      return this.color === Color.white ? true : false;
    }

  /**
   * 反転する。
   *
   * @memberof Stone
   */
  reverse() {
      this.color *= -1;
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
   * Creates an instance of Cell.
   * 
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
      this.stone.reverse();
    }
  }

  /**
    * マスに石が置かれていないかどうか。
    *
    * @returns {boolean}
    * @memberof Cell
    */
  isNone(): boolean {
    return this.stone === null
  }

  /**
   * マスに置いてある石が黒かどうか。
   *
   * @returns {boolean}
   * @memberof Cell
   */
  isBlack(): boolean {
    return this.stone === null ? false : (this.stone.isBlack() ? true : false);
  }

  /**
   * マスに置いてある石が白かどうか。
   *
   * @returns {boolean}
   * @memberof Cell
   */
  isWhite(): boolean {
    return this.stone === null ? false : (this.stone.isWhite() ? true : false);
  }


}

/**
 * 座標クラス
 *
 * @class Address
 */
class Address {
  x: number;
  y: number;

  /**
   * Creates an instance of Address.
   * 
   * @param {number} x
   * @param {number} y
   * @memberof Address
   */
  constructor(x: number, y: number) {
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      throw new Error(`0から7の数字を指定して下さい。`);
    }
    this.x = x;
    this.y = y;
  }
}

/**
 * ボードクラス
 *
 * @class Board
 */
class Board {
  private board: Cell[][];

  /**
   * Creates an instance of Board.
   * 
   * @memberof Board
   */
  constructor() {
    this.board = [...Array(8)].map(_ => {return [...Array(8)].map(_ => new Cell())});
    this.board[3][3].put(Color.black);
    this.board[3][4].put(Color.white);
    this.board[4][3].put(Color.white);
    this.board[4][4].put(Color.black);
  }

  /**
   * ボードを描写する。
   *
   * @memberof Board
   */
  draw(): void {
    console.log('  0 1 2 3 4 5 6 7');
    this.board.forEach((row, i) => {
      process.stdout.write(String(i));
      row.forEach(cell => cell.draw());
      process.stdout.write('|\n');
    })
  }

  /**
   * 石を置けるかどうか判断し、置ける場合は置く。また、周囲の石を反転する。
   * 石を置けた場合はtrue、置けない場合はfalseを返す。
   *
   * @param {number} turn 色（白 or 黒)
   * @param {string} input ユーザ入力値（「列番号,行番号」の形式を期待）
   * @returns {boolean} 選択したマスに石を置けたかどうか
   * @memberof Board
   */
  put(turn: number, input: string): boolean {
    if (!Color.isValid(turn)) {
      console.log('手番が不正です。');
      return false;
    }
    const inputs = input.split(',');
    if (inputs.length !== 2) {
      console.log('「列番号,行番号」の形式で入力して下さい');
      return false;
    }
    const x = parseInt(inputs[0], 10); // 列番号
    const y = parseInt(inputs[1], 10); // 行番号
    if ((x !== 0 && !x) || (y !== 0 && !y)) {
      console.log('「数字,数字」の形式で入力して下さい');
      return false;
    }
    let address: Address
    try {
      address = new Address(x, y);
    } catch {
      console.log('正しい番地を入力して下さい');
      return false;
    }

    const targets = this.search(turn, address);
    if (targets.length === 0) {
      console.log('そこには置けません。')
      return false;
    }

    this.refCell(address).put(turn);
    targets.forEach(t => {
      this.refCell(t).reverse();
    })
    return true;
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
   * 座標から対象のマスを取得する。
   * 
   * @param address 座標 
   * @returns {Cell}
   */
  private refCell(address: Address): Cell {
    return this.board[address.y][address.x];
  }

  private search(turn: number, startPoint: Address): Address[] {
    if (!Color.isValid(turn)) {
      return [];
    }
    const searchFunc = (current: Address, list: Address[], nextFunc: (address: Address) => Address): Address[] => {
      let nextAddress: Address
      try {
        nextAddress = nextFunc(current);
      } catch {
        return [];
      }
      const nextCell = this.refCell(nextAddress);
      if (nextCell.isNone()) {
        return [];
      }
      if ((nextCell.isBlack() && turn === Color.white) || (nextCell.isWhite() && turn === Color.black)) {
        list.push(nextAddress);
        return searchFunc(nextAddress, list, nextFunc);
      }
      return list;
    }

    let results: Address[] = [];
    results = results.concat(searchFunc(startPoint, [], (address) => { return new Address(address.x, address.y - 1) }))
    results = results.concat(searchFunc(startPoint, [], (address) => { return new Address(address.x, address.y + 1) }))
    results = results.concat(searchFunc(startPoint, [], (address) => { return new Address(address.x - 1, address.y) }))
    results = results.concat(searchFunc(startPoint, [], (address) => { return new Address(address.x + 1, address.y) }))
    results = results.concat(searchFunc(startPoint, [], (address) => { return new Address(address.x - 1, address.y - 1) }))
    results = results.concat(searchFunc(startPoint, [], (address) => { return new Address(address.x + 1, address.y - 1) }))
    results = results.concat(searchFunc(startPoint, [], (address) => { return new Address(address.x - 1, address.y + 1) }))
    results = results.concat(searchFunc(startPoint, [], (address) => { return new Address(address.x + 1, address.y + 1) }))

    return results;
  }

}

//----------------
// メイン処理
//----------------
console.log('石を置きたい場所を「列番号,行番号」の形式で入力して下さい。例）左上隅の場合：0,0');
console.log('やめたい時は「Ctrl + d」を押して下さい。');
console.log('パスをしたい時は「pass」と入力して下さい。');

let turn = Color.white;
console.log(turn === Color.white ? '[白の番]' : '[黒の番]');
const board = new Board();
board.draw();

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
