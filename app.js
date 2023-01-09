import Board from "./board.js";

let board = null;
const btn = document.querySelector('.new-game-btn');

btn.addEventListener('click', play);

function play() {
    board = undefined;
    board = new Board(16, 45);
    board.createGrid();
}


play();


// 8x8 - 10x10 => 10 bears
// 13x15 - 16x16 => 40 bears
//  16x30 => 99 bears

