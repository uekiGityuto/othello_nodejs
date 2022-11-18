export const WHITE = Symbol();
export const BLACK = Symbol();
export type Color = typeof WHITE | typeof BLACK;

/**
 * 石クラス
 *
 * @class Stone
 */
export class Stone {
    private color: Color;

    /**
     * Creates an instance of Stone.
     *
     * @param {Color} color
     * @memberof Stone
     */
    constructor(color: Color) {
        this.color = color;
    }

    /**
     * 石を返す。
     *
     * @returns {string}
     * @memberof Stone
     */
    get(): string {
        if (this.color === WHITE) {
            return 'o';
        } else {
            return '●';
        }
    }

    /**
     * 黒かどうか。
     *
     * @returns {boolean}
     * @memberof Stone
     */
    isBlack(): boolean {
        return this.color === BLACK ? true : false;
    }

    /**
     * 反転する。
     *
     * @memberof Stone
     */
    reverse(): void {
        if (this.color === BLACK) {
            this.color = WHITE;
        } else {
            this.color = BLACK;
        }
    }
}

/**
 * マスクラス
 *
 * @class Cell
 */
export class Cell {
    private stone: Stone | null;

    /**
     * Creates an instance of Cell.
     *
     * @param {Color} color
     * @memberof Cell
     */
    constructor(color?: Color) {
        if (color) {
            this.stone = new Stone(color);
        } else {
            this.stone = null;
        }
    }

    /**
     * マスに石を置く。
     *
     * @param {Color} color
     * @memberof Cell
     */
    put(color: Color): void {
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
    reverse(): void {
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
        return this.stone === null;
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
        return this.stone === null ? false : (this.stone.isBlack() ? false : true);
    }
}

/**
 * 座標クラス
 *
 * @class Address
 */
export class Address {
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
        this.x = x;
        this.y = y;
    }

    /**
     * 座標が妥当かどうか
     *
     * @returns {boolean}
     * @memberof Address
     */
    isValid(): boolean {
        if (this.x < 0 || this.x > 7 || this.y < 0 || this.y > 7) {
            return false;
        }
        return true;
    }
}

/**
 * ボードクラス
 *
 * @class Board
 */
export class Board {
    private board: Cell[][];

    /**
     * Creates an instance of Board.
     *
     * @memberof Board
     */
    constructor() {
        this.board = [...Array(8)].map(_ => { return [...Array(8)].map(_ => new Cell()) });
        this.board[3][3].put(BLACK);
        this.board[3][4].put(WHITE);
        this.board[4][3].put(WHITE);
        this.board[4][4].put(BLACK);
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
     * @param {Color} color 色（白 or 黒)
     * @param {Address} address 石を置くマスの座標
     * @returns {boolean} 選択したマスに石を置けたかどうか
     *
     * @memberof Board
     */
    put(color: Color, address: Address): boolean {
        const targets = this.search(color, address);
        if (targets.length === 0) {
            return false;
        }

        this.refCell(address).put(color);
        targets.forEach(t => {
            this.refCell(t).reverse();
        })
        return true;
    }

    /**
     * 黒石の数を返す。
     *
     * @returns {number}
     * @memberof Board
     */
    countBlack(): number {
        let count = 0;
        this.board.forEach(line => {
            line.forEach(cell => {
                count += cell.isBlack() ? 1 : 0;
            });
        });
        return count;
    }

    /**
     * 白石の数を返す。
     *
     * @returns {number}
     * @memberof Board
     */
    countWhite(): number {
        let count = 0;
        this.board.forEach(line => {
            line.forEach(cell => {
                count += cell.isWhite() ? 1 : 0;
            });
        });
        return count;
    }

    /**
     * 座標から対象のマスを取得する。
     *
     * @private
     * @param {Address} address
     * @returns {Cell}
     * @memberof Board
     */
    private refCell(address: Address): Cell {
        return this.board[address.y][address.x];
    }

    /**
     * 裏返せる石があるかどうか探索する。
     *
     * @private
     * @param {Color} turn
     * @param {Address} startPoint
     * @returns {Address[]}
     * @memberof Board
     */
    private search(turn: Color, startPoint: Address): Address[] {
        const searchFunc = (current: Address, list: Address[], nextFunc: (address: Address) => Address): Address[] => {
            const nextAddress = nextFunc(current);
            if (!nextAddress.isValid()) {
                return [];
            }
            const nextCell = this.refCell(nextAddress);
            if (nextCell.isNone()) {
                return [];
            }
            if ((nextCell.isBlack() && turn === WHITE) || (nextCell.isWhite() && turn === BLACK)) {
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