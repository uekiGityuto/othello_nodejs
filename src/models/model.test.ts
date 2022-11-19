import { BLACK, Stone, WHITE } from './model';

test('Stoneのgetで正しく石が取得できること', () => {
  const blackStone = new Stone(BLACK);
  expect(blackStone.get()).toBe('●');
  const whiteStone = new Stone(WHITE);
  expect(whiteStone.get()).toBe('o');
});

test('StoneのisBlackで石の色が判定できること', () => {
  const blackStone = new Stone(BLACK);
  expect(blackStone.isBlack()).toBeTruthy();
  const whiteStone = new Stone(WHITE);
  expect(whiteStone.isBlack()).toBeFalsy();
});

test('Stoneのreverseで石の色が反転できること', () => {
  const stone = new Stone(BLACK);
  stone.reverse();
  expect(stone).toStrictEqual(new Stone(WHITE));
  stone.reverse();
  expect(stone).toStrictEqual(new Stone(BLACK));
});

// testの書き方を確認したかっただけなので他のテストは省略（やる気になった時に作成する）
