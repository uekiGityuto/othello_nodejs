# othello_nodejs

## 概要

ターミナルで遊ぶオセロ。

## 仕様

- 8 \* 8 の盤面が出てくる
- ゲーム開始時に白 2 黒 2 が置かれている
- 盤面で自分と違う色の石の隣に黒 or 白の石を置ける
- 違う色で挟まれたらところに石を置かれたら、挟まれた石は色が反転する
- 終了時に勝敗を判定

## 必要

node, npm, yarn
(node v18.12.1 で動作確認済み)

### エディタ

VS Code

### 拡張機能

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 環境準備

```
yarn install
```

## テスト方法

```
yarn test
```

## ビルド方法

```
yarn tsc
```

## デバッグ方法

`src/main.ts`をアクティブなタブにした状態で VS Code のデバッグを実行する。

## 実行方法

```
yarn run ts-node src/main.ts
```

## 遊び方

起動すると説明が出てきます。

## 注意

設定ファイルの内容などは基本的に他サイトからのコピペで、動作確認はしていますが、細かな精査はしていません。

また、実行方法なども軽くググって見つかった方法で実行しているだけなので、他により良い方法があるかもしれません。
