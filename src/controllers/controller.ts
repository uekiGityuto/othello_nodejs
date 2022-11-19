import * as readline from 'readline';
import { Address, BLACK, Board, Color, WHITE } from '../models/model';

/**
 * コントローラークラス
 *
 * @class Controller
 */
export class Controller {
  private turn: Color;
  private board: Board;

  /**
   * Creates an instance of Controller.
   * @param {Color} turn
   * @memberof Controller
   */
  constructor(turn: Color) {
    this.turn = turn;
    this.board = new Board();
  }

  /**
   * ターンを交代する
   * 。
   * @memberof Controller
   */
  private changeTurn(): void {
    if (this.turn === BLACK) {
      this.turn = WHITE;
    } else {
      this.turn = BLACK;
    }
  }

  /**
   * 入力値のバリデーションをする。
   *
   * @param {string} input
   * @returns {boolean}
   * @memberof Controller
   */
  private validate(input: string): boolean {
    const inputs = input.split(',');
    if (inputs.length !== 2) {
      return false;
    }
    const x = parseInt(inputs[0].trim(), 10); // 列番号
    const y = parseInt(inputs[1].trim(), 10); // 行番号
    if ((x !== 0 && !x) || (y !== 0 && !y)) {
      return false;
    }
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      return false;
    }

    return true;
  }

  /**
   * ゲーム開始処理（メイン処理）
   *
   * @memberof Controller
   */
  start(): void {
    console.log('石を置きたい場所を「列番号,行番号」の形式で入力して下さい。例）左上隅の場合: 0,0');
    console.log('やめたい時は「Ctrl + d」を押して下さい。');
    console.log('パスをしたい時は「pass」と入力して下さい。');

    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.next(false);
    reader.on('line', (input: string) => {
      if (input === 'pass') {
        console.log('パスしました。');
        this.next(true);
        return;
      }

      if (!this.validate(input)) {
        console.log('入力内容が不正です。');
        console.log('石を置きたい場所を「列番号,行番号」の形式で入力して下さい。例）左上隅の場合: 0,0');
        this.next(false);
        return;
      }

      const inputs = input.split(',');
      const x = parseInt(inputs[0].trim(), 10);
      const y = parseInt(inputs[1].trim(), 10);
      let address = new Address(x, y);
      if (!this.board.put(this.turn, address)) {
        console.log('そこには置けません。');
        this.next(false);
        return;
      }

      this.next(true);
    });

    reader.on('close', () => {
      this.end();
    });
  }

  /**
   * 次の処理
   *
   * @param {boolean} isChange
   * @memberof Controller
   */
  private next(isChange: boolean): void {
    if (isChange) {
      this.changeTurn();
    }
    console.log(this.turn === WHITE ? '[白の番]' : '[黒の番]');
    this.board.draw();
  }

  /**
   * 最後の処理
   *
   * @memberof Controller
   */
  private end(): void {
    const blackNum = this.board.countBlack();
    const whiteNum = this.board.countWhite();
    console.log(`白: ${whiteNum}個`);
    console.log(`黒: ${blackNum}個`);
    if (whiteNum > blackNum) {
      console.log('白の勝利です。');
    } else if (whiteNum < blackNum) {
      console.log('黒の勝利です。');
    } else {
      console.log('引き分けです。');
    }
  }
}
