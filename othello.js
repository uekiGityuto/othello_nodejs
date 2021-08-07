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


const board = new Board
// drawBoard_tomoya()
console.log(board.drawBoard());