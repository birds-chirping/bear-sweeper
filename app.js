import Board from "./board.js";

let board = null;
const btn = document.querySelector('.new-game-btn');


// window.addEventListener('touchstart', setInputType);

// function setInputType() {
//     document.body.setAttribute('input-type', 'touch');
//     window.removeEventListener('touchstart', setInputType);
// }


btn.addEventListener('click', play);

function play() {
    board = undefined;
    board = new Board(16, 40);
    board.createGrid();
}


play();


// 8x8 - 10x10 => 10 bears
// 13x15 - 16x16 => 40 bears
//  16x30 => 99 bears

