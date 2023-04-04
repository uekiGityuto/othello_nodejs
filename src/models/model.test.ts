import { Address, BLACK, Board, Cell, WHITE } from './model';

jest.spyOn(console, 'log');
jest.spyOn(process.stdout, 'write');

describe('マスのテスト', () => {
  test('空のマスを描写できること', () => {
    const cell = new Cell();
    cell.draw();
    expect(process.stdout.write).toBeCalledWith('| ');
  });

  test('黒石が置かれたマスを描写できること', () => {
    const cell = new Cell(BLACK);
    cell.draw();
    expect(process.stdout.write).toBeCalledWith('|●');
  });

  test('白石が置かれたマスを描写できること', () => {
    const cell = new Cell(WHITE);
    cell.draw();
    expect(process.stdout.write).toBeCalledWith('|o');
  });

  test('マスに黒石を置けること', () => {
    const cell = new Cell();
    cell.put(BLACK);

    cell.draw();
    expect(process.stdout.write).toBeCalledWith('|●');
  });

  test('マスに白石を置けること', () => {
    const cell = new Cell();
    cell.put(WHITE);

    cell.draw();
    expect(process.stdout.write).toBeCalledWith('|o');
  });

  test('マスに石が置かれていないか判定できること', () => {
    const cell = new Cell();
    expect(cell.isNone()).toBe(true);
  });

  test('マスに黒石が置かれているかどうか判定できること', () => {
    const cellWithBlack = new Cell(BLACK);
    const cellWithWhite = new Cell(WHITE);
    expect(cellWithBlack.isBlack()).toBeTruthy();
    expect(cellWithWhite.isBlack()).toBeFalsy();
  });

  test('マスに白石が置かれているかどうか判定できること', () => {
    const cellWithBlack = new Cell(BLACK);
    const cellWithWhite = new Cell(WHITE);
    expect(cellWithBlack.isWhite()).toBeFalsy();
    expect(cellWithWhite.isWhite()).toBeTruthy();
  });

  test('マスに置かれた白石を反転できること', () => {
    const cell = new Cell();
    cell.put(WHITE);
    cell.reverse();

    cell.draw();
    expect(process.stdout.write).toBeCalledWith('|●');
  });

  test('マスに置かれた黒石を反転できること', () => {
    const cell = new Cell();
    cell.put(BLACK);
    cell.reverse();

    cell.draw();
    expect(process.stdout.write).toBeCalledWith('|o');
  });
});

describe('盤面のテスト', () => {
  test('盤面を描写できること', () => {
    const board = new Board();
    board.draw();

    // TODO: 想定通りの盤面が描写されているかの確認を書きたい
    expect(console.log).toBeCalledWith('  0 1 2 3 4 5 6 7');
  });

  test('黒石を白石で挟める場所に白石を置けること', () => {
    const board = new Board();
    const result = board.put(WHITE, new Address(2, 3));

    // TODO: 本当は石を置いた後に想定通りの盤面が描写されているかの確認を書きたい
    expect(result).toBeTruthy();
  });

  test('黒石を白石で挟めない場所には白石を置けないこと', () => {
    const board = new Board();
    const result = board.put(WHITE, new Address(3, 3));

    // TODO: 本当は石を置いた後に想定通りの盤面が描写されているかの確認を書きたい
    expect(result).toBeFalsy();
  });
});
